const express = require("express");
const router = express.Router();
const jobsController = require("../controllers/jobsController");

router.get("/unpaid", jobsController.getUnpaidJobs);
router.post("/:id/pay", jobsController.payForJob);

module.exports = router;
