const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  // console.log(err.message);
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'something went wrong try again',
  };
  if (err instanceof CustomAPIError) {
    console.log('errorHandlerMiddleware1');

    return res.status(err.statusCode).json({ msg: err.message });
  }
  console.log('errorHandlerMiddleware2');
  if (err.code && err.code === 11000) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        msg: `${err.keyValue['email']} cant duplicated for registering again `,
      });
  }
  //  return res.status(customError.statusCode).json({ err })//;to show and handle the errors on postman to work with it
  if (err.value && err.name === 'CastError') {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = `${err.value} not a valid id for tasks`;
  } 
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
