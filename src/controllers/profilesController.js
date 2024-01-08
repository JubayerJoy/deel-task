const profileService = require("../services/profileService");

const deposit = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const depositAmount = parseInt(req.body.amount, 10);
    const sequelize = req.app.get("sequelize");

    const { success, status, message } = await profileService.deposit(
      userId,
      depositAmount,
      sequelize
    );

    res.status(status).json({ success, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  deposit,
};
