// Dummy data for preview
// const PREVIEW_DATA = {
//   monthlyReport: {
//     userName: "John Doe",
//     type: "monthly-report",
//     data: {
//       month: "December",
//       stats: {
//         totalIncome: 5000,
//         totalExpenses: 3500,
//         byCategory: {
//           housing: 1500,
//           groceries: 600,
//           transportation: 400,
//           entertainment: 300,
//           utilities: 700,
//         },
//       },
//       insights: [
//         "Your housing expenses are 43% of your total spending - consider reviewing your housing costs.",
//         "Great job keeping entertainment expenses under control this month!",
//         "Setting up automatic savings could help you save 20% more of your income.",
//       ],
//     },
//   },
//   budgetAlert: {
//     userName: "John Doe",
//     type: "budget-alert",
//     data: {
//       percentageUsed: 85,
//       budgetAmount: 4000,
//       totalExpenses: 3400,
//     },
//   },
// };

export default function Email({
  userName = "",
  type = "budget-alert",
  data = {},
}) {
  if (type === "budget-alert") {
    return budgetAlert(userName, data);
  }

  if (type === "monthly-report") {
    return monthlyReport(userName, data);
  }

  return null;
}

const monthlyReport = (userName, data = {}) => {
  `
<!DOCTYPE html>
<html>
<head>
  <title>Your Monthly Financial Report</title>
  <style>
    body {
      background-color: #f6f9fc;
      font-family: Arial, sans-serif;
    }
    .container {
      background-color: #ffffff;
      margin: 20px auto;
      padding: 20px;
      max-width: 600px;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .title {
      color: #1f2937;
      font-size: 26px;
      font-weight: bold;
      text-align: center;
    }
    .text {
      color: #4b5563;
      font-size: 16px;
      margin: 16px 0;
    }
    .heading {
      color: #1f2937;
      font-size: 20px;
      font-weight: 600;
      margin: 12px 0;
    }
    .stats-container, .section {
      margin: 32px 0;
      padding: 16px;
      background-color: #f9fafb;
      border-radius: 5px;
    }
    .stat, .row {
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 8px;
    }
    .footer {
      color: #9ca3af;
      font-size: 14px;
      text-align: center;
      margin-top: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="title">Monthly Financial Report</div>
    <p class="text">Hello ${userName},</p>
    <p class="text">Here’s your financial summary for ${data.month || "this month"}:</p>

    <div class="stats-container">
      <div class="stat">
        <span class="text">Total Income</span>
        <span class="heading">$${data.stats.totalIncome}</span>
      </div>
      <div class="stat">
        <span class="text">Total Expenses</span>
        <span class="heading">$${data.stats.totalExpenses}</span>
      </div>
      <div class="stat">
        <span class="text">Net</span>
        <span class="heading">$${(data.stats.totalIncome - data.stats.totalExpenses).toFixed(2)}</span>
      </div>
    </div>

    ${
      data.stats.byCategory
        ? `
        <div class="section">
          <div class="heading">Expenses by Category</div>
          ${Object.entries(data.stats.byCategory)
            .map(
              ([category, amount]) => `
            <div class="row">
              <span class="text">${category}</span>
              <span class="text">$${amount}</span>
            </div>
          `
            )
            .join("")}
        </div>
      `
        : ""
    }

    ${
      data.insights?.length
        ? `
        <div class="section">
          <div class="heading">Wealth Insights</div>
          ${data.insights
            .map((insight) => `<p class="text">• ${insight}</p>`)
            .join("")}
        </div>
      `
        : ""
    }

    <p class="footer">Thank you for using Welth. Keep tracking your finances for better financial health!</p>
  </div>
</body>
</html>
`;
};

const budgetAlert = (userName, data = {}) => {
  `
<!DOCTYPE html>
<html>
<head>
  <title>Budget Alert</title>
  <style>
    body {
      background-color: #f6f9fc;
      font-family: Arial, sans-serif;
    }
    .container {
      background-color: #ffffff;
      margin: 20px auto;
      padding: 20px;
      max-width: 600px;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .title {
      color: #1f2937;
      font-size: 28px;
      font-weight: bold;
      text-align: center;
    }
    .text {
      color: #4b5563;
      font-size: 16px;
      margin: 16px 0;
    }
    .stats-container {
      margin: 32px 0;
      padding: 20px;
      background-color: #f9fafb;
      border-radius: 5px;
    }
    .stat {
      margin-bottom: 16px;
      padding: 12px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    .heading {
      color: #1f2937;
      font-size: 20px;
      font-weight: 600;
      margin: 8px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="title">Budget Alert</div>
    <p class="text">Hello ${userName},</p>
    <p class="text">You’ve used ${data.percentageUsed.toFixed(1)}% of your monthly budget.</p>

    <div class="stats-container">
      <div class="stat">
        <p class="text">Budget Amount</p>
        <div class="heading">$${data.budgetAmount}</div>
      </div>
      <div class="stat">
        <p class="text">Spent So Far</p>
        <div class="heading">$${data.totalExpenses}</div>
      </div>
      <div class="stat">
        <p class="text">Remaining</p>
        <div class="heading">$${(data.budgetAmount - data.totalExpenses).toFixed(2)}</div>
      </div>
    </div>
  </div>
</body>
</html>
`;
};
