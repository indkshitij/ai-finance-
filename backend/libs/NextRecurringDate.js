const CalculateNextRecurringDate = (startDate, interval) => {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1); // add 1 day
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7); // add 7 days
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1); // add 1 month
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1); // add 1 year
      break;
  }

  return date;
};

export default CalculateNextRecurringDate;
