export default function Email({ userName = "", type = "", data = {} }) {
  if (type === "budget-alert") {
    return budgetAlert(userName, data);
  }

  if (type === "monthly-report") {
    return monthlyReport(userName, data);
  }

  return null;
}

const monthlyReport = (userName, data = {}) => {
  const {
    totalIncome,
    totalExpense,
    net,
    byCategory,
    insights,
    month,
    amount,
    transactionCount,
  } = data;
  console.log(byCategory);

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>NeoFinance Monthly Report</title>
    <link href="https://fonts.googleapis.com/css2?family=Poetsen+One&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Poppins', sans-serif;
        background: #f8fafc;
        margin: 0;
        padding: 20px;
      }
      .container {
        background: white;
        max-width: 800px;
        margin: auto;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo-title {
        font-family: 'Poetsen One', sans-serif;
        font-size: 36px;
        font-weight: bold;
        background: linear-gradient(to right, #3b82f6, #38bdf8, #1e40af);
        background-size: 200% 200%;
        color: transparent;
        background-clip: text;
        -webkit-background-clip: text;
        animation: gradientMove 3s ease infinite;
        margin: 0;
      }
      .logo-subtitle {
        font-size: 18px;
        margin-top: 8px;
        color: #475569;
        font-weight: 600;
      }
      h2 {
        font-size: 24px;
        color: #1e3a8a;
        text-align: center;
        font-weight: 700;
        margin-bottom: 20px;
      }
      p {
        font-size: 14px;
        color: #334155;
        margin: 8px 0;
        font-weight: 500;
      }
      .intro-text {
        font-size: 15px;
        color: #475569;
        font-weight: 500;
        text-align: left;
        margin: 20px 0 30px 0;
      }
      .section-title {
        font-size: 18px;
        margin-top: 30px;
        margin-bottom: 10px;
        color: #1d4ed8;
        font-weight: 600;
        border-bottom: 1px solid #dbeafe;
        padding-bottom: 5px;
      }
      .stats {
        margin-top: 10px;
        margin-bottom: 20px;
      }
      .stat-item {
        margin-bottom: 10px;
        font-size: 14px;
        color: #475569;
        font-weight: 500;
      }
      .insights p {
        padding: 0;
        margin-bottom: 8px;
        font-size: 14px;
        color: #475569;
        font-weight: 500;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      th, td {
        padding: 10px 12px;
        text-align: left;
        font-size: 14px;
        color: #334155;
        font-weight: 500;
      }
      th {
        background: #dbeafe;
        color: #1e3a8a;
      }
      tr:nth-child(even) {
        background: #f1f5f9;
      }
      .footer {
        margin-top: 40px;
        font-size: 12px;
        text-align: center;
        color: #94a3b8;
      }
  
      /* Gradient Animation */
      @keyframes gradientMove {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
  
      <div class="logo">
        <h1 class="logo-title">NeoFinance</h1>
        <p class="logo-subtitle">Monthly Financial Report</p>
      </div>
  
      <h2>Monthly Report</h2>
    <p class="intro-text">
  Hey ${userName}! 👋<br><br>
  I hope you're doing well and having a great month! 🌟<br><br>
  Here’s your financial report for ${month} — showing your income, expenses, and some useful insights to help you stay on track. 💰<br><br>
  Let's see how your month went! 🚀
</p>


  
      <div class="section-title">Financial Summary</div>
      <!-- Stats -->
      <div class="stats">
        <div class="stat-item">Total Income: ₹ ${totalIncome}</div>
        <div class="stat-item">Total Expenses: ₹ ${totalExpense}</div>
        <div class="stat-item">Net Balance: ₹ ${net}</div>
        <div class="stat-item">Transactions Count: ${transactionCount}</div>
      </div>
  
      <!-- Insights Section -->
      <div>
        <div class="section-title">NeoFinance Insights</div>
        <div class="insights">
          ${insights.map((item) => `<p>• ${item}</p>`).join("")}
        </div>
      </div>
  
      <!-- Expenses by Category Table -->
      <div>
        <div class="section-title">Expenses by Category</div>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${byCategory
              .map(
                (item) => `
                  <tr>
                    <td>${item[1].category}</td>
                    <td>₹ ${item[1].amount}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
  
      <div class="footer">
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="font-size: 13px; color: #64748b; margin: 0;">
          Thank you for using <span style="color: #1d4ed8; font-weight: 600;">NeoFinance</span>. Stay financially healthy!
        </p>
      </div>
  
    </div>
  </body>
  </html>
  `;
};

const budgetAlert = (
  userName,
  data = {
    accountName: "",
    budgetAmount: 0,
    totalExpenses: 0,
    percentageUsed: 0,
  }
) => {
  const percentageUsed = parseFloat(data.percentageUsed);

  if (isNaN(percentageUsed)) {
    console.error("Invalid percentageUsed value");
    return "";
  }

  const formattedPercentage = percentageUsed.toFixed(1);

  let remainingBalance = data.budgetAmount - data.totalExpenses;
  if (remainingBalance < 0) {
    remainingBalance = 0;
  }
  remainingBalance.toFixed(2);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>NeoFinance Budget Alert</title>
      <link href="https://fonts.googleapis.com/css2?family=Poetsen+One&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Poppins', sans-serif;
          background: #f8fafc;
          margin: 0;
          padding: 20px;
        }
        .container {
          background: white;
          max-width: 800px;
          margin: auto;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .logo {
          text-align: center;
          margin-bottom: 20px;
        }
        .logo-title {
          font-family: 'Poetsen One', sans-serif;
          font-size: 36px;
          font-weight: bold;
          background: linear-gradient(to right, #3b82f6, #38bdf8, #1e40af);
          background-size: 200% 200%;
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          animation: gradientMove 3s ease infinite;
          margin: 0;
        }
        .logo-subtitle {
          font-size: 18px;
          margin-top: 8px;
          color: #475569;
          font-weight: 600;
        }
        h2 {
          font-size: 24px;
          color: #1e3a8a;
          text-align: center;
          font-weight: 700;
          margin-bottom: 20px;
        }
        p {
          font-size: 14px;
          color: #334155;
          margin: 8px 0;
          font-weight: 500;
        }
        .intro-text {
          font-size: 15px;
          color: #475569;
          font-weight: 500;
          text-align: left;
          margin: 20px 0 30px 0;
        }
        .section-title {
          font-size: 18px;
          margin-top: 30px;
          margin-bottom: 10px;
          color: #1d4ed8;
          font-weight: 600;
          border-bottom: 1px solid #dbeafe;
          padding-bottom: 5px;
        }
        .stats {
          margin-top: 10px;
          margin-bottom: 20px;
        }
        .stat-item {
          margin-bottom: 10px;
          font-size: 14px;
          color: #475569;
          font-weight: 500;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          padding: 10px 12px;
          text-align: left;
          font-size: 14px;
          color: #334155;
          font-weight: 500;
        }
        th {
          background: #dbeafe;
          color: #1e3a8a;
        }
        tr:nth-child(even) {
          background: #f1f5f9;
        }
        .footer {
          margin-top: 40px;
          font-size: 12px;
          text-align: center;
          color: #94a3b8;
        }
      
        /* Gradient Animation */
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
      
        <div class="logo">
          <h1 class="logo-title">NeoFinance</h1>
          <p class="logo-subtitle">Budget Alert</p>
        </div>
      
        <h2>Budget Alert</h2>
        <p class="intro-text">
          Hello ${userName}, 👋<br><br>
          You’ve used ${formattedPercentage}% of your monthly budget. Here's a quick overview:
        </p>

        <p class="intro-text">
          It's important to stay on track with your spending habits, as going over your budget can lead to unwanted financial strain. Please take a moment to review your spending and try to reduce unnecessary expenses. You can always adjust your budget to match your financial goals better.
        </p>

        <p class="intro-text">
          Here are some tips to help you control your budget:
        </p>

        <ul>
          <li>Track your spending closely and identify areas where you can cut back.</li>
          <li>Consider saving a portion of your remaining budget for emergencies or future goals.</li>
          <li>Try to limit discretionary expenses like eating out, subscriptions, or shopping.</li>
          <li>If you're nearing your budget limit, consider reducing some planned expenses or adjusting your budget for the rest of the month.</li>
        </ul>

        <div class="section-title">Budget Summary</div>
        <div class="stats">
          <div class="stat-item">Account Name: ${data.accountName}</div>
          <div class="stat-item">Budget Amount: ₹ ${data.budgetAmount.toFixed(2)}</div>
          <div class="stat-item">Total Expenses: ₹ ${data.totalExpenses.toFixed(2)}</div>
          <div class="stat-item">Remaining Budget: ₹ ${remainingBalance}</div>
        </div>
      
        <div class="footer">
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="font-size: 13px; color: #64748b; margin: 0;">
            Thank you for using <span style="color: #1d4ed8; font-weight: 600;">NeoFinance</span>. Stay financially healthy!
          </p>
        </div>
      
      </div>
    </body>
    </html>
  `;
};
