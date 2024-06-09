const asyncHandler = (requestHandler) => (req, res, next) =>
  Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));

export { asyncHandler };

//this handles the asynchronus code fuction for us, it wraps it and try and catch work is done there once in for all
