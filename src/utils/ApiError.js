class ApiError extends Error {
  constructor(
    statuscode,
    message = "somethig went wrong",
    errors = [],
    stack = "",
  ) {
    super(message); //the error class made via node requires just the message and we are calling it and it has all the variables and fuctions in it and we are overwritting the remaining variables accoring to the need takein in the constructor
    this.message = message;
    this.statuscode = statuscode;
    // this.message = message;
    this.success = false; //for the frontend developer to recognize if there is erroe or not
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

//statndardised error extended via error class and has all the fields required for the use
