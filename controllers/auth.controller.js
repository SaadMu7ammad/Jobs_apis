const { BadRequestError, UnauthenticatedError } = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const authService = require('../services/auth.service');
/**
 * Handles user Register.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} A promise that resolves once the response is sent.
 * @throws {Error} If there is an issue during the login process.
 */
const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await authService.register(name, email, password);
  res.status(StatusCodes.CREATED).json(user);
};
/**
 * Handles user login.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} A promise that resolves once the response is sent.
 * @throws {Error} If there is an issue during the login process.
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  res.status(StatusCodes.OK).json(user);
};
module.exports = {
  register,
  login,
};
