const express = require("express");
const router = express.Router();
const jobsController = require("../controllers/jobsController");

router.get("/unpaid", jobsController.getUnpaidJobs);

module.exports = router;
