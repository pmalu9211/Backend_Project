import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!Video.findById(videoId)) {
    throw new ApiError(404, "Couldn't find a video");
  }
  const isLiked = await Like.findOne({ video: videoId, likedBy: req.user._id });
  if (isLiked) {
    const deletedLike = await Like.findByIdAndDelete(isLiked._id);
    if (!deletedLike) {
      throw new ApiError(400, "couldn't remove like");
    }
    res.status(200).json(new ApiResponse(200, deletedLike, "like removed"));
  } else {
    const addedLike = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
    if (!addedLike) {
      throw new ApiError(400, "Couldn't like");
    }

    res.status(200).json(new ApiResponse(200, addedLike, "Liked"));
  }
  //TODO: toggle like on video
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!Comment.findById(commentId)) {
    throw new ApiError(404, "Couldn't find a comment");
  }
  const isLiked = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });
  if (isLiked) {
    const deletedLike = await Like.findByIdAndDelete(isLiked._id);
    if (!deletedLike) {
      throw new ApiError(400, "couldn't remove like");
    }
    res.status(200).json(new ApiResponse(200, deletedLike, "like removed"));
  } else {
    const addedLike = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
    if (!addedLike) {
      throw new ApiError(400, "Couldn't like");
    }

    res.status(200).json(new ApiResponse(200, addedLike, "Liked"));
  }
  //TODO: toggle like on comment
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!Tweet.findById(tweetId)) {
    throw new ApiError(404, "Couldn't find a tweet");
  }
  const isLiked = await Like.findOne({ tweet: tweetId, likedBy: req.user._id });
  if (isLiked) {
    const deletedLike = await Like.findByIdAndDelete(isLiked._id);
    if (!deletedLike) {
      throw new ApiError(400, "couldn't remove like");
    }
    res.status(200).json(new ApiResponse(200, deletedLike, "like removed"));
  } else {
    const addedLike = await Like.create({
      tweet: tweetId,
      likedBy: res.user._id,
    });
    if (!addedLike) {
      throw new ApiError(400, "Couldn't like");
    }

    res.status(200).json(new ApiResponse(200, addedLike, "Liked"));
  }
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id),
        // video: { $ifNull: ["$video", null] },
        video: { $ne: null },
      },
    },
    {
      $project: {
        video: 1,
      },
    },
  ]);
  // .select("-comment -tweet");
  //TODO: get all liked videos
  res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "fetched Liked videos"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
