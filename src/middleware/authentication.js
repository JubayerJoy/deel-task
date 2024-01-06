const { Profile } = require("../model");

const authenticateUser = async (req, res, next) => {
  try {
    const profileId = req.headers["profile_id"];
    // TODO: Add radis cache to store profileId
    const profile = await Profile.findByPk(profileId);
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.profile = profile.dataValues;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { authenticateUser };
