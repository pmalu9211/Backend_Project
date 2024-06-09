import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import verifyAccessToPlaylist from "../middlewares/playlistauth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createPlaylist);

router
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(verifyAccessToPlaylist, updatePlaylist)
  .delete(verifyAccessToPlaylist, deletePlaylist);

router
  .route("/add/:videoId/:playlistId")
  .patch(verifyAccessToPlaylist, addVideoToPlaylist);
router
  .route("/remove/:videoId/:playlistId")
  .patch(verifyAccessToPlaylist, removeVideoFromPlaylist);

router.route("/user/:userId").get(getUserPlaylists);

export default router;
