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
      expect(res.body).toHaveProperty('count', 6);
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
  describe('api testing for creating a job ', () => {
    it('should throw error when user is not exist when creating a job', async () => {
      const res = await request(startApp).post('/api/v1/jobs').send({
        company: 'temp',
        position: 'temp dev',
      });
      // .set('Authorization', `Bearer ${}`);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('msg', `Authentication invalid`);
    });
    it('should throw error when data is not completed', async () => {
      const res = await request(startApp)
        .post('/api/v1/jobs')
        .send({
          company: 'temp',
          //   position: 'temp dev',
        })
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty(
        'msg',
        `Job validation failed: position: Please provide position`
      );
    });
    it('should throw error when data is empty', async () => {
      const res = await request(startApp)
        .post('/api/v1/jobs')
        .send({
          company: '',
          position: '',
        })
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty(
        'msg',
        `Job validation failed: company: Please provide company name, position: Please provide position`
      );
    });
    it('happy scenario', async () => {
      const obj = {
        name: 'test',
        email: 'test@gmail.com',
        password: 'saad12',
      };

      const loginResponse = await request(startApp)
        .post('/api/v1/auth/login')
        .send(obj);
      token = loginResponse.body.token;

      const res = await request(startApp)
        .post('/api/v1/jobs')
        .send({
          company: 'testcomp',
          position: 'testpos',
        })
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(201);
      expect(res.body.newJob).toHaveProperty('position', `testpos`);
      await Job.findByIdAndDelete(res.body.newJob._id);
    });
  });
  describe('api testing for editing a job ', () => {
    it('should throw error when user is not exist when editing a job', async () => {
      const obj = {
        name: 'testSaad',
        email: 'testSaad@gmail.com',
        password: '123456',
      };

      const loginResponse = await request(startApp)
        .post('/api/v1/auth/login')
        .send(obj);

      token = loginResponse.body.token;
      const res = await request(startApp)
        .patch('/api/v1/jobs/656a1a903d9ad512b4b1a4a2')
        .send({
          name: 'temp1',
        });
      // .set('Authorization', `Bearer ${}`);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('msg', `Authentication invalid`);
    });
    it('should throw error with invalid id', async () => {
      const body = {
        name: '123',
        position: '456',
      };
      const res = await request(startApp)
        .patch('/api/v1/jobs/123')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('msg', `123 not a valid id for tasks`);
    });
    it('should throw error with not founded id', async () => {
      const body = {
        name: '123',
        position: '456',
      };
      const res = await request(startApp)
        .patch('/api/v1/jobs/64fc2cf19c28d834083edaca')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('msg', `Not Found task with id`);
    });
    it('happy scenario', async () => {
      const body = {
        name: '123',
        position: '456',
      };
      const res = await request(startApp)
        .patch('/api/v1/jobs/64fc2fbbb4967b001b7b43b7')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
      expect(res.status).toBe(200);
      expect(res.body.updatedJob).toHaveProperty('company', `123`);
    });
  });
  describe('api testing for deleting a job ', () => {
    it('should throw error when user is not exist when deleting a job', async () => {
      const res = await request(startApp)
        .delete('/api/v1/jobs')
        .send({
          company: 'tempfordel',
          position: 'tempfordel',
        })
        .set('Authorization', `Bearer ${null}`);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('msg', `Authentication invalid`);
    });

    it('should throw error when job is not founded', async () => {
      const res = await request(startApp)
        .delete(`/api/v1/jobs/64fc2cf19c28d834083edacc`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('msg', `Not Found task with id`);
    });
    it('happy scneario', async () => {
      const res = await request(startApp)
        .post('/api/v1/jobs')
        .send({
          company: 'tempfordel',
          position: 'tempfordel',
        })
        .set('Authorization', `Bearer ${token}`);
      const res2 = await request(startApp)
        .delete(`/api/v1/jobs/${res.body.newJob._id}`)
        .send({
          company: 'tempfordel',
          position: 'tempfordel',
        })
        .set('Authorization', `Bearer ${token}`);
      expect(res2.status).toBe(200);
      expect(res2.body.deletedJob).toHaveProperty('company', `tempfordel`);
      //   await Job.findByIdAndDelete(res.body.newJob._id);
    });
  });
});
