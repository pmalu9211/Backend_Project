import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) {
    throw new ApiError(400, "ChannelId required");
  }

  const checkChannel = await User.findById(channelId);

  if (!checkChannel) {
    throw new ApiError(400, "Invalid channel");
  }

  const subscribed = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });
  // const user = User.aggregate([
  //   {
  //     $lookup: {
  //       from : "subscriptions",
  //       foreignField : "_id",
  //       localField: "channel"
  //     }
  //   }
  // ])

  if (subscribed) {
    const unsubscribe = await Subscription.findByIdAndDelete(subscribed._id);

    res.status(200).json(new ApiResponse(200, unsubscribe, "unsubscribed"));
  } else {
    const subscribe = await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });
    res.status(200).json(new ApiResponse(200, subscribe, "subscribed"));
  }

  // TODO: toggle subscription
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  console.log(channelId);

  const list = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    // {
    //   $addFields: {
    //     sum: { $sum: 1 },
    //   },
    // },
    // {
    //   $match: {
    //     _id: new mongoose.Types.ObjectId(channelId),
    //   },
    // },
    // {
    //   $lookup: {
    //     from: "users",
    //     foreignField: "_id",
    //     localField: "subscriber",
    //     as: "List",
    //     // pipeline: [
    //     //   {
    //     //     $project: { _id: 1, username: 1, email: 1, fullName: 1 },
    //     //   },
    //     // ],
    //   },
    // },
    // {
    //   $project: {
    //     List: 1,
    //   },
    // },
  ]);

  console.log(list);
  res.status(200).json(new ApiResponse(200, list, "done"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  const subscribed = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    // {
    //   $addFields: {
    //     sum: { $sum: 1 },
    //   },
    // },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, subscribed, "Subscribers fetched "));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
