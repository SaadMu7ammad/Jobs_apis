const request = require('supertest');
const { startApp } = require('../../server');
const mongoose = require('mongoose');
const User = require('../../src/models/User');

afterAll(async () => {
  await mongoose.disconnect();
  await startApp.close();
});
beforeAll(async () => {
  await User.findOneAndDelete({ email: 'newtest@gmail.com' });
});
describe('api testing for register user ', () => {
  it('should throw error when user is registered before', async () => {
    const existingObj = {
      name: 'test',
      email: 'test@gmail.com',
      password: 'saad12',
    };
    const res = await request(startApp)
      .post('/api/v1/auth/register')
      .send(existingObj);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'msg',
      `${existingObj.email} cant duplicated for registering again `
    );
  });
  it('should throw error when any parameters are missing', async () => {
    const existingObj = {
      name: 'test',
      email: 'test@gmail.com',
    };
    const res = await request(startApp)
      .post('/api/v1/auth/register')
      .send(existingObj);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('msg', `empty inputs`);
  });
  it('happy scenario', async () => {
    const newObj = {
      name: 'newtest',
      email: 'newtest@gmail.com',
      password: 'newtest',
    };
    const res = await request(startApp)
      .post('/api/v1/auth/register')
      .send(newObj);
    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('name', newObj.name);
  });
});
