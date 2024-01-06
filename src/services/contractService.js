// services/contractService.js
const { Contract } = require("../model");

const contractService = {
  getContractById: async (contractId) => {
    return Contract.findByPk(contractId);
  },
  // Add more service methods as needed
};

module.exports = contractService;
