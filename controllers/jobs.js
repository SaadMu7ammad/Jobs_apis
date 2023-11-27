const Job = require('../models/Job');
const { BadRequestError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const getAllJobs = async (req, res, next) => {
  // res.send('getAllJobs');
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req, res, next) => {
  const {
    user: { userId },
    params: { jobId },
  } = req;
  // console.log(jobId);
  const job = await Job.findOne({ _id: jobId, createdBy: userId }); //to check that job id is unique for one user
  if (!job) throw new NotFoundError('Not Found task with id');
  res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req, res, next) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
const editJob = async (req, res, next) => {
  const {
    body: { name ,position},
    user: { userId },
    params: { jobId },
  } = req;
  // const newVal = req.body.name;
  if (!name.trim()||!position.trim()) throw new BadRequestError('no value enterd to update the task');
  // console.log(jobId);
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    { company: name ,position:position},
    { new: true, runValidators: true }//coz without that after send res and updated the db job still old val in postman 
  );
  console.log(job);
  if (!job) throw new NotFoundError('Not Found task with id');
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res, next) => {
  const {
    user: { userId },
    params: { jobId },
  } = req;
  const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: userId }); //to check that job id is unique for one user
  if (!job) throw new NotFoundError('Not Found task with id');
  res.status(StatusCodes.OK).json({ job });};

module.exports = {
  getAllJobs,
  createJob,
  getJob,
  deleteJob,
  editJob,
};
