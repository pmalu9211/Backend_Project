import mongoose, { isValidObjectId, mongo } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
// import paginate from "mongoose-paginate-v2";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 2, query, sortBy, sortType, userId } = req.query;
  console.log(req.query);

  const options = {
    page,
    limit,
    sort: sortBy,
    // sortType,
  };

  const video = Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
  ]);

  const vid = await Video.aggregatePaginate(video, options, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json(new ApiError(400, "can't acces "));
    } else {
      console.log(result);
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            result,
            "Paginate and videos fetched successfully",
          ),
        );
    }
  });
  console.log(vid);
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const videoFilePath = req.files.videoFile[0].path;
  const videoFile = await uploadOnCloudinary(videoFilePath);
  const thumbnailPath = req.files.thumbnail[0].path;
  const thumbnail = await uploadOnCloudinary(thumbnailPath);
  // console.log(videoFile);
  const { title, description } = req.body;

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: videoFile.duration,
    owner: new mongoose.Types.ObjectId(req.user._id),
  });

  res
    .status(200)
    .json(new ApiResponse(200, video, "file uploaded successfully"));
  // TODO: get video, upload to cloudinary, create video
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!(await Video.findById(videoId))) {
    throw new ApiError(400, "No video Id");
  }

  const history = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        // Use $addToSet to add unique items to an array
        watchHistory: new mongoose.Types.ObjectId(videoId), // Convert videoId to ObjectId
      },
    },
    { new: true },
  );

  const views = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      // $match: {
      //   watchHistory: { $all: [new mongoose.Types.ObjectId(videoId)] },
      // },

      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "watchHistory",
        as: "views",
        pipeline: [
          {
            $project: { _id: 1, username: 1, fullName: 1 },
          },
        ],
      },
    },
    {
      $addFields: { viewCount: { $size: "$views" } },
    },
    {
      $project: {
        viewCount: 1,
        views: 1,
      },
    },
  ]);

  // console.log(" hello", history);

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: { views: views[0].viewCount },
    },
    { new: true },
  );

  if (!video) {
    throw new ApiError(400, "invalid video");
  }

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const thumbnailPath = req.file?.path;
  if (thumbnailPath) {
    const thumbnail = await uploadOnCloudinary(thumbnailPath);
    if (thumbnailPath) {
      await Video.findByIdAndUpdate(videoId, {
        $set: {
          thumbnail: thumbnail.url,
        },
      });
    }
  }
  const { title, description } = req.body;
  if (title) {
    await Video.findByIdAndUpdate(videoId, {
      $set: {
        title,
      },
    });
  }
  if (description) {
    await Video.findByIdAndUpdate(videoId, {
      $set: {
        description,
      },
    });
  }

  res.status(200).json(new ApiResponse(200, {}, "updated "));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  const deletedVideo = await Video.findByIdAndDelete(videoId);

  if (!deletedVideo) {
    throw new ApiError(400, "Invalid id");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedVideo, "video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await findById(videoId);

  if (!video) {
    throw new ApiError(400, "invalid video id");
  }
  if (video.isPublished) {
    await Video.findByIdAndUpdate(videoId, {
      $set: {
        isPublished: false,
      },
    });
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Video unpublished successfully"));
  } else {
    await Video.findByIdAndUpdate(videoId, {
      $set: {
        isPublished: true,
      },
    });
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Video published successfully"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Video published successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
