import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    //console.log("cookies", req.cookies);
    //console.log("res", res);
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); // if the token is not with the cookie, it eiher is abscent or in the form of Bearer <Token>
    console.log(req);
    if (!token) {
      res.status(401).json({ message: "Token not found" });
      // res.end();
      // next(new error());
      // next()

      // throw new ApiError(401, "token not found (authorization req)");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); //decoded Token has the parameters that are declared by us in the the userModule.js file and we give it userId as _id and we can access it via the decoded token as we can see that on the jwt website

    const user = await User.findById(decodeToken._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      throw new ApiError(401, "invalid user token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    // throw new ApiError(401, error?.message || "Invalid access ");
    res.status(400).json({ message: error?.message });
  }
});
