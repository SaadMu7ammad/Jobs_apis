const express = require('express');
const router = express.Router();
const jobsControllers = require('../controllers/jobs');

router
  .route('/')
  .get(jobsControllers.getAllJobs)
  .post(jobsControllers.createJob);
router
  .route('/:jobId')
  .get(jobsControllers.getJob)
  .patch(jobsControllers.editJob)
  .delete(jobsControllers.deleteJob);

module.exports = router;
