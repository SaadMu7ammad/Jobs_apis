const { UnauthenticatedError, BadRequestError } = require('../errors');
const User = require('../models/User');

const login = async (email, password) => {
  if (!email || !password) throw new BadRequestError('empty inputs');

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('invalid credentials');
  }
  const isMatch = await user.comparePassword(password);

  if (!isMatch) throw new UnauthenticatedError('not correct password');

  const token = user.createJWT();
  return {
    user: {
      name: user.name,
      email: user.email,
      id: user._id,
    },
    token: token,
  };
};

const register = async (name, email, password) => {
  if (!name || !email || !password) throw new BadRequestError('empty inputs');
  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  return {
    user: {
      name: user.name,
      email: user.email,
      id: user._id,
    },
    token: token,
  };
};

module.exports = {
  login,
  register,
};
