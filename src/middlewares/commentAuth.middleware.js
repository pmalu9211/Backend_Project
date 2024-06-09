import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const verifyAccessToComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const comment = await Comment.findOne(
    { owner: req.user._id },
    { _id: commentId },
  );
  if (!comment) {
    throw new ApiError(
      400,
      "Authorizitaion revoed, this playlist dosen't belongs to you",
    );
  }
  next();
});

export default verifyAccessToComment;
