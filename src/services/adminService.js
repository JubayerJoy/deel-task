const { Contract, Job, Profile } = require("../model");
const { Op } = require("sequelize");

const adminService = {
  getBestProfession: async (start, end, sequelize) => {
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return {
          success: false,
          status: 400,
          message: "Invalid date format",
        };
      }

      if (startDate.getTime() > endDate.getTime()) {
        return {
          success: false,
          status: 400,
          message: "Start date cannot be greater than end date",
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
};

module.exports = adminService;
