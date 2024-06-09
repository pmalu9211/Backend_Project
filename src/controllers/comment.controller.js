import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 1 } = req.query;

  const comments = await Comment.aggregate([
    {
      $match: { video: new mongoose.Types.ObjectId(videoId) },
    },
  ]);

  await Comment.aggregatePaginate(comments, { page, limit }, (err, result) => {
    if (err) {
      res.status(300);
      throw new ApiError(300, "error displaying the comments");
    } else {
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            result,
            "Comments fetched and paginated successfully",
          ),
        );
    }
  });
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!videoId) {
    throw new ApiError(404, "missing or video not found");
  }
  if (!content) {
    throw new ApiError(400, "Content is missing ");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  if (!comment) {
    throw new ApiError(300, "there was a problem creating a comment");
  }

  res.status(200).json(new ApiResponse(200, comment, "commented successfully"));

  // TODO: add a comment to a video
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "comment not found");
  }
  const { content = comment.content } = req.body;

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    { new: true },
  );

  if (!updateComment) {
    throw new ApiError(300, "there was an error with updating the comments");
  }

  res.status(200).json(new ApiResponse(200, updatedComment, "comment upated"));
  // TODO: update a comment
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "comment not found");
  }
  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (!deletedComment) {
    throw new ApiError(300, "there was an error with deleting the comments");
  }

  res.status(200).json(new ApiResponse(200, deletedComment, "comment deleted"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
