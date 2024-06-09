import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const verifyAccessToTweet = asyncHandler(async (req, res, next) => {
  const { tweeetId } = req.params;
  const tweet = await Tweet.findOne({ owner: req.user._id }, { _id: tweeetId });
  if (!tweet) {
    throw new ApiError(
      400,
      "Authorizitaion revoed, this playlist dosen't belongs to you",
    );
  }
  next();
});

export default verifyAccessToTweet;
