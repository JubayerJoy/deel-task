// services/contractService.js
const { Contract } = require("../model");
const { Op } = require("sequelize");

const contractService = {
  getContractById: async (contractId) => {
    return Contract.findByPk(contractId);
  },
  getNonTerminatedContractsByUserId: async (userId) => {
    try {
      const contracts = await Contract.findAll({
        where: {
          [Op.or]: [{ ClientId: userId }, { ContractorId: userId }],
          status: {
            [Op.not]: "terminated",
          },
        },
      });

      return contracts;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching non-terminated contracts for the user");
    }
  },
};

module.exports = contractService;
