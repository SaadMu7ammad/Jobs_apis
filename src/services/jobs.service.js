const {
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
} = require('../errors');
const Job = require('../models/Job');

const getAllJobs = async (userId) => {
  if (!userId) throw new NotFoundError('no user found');
  const jobs = await Job.find({ createdBy: userId }).sort('createdAt');
  return jobs;
};
const getJob = async (userId, jobId) => {
  if (!userId) throw new NotFoundError('no user found');
  if (!jobId) throw new BadRequestError('no job found');

  const job = await Job.findOne({ _id: jobId, createdBy: userId }); //to check that job id is unique for one user
  if (!job) throw new NotFoundError('Not Found task with id');
  return job;
};
const createJob = async (reqBody, userId) => {
  if (!reqBody) throw new BadRequestError('no complete data sent');
  if (!userId) throw new NotFoundError('no user found');

  reqBody.createdBy = userId;
  const job = await Job.create(reqBody);
  if (!job) throw new BadRequestError('job is not created');
  return job;
};
const editJob = async (body, userId, jobId) => {
  if (!userId) throw new NotFoundError('no user found');
  if (!jobId) throw new BadRequestError('no job found');
  if (!body) throw new BadRequestError('no value entered to update the task');
  const { name, position } = body;
  if (!name.trim() || !position.trim())
    throw new BadRequestError('no value entered to update the task');
  // console.log(jobId);
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    { company: name, position: position },
    { new: true, runValidators: true } //coz without that after send res and updated the db job still old val in postman
  );
  if (!job) throw new NotFoundError('Not Found task with id');
  return job;
};
const deleteJob = async (userId, jobId) => {
  if (!userId) throw new NotFoundError('no user found');
  if (!jobId) throw new BadRequestError('no job found');

  const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: userId }); //to check that job id is unique for one user
  if (!job) throw new NotFoundError('Not Found task with id');
  return job;
};
module.exports = {
  getAllJobs,
  getJob,
  createJob,
  editJob,
  deleteJob,
};
