import mongoose, { isValidObjectId, mongo } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description = `created by user ${req.user.fullName} ` } =
    req.body;
  if (!(name && description)) {
    throw new ApiError(400, "name and description required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });

  if (!playlist) {
    throw new ApiError(500, "unable to create playlist");
  }

  res.status(200).json(new ApiResponse(200, playlist, "playlist created"));

  //TODO: create playlist
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!(await User.findById(userId))) {
    throw new ApiError(404, "user not found");
  }

  const playlists = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
  ]);

  //this is to get the user and playlist as it's attribute
  /*const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "playlists",
        localField: "_id",
        foreignField: "owner",
        as: "playlist",
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        email: 1,
        fullNameL: 1,
        avatar: 1,
        coverImage: 1,
        createdAt: 1,
        updatedAt: 1,
        playlist: 1,
      },
    },
  ]);
  console.log(user);*/

  console.log(playlists);

  res
    .status(200)
    .json(new ApiResponse(200, playlists, "playlists fetched successfully"));

  //TODO: get user playlists
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  const videoList = playlist.videos;
  // console.log("videoList", videoList);

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        videos: [...videoList, videoId],
      },
    },
    {
      new: true,
    },
  );

  res.status(200).json(new ApiResponse(200, updatedPlaylist, "video added"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  let videoList = playlist.videos;
  videoList = videoList.filter((value) => {
    return (
      JSON.stringify(value) !==
      JSON.stringify(new mongoose.Types.ObjectId(videoId))
    );
  });

  // console.log(jet);
  // console.log(new mongoose.Types.ObjectId(videoId));

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        videos: videoList,
      },
    },
    {
      new: true,
    },
  );

  res.status(200).json(new ApiResponse(200, updatedPlaylist, "video removed"));
  // TODO: remove video from playlist
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
  if (!deletedPlaylist) {
    throw new ApiError(
      404,
      " either there was a problem delteing playlist or playlist in not in existance",
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, deletePlaylist, "playlist deleted successfully"),
    );
  // TODO: delete playlist
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }
  const { name = playlist.name, description = playlist.description } = req.body;

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        name,
        description,
      },
    },
    { new: true },
  );
  //TODO: update playlist
  res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "playlist updates successfully"),
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
