const request = require('supertest');
const { startApp } = require('../../server');
const mongoose = require('mongoose');
// const User = require('../../src/models/User');
const Job = require('../../src/models/Job');
let token;
afterAll(async () => {
  await mongoose.disconnect();
  await startApp.close();
});
beforeAll(async () => {
  const obj = {
    name: 'testSaad',
    email: 'testSaad@gmail.com',
    password: '123456',
  };

  const loginResponse = await request(startApp)
    .post('/api/v1/auth/login')
    .send(obj);

  token = loginResponse.body.token;

  //   await request(startApp)
  //     .post('/api/v1/jobs')
  //     .send({
  //       company: 'test company',
  //       position: 'test dev',
  //     })
  //     .set('Authorization', `Bearer ${token}`);
});
describe('api teseing for profile.service', () => {
  describe('api testing for getting all jobs ', () => {
    it('should throw error when user is not exist when getting all jobs', async () => {
      const res = await request(startApp).get('/api/v1/jobs');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('msg', `Authentication invalid`);
    });
    it('Invalid token', async () => {
      const res = await request(startApp)
        .get('/api/v1/jobs')
        .set('Authorization', `Bearer ${null}`);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('msg', 'Authentication invalid');
    });
    it('happy scenario', async () => {
      const res = await request(startApp)
        .get('/api/v1/jobs')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('count', 5);
    });
  });
  describe('api testing for get a job ', () => {
    it('should throw error when user is not exist when getting a job', async () => {
      const res = await request(startApp).get('/api/v1/jobs/123');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('msg', `Authentication invalid`);
    });
    it('should throw error when id is not valid for getting a job', async () => {
      const res = await request(startApp)
        .get('/api/v1/jobs/null')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('msg', `null not a valid id for tasks`);
    });
    it('should throw error when id is not found for getting a job', async () => {
      const res = await request(startApp)
        .get('/api/v1/jobs/64fc2cf19c28d834083edaca')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('msg', `Not Found task with id`);
    });
    it('happy scenario', async () => {
      const res = await request(startApp)
        .get('/api/v1/jobs/656a1a903d9ad512b4b1a4a2')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.job).toHaveProperty('_id', `656a1a903d9ad512b4b1a4a2`);
    });
  });
});
