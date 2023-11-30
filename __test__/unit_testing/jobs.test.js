const Job = require('../../src/models/Job');
const jobsService = require('../../src/services/jobs.service');
jest.mock('../../src/models/Job', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));
describe('unit testing for jobs.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('unit testing for getting all jobs function', () => {
    it('no user found when getting all jobs', async () => {
      Job.find.mockReturnValue(true);
      await expect(jobsService.getAllJobs()).rejects.toThrow('no user found');
    });
    it('happy test case when getting all jobs', async () => {
      // Job.find.mockResolvedValue(true);
      // Job.find.sort.mockReturnValue(true);
      Job.find.mockReturnValue({
        sort: jest.fn(), //.mockResolvedValue(), // Mock the sort method
      });
      await expect(jobsService.getAllJobs(true)).resolves.not.toThrow(
        'no user found'
      );
    });
  });
  describe('unit testing for get a job functions', () => {
    it('any missing parameters for get a job', async () => {
      await expect(jobsService.getJob(null, true)).rejects.toThrow(
        'no user found'
      );
      await expect(jobsService.getJob(true, null)).rejects.toThrow(
        'no job found'
      );
    });
    it('job is not founded', async () => {
      Job.findOne.mockReturnValue(null);
      await expect(jobsService.getJob(true, true)).rejects.toThrow(
        'Not Found task with id'
      );
    });
    it('all is good happy scenario', async () => {
      Job.findOne.mockReturnValue(true);
      await expect(jobsService.getJob(true, true)).resolves.not.toThrow(
        'Not Found task with id'
      );
    });
  });
  describe('unit testing for creating a job functions', () => {
    it('any missing parameters for creating a job', async () => {
      await expect(jobsService.createJob(null, null)).rejects.toThrow(
        'no complete data sent'
      );
      await expect(jobsService.createJob(true, null)).rejects.toThrow(
        'no user found'
      );
    });
    it('parameters are sent but job not created in db', async () => {
      Job.create.mockReturnValue(null);
      await expect(jobsService.createJob(true, true)).rejects.toThrow(
        'job is not created'
      );
    });
    it('all is good happy scenario', async () => {
      Job.create.mockReturnValue(true);
      await expect(jobsService.createJob(true, true)).resolves.not.toThrow(
        'Not Found task with id'
      );
    });
  });
  describe('unit testing for editing a job functions', () => {
    it('any missing parameters for editing a job', async () => {
      await expect(jobsService.editJob(true, null, true)).rejects.toThrow(
        'no user found'
      );
      await expect(jobsService.editJob(true, true, null)).rejects.toThrow(
        'no job found'
      );
      await expect(jobsService.editJob(null, true, true)).rejects.toThrow(
        'no value entered to update the task'
      );
      //   String.prototype.trim = jest.fn().mockReturnValue(false);

      //   await expect(
      //     jobsService.editJob({ name: 'name', position: 'position' }, true, true)
      //   ).rejects.toThrow('no value entered to update the task');
      //   String.prototype.trim.mockReset();
    });
    it('no job founded to edit', async () => {
      //   String.prototype.trim = jest.fn().mockReturnValue(true); //{ name: 'name', position: 'position' });
      //   Job.findOneAndUpdate.mockReturnValue(false);
      //   await expect(
      //     jobsService.editJob({ name: 'name', position: 'position' }, true, true)
      //   ).rejects.toThrow('Not Found task with id');
      //   String.prototype.trim.mockReset();
    });
    it('all is good happy scenario', async () => {
      //   String.prototype.trim = jest.fn().mockReturnValue(true); //{ name: 'name', position: 'position' });
      //   Job.findOneAndUpdate.mockReturnValue(true);
      //   await expect(
      //     jobsService.editJob({ name: 'name', position: 'position' }, true, true)
      //   ).resolves.not.toThrow('Not Found task with id');
      //   String.prototype.trim.mockReset();
    });
  });

  describe('unit testing for deleting a job functions', () => {
    it('any missing parameters for editing a job', async () => {
      await expect(jobsService.deleteJob(null)).rejects.toThrow(
        'no user found'
      );
      await expect(jobsService.deleteJob(true, null)).rejects.toThrow(
        'no job found'
      );
    });
    it('job is not founded', async () => {
      Job.findByIdAndDelete.mockReturnValue(false);
      await expect(jobsService.deleteJob(true, true)).rejects.toThrow(
        'Not Found task with id'
      );
    });
    it('all is good happy scenario', async () => {
      Job.findByIdAndDelete.mockReturnValue(true);
      await expect(jobsService.deleteJob(true, true)).resolves.toThrow(
        'Not Found task with id'
      );
    });
  });
});
