import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js"; //this user can contact directly with the database as it has been created via mangoose so we use it for many things
import uploadOnCloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Can't generate Tokens(access or refresh");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  console.log(req.files);

  //get user deteil
  //validation - not empty
  //unique
  //check images, videos, avatar
  //upload to cloudnary
  //create user object - create entry in db
  //remove pass and refresh token
  //check for user creation
  //return res
  const { fullName, email, username, password } = req.body;
  console.log("email", email);
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "The fields can't be empty ");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already existed");
  }
  console.log(req);

  // console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path; //?is for if it is there then only we will get, to prevent errror
  // const coverImaggePath = req.files?.coverImage[0]?.path;
  const coverImagePath = Array.isArray(req.files?.coverImage)
    ? req.files.coverImage[0]?.path
    : "";

  if (!avatarLocalPath) {
    throw new ApiError(400, " upload avatar required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImagePath);

  if (!avatar) {
    throw new ApiError(400, " upload avatar required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  console.log("user", user);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  ); //weired syntax but createdUser dosn't has the field passeord and refreshToken in it as we don't want them to send to the user

  if (!createdUser) {
    throw new ApiError(500, "unable to create user");
  }
  console.log("createduser", createdUser);

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registed successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  try {
    console.log(req.body);
    //get the info about the user
    // username or pass to check if user is valid
    //find the user => if not error
    //check if the password matches
    //access and refress token
    //send cookies

    const { username, email, password } = req.body;
    if (!username && !email) {
      // res.status(402).json(new ApiError(402, "altastekn nigga"));
      throw new ApiError(400, "alteast provie emali of username");
      // res.status(400).json(new ApiError(400, "ENter stuff"));
    }

    if (!password) {
      throw new ApiError(400, "Password mus be entered");
    }

    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      throw new ApiError(404, "User is not registered, please register ");
    }

    const isValidUser = await user.isPasswordCorrect(password);

    if (!isValidUser) {
      throw new ApiError(400, "Incorrect password");
    }

    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(user);
    //different code  21:31 / 1:02:44  Access Refresh Token, Middleware and cookies in Backend

    const loggedinUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedinUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully",
        ),
      );
  } catch (error) {
    res
      .status(error.statuscode || 400)
      .json({ message: error.message || "something went wrong" });
    console.log(error);
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out"));
});

//this refreshAccessToken refreshs the access token after it has ran out of it's time when the refresh token matches with the users one and database one
const refreshAccessToken = asyncHandler(async (req, res) => {
  console.log(req.cookies);
  try {
    console.log("hello");
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "You don't have an refresh token ");
    }

    const decodedToken = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new (401, "Invalid refresh token")();
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, " refresh token has changed, used or expired");
    }

    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(user);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Updated refresh token successfully",
        ),
      );
  } catch (error) {
    console.log(error);
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  // console.log(req.body);

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(400, "User not logged in");
  }

  console.log("password", user.password);
  console.log("OLD", oldPassword);

  if (!user.isPasswordCorrect(oldPassword)) {
    throw new ApiError(402, "Password dosn't match");
  }

  if (newPassword === oldPassword) {
    throw new ApiError(401, "New password can't be same as old one");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, fullName } = req.body;

  if (!(username && fullName)) {
    throw new ApiError(401, "Name and username is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        username: username,
        fullName: fullName,
      },
    },
    { new: true },
  ).select("-password");

  res
    .status(200)
    .json(new ApiResponse(200, user, "account updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarPath = req.file?.path;
  if (!avatarPath) {
    throw new ApiError(400, "Image not found");
  }
  const avatar = await uploadOnCloudinary(avatarPath);
  if (!avatar) {
    throw new ApiError(400, "Image not uploaded");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true },
  ).select("-password");

  res
    .status(200)
    .json(new ApiResponse(200, user, "avatarchanged successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImagePath = req.file?.path;
  if (!coverImagePath) {
    throw new ApiError(400, "Image not found");
  }
  const coverImage = await uploadOnCloudinary(coverImagePath);

  if (!coverImage) {
    throw new ApiError(400, "Imagenot uploaded successfully");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true },
  ).select("-password");

  res
    .status(200)
    .json(new ApiResponse(200, user, "avatarchanged successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    // {
    //   $project: {
    //     fullName: 1,
    //     username: 1,
    //     subscribersCount: 1,
    //     channelsSubscribedToCount: 1,
    //     isSubscribed: 1,
    //     avatar: 1,
    //     coverImage: 1,
    //     email: 1,
    //   },
    // },
  ]);

  if (!channel?.length) {
    throw new ApiError(400, "channel dosn't exists");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channel, " user channel fetched successfully"));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "user",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    avatar: 1,
                    username: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $arrayElemAt: ["$owner", 0],
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, user[0].watchHistory, "watch history fetched"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
