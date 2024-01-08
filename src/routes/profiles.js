const express = require("express");
const router = express.Router();
const profilesController = require("../controllers/profilesController");

router.post("/deposit/:userId", profilesController.deposit);

module.exports = router;
