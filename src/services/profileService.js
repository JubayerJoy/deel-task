const { Job, Contract, Profile } = require("../model");
const { Op, Sequelize } = require("sequelize");

const profileService = {
  deposit: async (userId, depositAmount, sequelize) => {
    const depositTransaction = await sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      const clientProfile = await Profile.findByPk(userId, {
        lock: depositTransaction.LOCK.UPDATE,
      });

      if (!clientProfile) {
        await depositTransaction.rollback();
        return { success: false, status: 404, message: "Client not found" };
      }

      const totalPrice = await Job.sum("price", {
        attributes: [
          [sequelize.fn("SUM", sequelize.col("price")), "totalPrice"],
        ],
        include: [
          {
            model: Contract,
            required: true,
            where: {
              ClientId: userId,
              status: "in_progress",
            },
          },
        ],
        where: {
          [Op.or]: [{ paid: false }, { paid: null }],
        },
        lock: depositTransaction.LOCK.UPDATE,
      });

      if (!totalPrice) {
        await depositTransaction.rollback();
        return { success: false, status: 400, message: "No jobs to pay" };
      }

      const maxDepositLimit = totalPrice * 0.25;

      if (depositAmount > maxDepositLimit) {
        await depositTransaction.rollback();
        return {
          success: false,
          status: 400,
          message: `Deposit amount exceeds the limit of $${maxDepositLimit}, please deposit an amount less than or equal to $${maxDepositLimit} (25% of the total amount of jobs to pay) to proceed`,
        };
      }

      const newBalance = clientProfile.balance + depositAmount;

      await clientProfile.update(
        { balance: newBalance, updatedAt: new Date() },
        { depositTransaction }
      );

      await depositTransaction.commit();

      return {
        success: true,
        status: 200,
        message: `Deposit of $${depositAmount} successful`,
      };
    } catch (error) {
      await depositTransaction.rollback();
      console.trace(error);
      return { success: false, status: 500, message: "Internal Server Error" };
    }
  },
};

module.exports = profileService;
