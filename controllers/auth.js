const { BadRequestError ,UnauthenticatedError} = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

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

const login = async (req, res, next) => {
  // res.send('login user');
  const {  email, password } = req.body;
  if ( !email || !password) throw new BadRequestError('empty inputs');
  
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('invalid credentials');
  }
  const isMatch = await user.comparePassword(password)

  if (!isMatch) throw new UnauthenticatedError('not correct password');
  
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
};
module.exports = {
  register,
  login,
};
