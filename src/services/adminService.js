const { Contract, Job, Profile } = require("../model");
const dateUtils = require("../utils/dateUtils");
const { Op } = require("sequelize");

const adminService = {
  getBestProfession: async (start, end, sequelize) => {
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);

      const { valid, message } = dateUtils.validateDateRange(start, end);

      if (!valid) {
        return {
          success: false,
          status: 400,
          message,
        };
      }

      const bestProfession = await Profile.findAll({
        attributes: [
          "profession",
          [sequelize.fn("SUM", sequelize.col("price")), "earned"],
        ],
        include: [
          {
            model: Contract,
            as: "Contractor",
            attributes: [],
            required: true,
            include: [
              {
                model: Job,
                required: true,
                attributes: [],
                where: {
                  paid: true,
                  paymentDate: {
                    [Op.between]: [startDate, endDate],
                  },
                },
              },
            ],
          },
        ],
        where: {
          type: "contractor",
        },
        group: ["profession"],
        order: [[sequelize.col("earned"), "DESC"]],
        limit: 1,
        subQuery: false,
        raw: true,
      });

      if (!bestProfession.length) {
        return {
          success: false,
          status: 400,
          message: `Nothing found between ${start} and ${end}`,
        };
      }

      return {
        success: true,
        status: 200,
        message: `Found best profession between ${start} and ${end}`,
        data: {
          profession: bestProfession[0].profession,
          earned: `$${bestProfession[0].earned}`,
        },
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching best profession");
    }
  },
  getBestClients: async (start, end, limit = 2, sequelize) => {
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);

      const { valid, message } = dateUtils.validateDateRange(start, end);

      if (!valid) {
        return {
          success: false,
          status: 400,
          message,
        };
      }

      const bestClients = await Profile.findAll({
        attributes: [
          "id",
          "firstName",
          "lastName",
          [sequelize.fn("SUM", sequelize.col("price")), "spent"],
        ],
        include: [
          {
            model: Contract,
            as: "Client",
            attributes: [],
            required: true,
            include: [
              {
                model: Job,
                required: true,
                attributes: [],
                where: {
                  paid: true,
                  paymentDate: {
                    [Op.between]: [startDate, endDate],
                  },
                },
              },
            ],
          },
        ],
        where: {
          type: "client",
        },
        group: ["Profile.id"],
        order: [[sequelize.col("spent"), "DESC"]],
        limit,
        subQuery: false,
        raw: true,
      });

      if (!bestClients.length) {
        return {
          success: false,
          status: 400,
          message: `Nothing found between ${start} and ${end}`,
        };
      }

      const data = bestClients.map((client) => ({
        id: client.id,
        fullName: `${client.firstName} ${client.lastName}`,
        paid: client.spent,
      }));

      return {
        success: true,
        status: 200,
        message: `Found best clients between ${start} and ${end}`,
        data,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching best clients");
    }
  },
};

module.exports = adminService;
