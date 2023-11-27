const { BadRequestError ,UnauthenticatedError} = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const authService=require('../services/auth.service')
const register = async (req, res, next) => {
  // res.send('register user')
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw new BadRequestError('empty inputs');
  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPass = await bcrypt.hash(password, salt);
  //   const tempUser = { name, email, password:hashedPass };//we add : to coz password is just an alias coz in db there is password field
  const user = await User.create(req.body);
  // const token = jwt.sign(
  //   { userId: user._id, name: user.name },
  //   process.env.JWT_SECRET,
  //   { expiresIn: '30d' }
  // );
  const token = user.createJWT();
  // res.status(StatusCodes.CREATED).json({ user: { name: user.getName() }, token });//how to use methods in mongoose
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
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
  const {  email, password } = req.body;
  const user=await authService.login(email,password)
  res.status(StatusCodes.OK).json(user)
};
module.exports = {
  register,
  login,
};
