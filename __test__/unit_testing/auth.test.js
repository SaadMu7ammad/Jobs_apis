const User = require('../../src/models/User');
const authService = require('../../src/services/auth.service');
jest.mock('../../src/models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe('unit testing for auth user', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should throw an error if any field is missing', async () => {
    await expect(authService.login()).rejects.toThrow('empty inputs');
  });
  test('should throw an error if user is not founded', async () => {
    User.findOne.mockReturnValue(null);
    await expect(authService.login()).rejects.toThrow();
  });
  test('should throw an error if user entered incorrect password', async () => {
    let user = {
      //a candidate password
      //b origin user password
      comparePassword: jest.fn().mockImplementation((a, b) => a === b),
    };
    User.findOne.mockResolvedValue(user);
    // user.comparePassword = jest.fn().mockResolvedValue(false);
    await expect(authService.login(true, true)).rejects.toThrow(
      'not correct password'
    );
  });
  test('happy tests case all is good :)', async () => {
    let user = {
      email: 'temp@gmailcom',
      password: 'password',
      // comparePassword: jest.fn().mockImplementation((a, b) => a === b),
      createJWT: jest.fn().mockReturnValue('token'),
      comparePassword: jest.fn().mockResolvedValue(true),
    };
    User.findOne.mockResolvedValue(user);
    await expect(
      authService.login(user.email, user.password)
    ).resolves.not.toThrow('not correct password');
  });
});

describe('unit testing for register user', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should throw an error if any field is missing', async () => {
    await expect(authService.register()).rejects.toThrow('empty inputs');
  });
  test('happy tests case all is good :)', async () => {
    let user = {
      createJWT: jest.fn().mockReturnValue('token'),
    };
    User.create.mockResolvedValue(user);
    await expect(authService.register(true, true, true)).resolves.not.toThrow(
      'empty inputs'
    );
  });
});
