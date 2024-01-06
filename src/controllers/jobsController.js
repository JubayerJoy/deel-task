// controllers/contractController.js
const jobService = require("../services/jobService");

const jobsController = {
  getUnpaidJobs: async (req, res) => {
    try {
      const userId = parseInt(req.profile.id, 10);
      const jobs = await jobService.getUnpaidJobsByUserId(userId);
      res.json(jobs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = jobsController;
