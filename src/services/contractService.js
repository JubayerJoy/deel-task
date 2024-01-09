// services/contractService.js
const { Contract } = require("../model");
const { Op } = require("sequelize");

const contractService = {
  getContractById: async (contractId) => {
    const contract = await Contract.findByPk(contractId, { raw: true });
    return {
      success: true,
      status: 200,
      message: "Contract fetched successfully",
      data: contract,
    };
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

      return {
        success: true,
        status: 200,
        message: "Contracts fetched successfully",
        data: contracts,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching non-terminated contracts for the user");
    }
  },
};

module.exports = contractService;
