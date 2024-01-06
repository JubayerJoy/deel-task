// controllers/contractController.js
const contractService = require("../services/contractService");

const contractController = {
  checkAccess: async (req, res, next) => {
    try {
      const { id: contractId } = req.params;
      const userId = parseInt(req.profile.id, 10);
      const contract = await contractService.getContractById(contractId);

      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }

      if (contract.ClientId !== userId && contract.ContractorId !== userId) {
        return res.status(403).json({ error: "Access forbidden" });
      }

      req.contract = contract;

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getContractById: async (req, res) => {
    try {
      const contract =
        req.contract || (await contractService.getContractById(req.params.id));
      res.json(contract);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = contractController;
