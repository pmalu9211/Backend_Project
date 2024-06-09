import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body; //get's it from the body
  if (!content) {
    throw new ApiError(402, "Need content in tweet");
  }

  const tweet = await Tweet.create({
    //creates a new document with the content
    content,
    owner: req.user?._id,
  });

  // console.log("tweeet", tweet);

  res
    .status(200)
    .json(new ApiResponse(200, { tweet }, "Tweet was created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // console.log(req.params);
  // TODO: get user tweets
  const usersTweet = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.params.userId),
      },
    }, //aggregate fuction here gives result as the owner of the tweets match the userId of the given user via params(url)

    // {
    //   $lookup: {
    //     from: "users",
    //     localField: "owner",
    //     foreignField: "_id",
    //     as: "userTweets",
    //   },
    // },
  ]);
  if (!usersTweet) {
    throw new ApiError(400, "tweets not found");
  }
  // console.log(usersTweet[0]);

  res
    .status(200)
    .json(new ApiResponse(200, usersTweet, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { updatedContent } = req.body;
  if (!updatedContent) {
    throw new ApiError(400, "No content found");
  }
  const updatedTweet = await Tweet.findByIdAndUpdate(req.params.tweetId, {
    $set: {
      content: updatedContent,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "tweet updated successfully"));

  //TODO: update tweet
});

const deleteTweet = asyncHandler(async (req, res) => {
  //deletedtweet give null if the tweet is not found and returns the deleted tweet if not
  const deletedTweet = await Tweet.findByIdAndDelete(req.params.tweetId);
  if (deletedTweet == null) {
    throw new ApiError(400, "tweet not found");
  }
  res.status(200).json(new ApiResponse(200, deletedTweet, "Tweet deleted"));
  //TODO: delete tweet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
