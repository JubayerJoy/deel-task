// controllers/contractController.js
const jobService = require("../services/jobService");

const jobsController = {
  getUnpaidJobs: async (req, res) => {
    try {
      const userId = parseInt(req.profile.id, 10);
      const jobs = await jobService.getUnpaidJobsByUserId(userId);

      if (!jobs.success) {
        return res
          .status(jobs.status)
          .json({ success: false, message: jobs.message });
      }

      res
        .status(jobs.status)
        .json({ success: true, message: jobs.message, data: jobs.data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  payForJob: async (req, res) => {
    try {
      const jobId = parseInt(req.params.id, 10);
      const { success, status, message } = await jobService.payForJob(
        jobId,
        req
      );
      res.status(status).json({ success, message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = jobsController;
