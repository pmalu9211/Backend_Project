import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const { channelId } = req.params;
  if (!(await User.findById(channelId))) {
    throw new ApiError(404, "user not found");
  }
  const views = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos",
      },
    },
    {
      $addFields: {
        totalViews: {
          $sum: "$videos.views",
        },
        totalVideos: {
          $size: "$videos",
        },
      },
    },
    {
      $project: {
        totalViews: 1,
        totalVideos: 1,
      },
    },
  ]);

  const likes = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "likes",
        foreignField: "likedBy",
        localField: "_id",
        as: "Likes",
      },
    },
    {
      $addFields: {
        commentLikes: {
          $ifNull: ["$Likes.comment", []],
        },
        videoLikes: {
          $ifNull: ["$Likes.video", []],
        },
        tweetLikes: {
          $ifNull: ["$Likes.tweet", []],
        },
      },
    },
    {
      $addFields: {
        totalCommentLikes: {
          $size: { $ifNull: ["$commentLikes", []] },
        },
        totalVideoLikes: {
          $size: { $ifNull: ["$videoLikes", []] },
        },
        totalTweetLikes: {
          $size: { $ifNull: ["$tweetLikes", []] },
        },
      },
    },
    {
      $project: {
        commentLikes: 1,
        videoLikes: 1,
        tweetLikes: 1,
        totalCommentLikes: 1,
        totalTweetLikes: 1,
        totalVideoLikes: 1,
      },
    },
  ]);

  console.log(likes);

  const totalLikes = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(channelId) },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "likedBy",
        as: "likes",
      },
    },
    {
      $addFields: {
        totalLikes: {
          $size: "$likes",
        },
      },
    },
    {
      $project: {
        totalLikes: 1,
      },
    },
  ]);

  const subscribe = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscription",
      },
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        subscriptionCount: {
          $size: "$subscription",
        },
      },
    },
    {
      $project: {
        subscribersCount: 1,
        subscriptionCount: 1,
      },
    },
  ]);

  const likesOnVideo = await Video.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(channelId) },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "videoLikes",
      },
    },
    {
      $addFields: {
        videoLikesCount: { $size: "$videoLikes" },
      },
    },
    {
      $project: {
        videoLikesCount: 1,
        videoLikes: 1,
      },
    },
  ]);

  console.log(likesOnVideo);
  res.json(
    new ApiResponse(
      200,
      { views, likes, totalLikes, likesOnVideo, subscribe },
      "Data fetched successfully",
    ),
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const { channelId } = req.params;
  if (!(await User.findById(channelId))) {
    throw new ApiError(404, "user not found");
  }
  const videos = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "videos",
        foreignField: "owner",
        localField: "_id",
        as: "videos",
      },
    },
    {
      $project: {
        videos: 1,
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, videos, "videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
