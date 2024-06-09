import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const verifyAccessToPlaylist = asyncHandler(async (req, res, next) => {
  const { playlistId } = req.params;
  const playlist = await Playlist.findOne(
    { owner: req.user._id },
    { _id: playlistId },
  );
  if (!playlist) {
    throw new ApiError(
      400,
      "Authorizitaion revoed, this playlist dosen't belongs to you",
    );
  }
  next();
});

export default verifyAccessToPlaylist;
