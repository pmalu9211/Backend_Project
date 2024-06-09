import { Router } from "express";
import {
  changePassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();
userRouter.route("/register").post(
  upload.fields([
    //fields is used here, coz we have multiple files not just one, if there was just one then we could have used different method
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]), // this is the middleware from the malter, that let's us store the image onour server( computer ), these are the fields we are storing
  registerUser,
);

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(verifyJWT, logoutUser);

userRouter.route("/refresh-token").post(refreshAccessToken);

userRouter.route("/change-password").post(verifyJWT, changePassword);

userRouter.route("/current-user").get(verifyJWT, getCurrentUser);

userRouter.route("/update-account").patch(verifyJWT, updateAccountDetails);

userRouter.route("");

userRouter
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatar);

userRouter
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateCoverImage);

userRouter.route("/c/:username").get(verifyJWT, getUserChannelProfile);

userRouter.route("/history").get(verifyJWT, getWatchHistory);

// userRouter.route("/:username")

export default userRouter;
