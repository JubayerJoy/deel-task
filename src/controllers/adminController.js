const { Op } = require("sequelize");
const { Contract, Job } = require("../model");
const adminService = require("../services/adminService");

const adminController = {
  getBestProfession: async (req, res) => {
    try {
      const { start, end } = req.query;
      const sequelize = req.app.get("sequelize");
      const { success, status, message, data } =
        await adminService.getBestProfession(start, end, sequelize);

      if (!success) {
        return res.status(status).json({ success, message });
      }

      res.status(status).json({
        success,
        message,
        data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  getBestClients: async (req, res) => {
    try {
      const { start, end, limit } = req.query;
      const sequelize = req.app.get("sequelize");
      const { success, status, message, data } =
        await adminService.getBestClients(start, end, limit, sequelize);

      if (!success) {
        return res.status(status).json({ success, message });
      }

      res.status(status).json({
        success,
        message,
        data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};

module.exports = adminController;
