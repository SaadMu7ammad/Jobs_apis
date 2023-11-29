const Job = require('../models/Job');
const jobs = require('../services/jobs.service');
const { BadRequestError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
/**
 * Handles geting all jobs.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} A promise that resolves once the response is sent.
 * @throws {Error} If there is an issue during the getAllJobs process uploaded by that user who request to get them all.
 */
const getAllJobs = async (req, res, next) => {
  // req.user = { userId: payload.userId, name: payload.name }
  const allJobs = await jobs.getAllJobs(req.user.userId);
  res.status(StatusCodes.OK).json({ allJobs, count: allJobs.length });
};
/**
 * Handles geting a job by an id.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} A promise that resolves once the response is sent.
 * @throws {Error} If there is an issue during the getJobById process uploaded by that user who request to get a specific one.
 */
const getJob = async (req, res, next) => {
  const {
    user: { userId },
    params: { jobId },
  } = req;
  const job = await jobs.getJob(userId, jobId);

  res.status(StatusCodes.OK).json({ job });
};
/**
 * Handles creating a job.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} A promise that resolves once the response is sent.
 * @throws {Error} If there is an issue during the creating a job process.
 */
const createJob = async (req, res, next) => {
  const newJob = await jobs.createJob(req.body, req.user.userId);
  res.status(StatusCodes.CREATED).json({ newJob });
};
/**
 * Handles editing a job.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} A promise that resolves once the response is sent.
 * @throws {Error} If there is an issue during the editing a job process.
 */
const editJob = async (req, res, next) => {
  const {
    body: { name, position },
    user: { userId },
    params: { jobId },
  } = req;
  const body = {
    name,
    position,
  };
  // const newVal = req.body.name;
  const updatedJob = await jobs.editJob(body, userId, jobId);
  res.status(StatusCodes.OK).json({ updatedJob });
};
/**
 * Handles deleting a job.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} A promise that resolves once the response is sent.
 * @throws {Error} If there is an issue during the creadeletinging a job process.
 */
const deleteJob = async (req, res, next) => {
  const {
    user: { userId },
    params: { jobId },
  } = req;
  const deletedJob = await jobs.deleteJob(userId, jobId);
  res.status(StatusCodes.OK).json({ deletedJob });
};

module.exports = {
  getAllJobs,
  createJob,
  getJob,
  deleteJob,
  editJob,
};
