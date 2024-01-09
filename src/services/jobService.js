const { Job, Contract, Profile: User } = require("../model");
const { Op, Sequelize } = require("sequelize");

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

      if (!unpaidJobs) {
        return { success: false, status: 404, message: "No unpaid jobs found" };
      }

      return {
        success: true,
        status: 200,
        message: "Unpaid jobs fetched successfully",
        data: unpaidJobs,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching unpaid jobs for the user");
    }
  },
  payForJob: async (jobId, req) => {
    const sequelize = req.app.get("sequelize");
    const paymentTransaction = await sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      const user = req.profile;
      const userId = parseInt(user.id, 10);
      const userBalance = Number(user.balance);
      const userType = user.type;

      // Lock the user row for update
      const userToUpdate = await User.findByPk(userId, {
        lock: paymentTransaction.LOCK.UPDATE,
      });

      // Lock the job row for update
      const job = await Job.findByPk(jobId, {
        include: [
          {
            model: Contract,
          },
        ],
        lock: paymentTransaction.LOCK.UPDATE,
      });

      if (!job) {
        await paymentTransaction.rollback();
        return { success: false, status: 404, message: "Job not found" };
      }

      const isClient = job.Contract.ClientId === userId;
      if (!isClient || userType !== "client") {
        await paymentTransaction.rollback();
        return {
          success: false,
          status: 403,
          message: "Access forbidden, you are not the client of this job",
        };
      }

      if (job.paid) {
        await paymentTransaction.rollback();
        return { success: false, status: 400, message: "Job is already paid" };
      }

      if (userBalance < job.price) {
        await paymentTransaction.rollback();
        return {
          success: false,
          status: 400,
          message: "Insufficient balance",
        };
      }

      const newBalance = userBalance - job.price;
      const paymentDate = new Date();

      await job.update(
        { paid: true, paymentDate, updatedAt: new Date() },
        { paymentTransaction }
      );
      await userToUpdate.update(
        { balance: newBalance, updatedAt: new Date() },
        { paymentTransaction }
      );
      await paymentTransaction.commit();

      return {
        success: true,
        status: 200,
        message: `Payment successful, new balance is $${newBalance.toFixed(
          2
        )}, payment date is ${paymentDate}`,
      };
    } catch (error) {
      await paymentTransaction.rollback();
      console.error(error);
      return { success: false, status: 500, message: "Internal Server Error" };
    }
  },
};

module.exports = jobService;
