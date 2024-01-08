const dateUtils = {
  validateDateRange: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { valid: false, message: "Invalid date format" };
    }

    if (start.getTime() > end.getTime()) {
      return {
        valid: false,
        message: "Start date cannot be greater than end date",
      };
    }

    return { valid: true, message: "Valid date range" };
  },
};

module.exports = dateUtils;
