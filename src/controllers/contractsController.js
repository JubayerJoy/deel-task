// controllers/contractController.js
const contractService = require("../services/contractService");

const contractController = {
  checkAccess: async (req, res, next) => {
    try {
      const { id: contractId } = req.params;
      const userId = parseInt(req.profile.id, 10);
      const { data } = await contractService.getContractById(contractId);

      if (!data) {
        return res.status(404).json({ error: "Contract not found" });
      }

      if (data.ClientId !== userId && data.ContractorId !== userId) {
        return res.status(403).json({ error: "Access forbidden" });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getContractById: async (req, res) => {
    try {
      const { success, status, message, data } =
        req.contract || (await contractService.getContractById(req.params.id));
      if (!success) {
        res.status(status).json({ error: message });
      }

      res.status(status).json({
        success,
        message,
        data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getNonTeminatedContractsByUser: async (req, res) => {
    try {
      const userId = parseInt(req.profile.id, 10);
      const { success, status, message, data } =
        await contractService.getNonTerminatedContractsByUserId(userId);

      if (!success) {
        res.status(status).json({ error: message });
      }

      res.status(status).json({
        success,
        message,
        data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = contractController;
