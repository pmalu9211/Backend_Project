import { ApiError } from "../utils/ApiError.js";
import ApiResposne from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  try {
    if (req.user) {
      res
        .status(200)
        .json(new ApiResposne(200, {}, "everything is wroking good"));
    }
  } catch (Error) {
    throw new ApiError(400, `${Error}`);
    // res.status(400).json()
  }
  //TODO: build a healthcheck response that simply returns the OK status as json with a message
});

export { healthcheck };
