const { Job, Contract } = require("../model");
const { Op } = require("sequelize");

const jobService = {
  getUnpaidJobsByUserId: async (userId) => {
    try {
      const unpaidJobs = await Job.findAll({
        include: [
          {
            model: Contract,
            attributes: [],
            required: true,
            where: {
              [Op.or]: [{ ClientId: userId }, { ContractorId: userId }],
            },
            status: {
              [Op.eq]: "in_progress",
            },
          },
        ],
        where: {
          [Op.or]: [{ paid: false }, { paid: null }],
        },
      });

      return unpaidJobs;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching unpaid jobs for the user");
    }
  },
};

module.exports = jobService;
