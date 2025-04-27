import { Inngest } from "inngest";
import budgetModel from "../models/budgetModel.js";
import transactionModel from "../models/transactionModel.js";
import userModel from "../models/userModel.js";
import accountModel from "../models/accountModel.js";
import SendEmail from "../emails/ResendConfig.js";
import CalculateNextRecurringDate from "../libs/NextRecurringDate.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Email from "../emails/Email.js";

export const inngest = new Inngest({ id: "neoFinance", name: "neoFinance" });

function isTransactionDue(transaction) {
  if (!transaction.lastProcessed) return true;
  const today = new Date();
  const nextDue = new Date(transaction.nextRecurringDate);
  return nextDue <= today;
}
const getMonthName = (month) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month];
};

// budget check
const checkBudget = inngest.createFunction(
  { id: "checkBudget" },
  { cron: "0 */6 * * *" },

  async ({ step }) => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const threshold = 0.8;

    const usersToNotify = await step.run(
      "fetch-users-exceeding-budget",
      async () => {
        const users = await userModel.find({});
        const notifyList = [];

        for (const user of users) {
          // Fetch all accounts for this user, not just the default one
          const accounts = await accountModel.find({ userId: user._id });

          for (const account of accounts) {
            const budget = await budgetModel.findOne({
              userId: user._id,
              accountId: account._id,
              month,
              year,
            });

            if (!budget || !budget.amount) {
              continue;
            }

            const lastAlert = budget.lastAlertSent;
            const alreadyAlerted =
              lastAlert &&
              lastAlert.getMonth() === month &&
              lastAlert.getFullYear() === year;

            if (alreadyAlerted) {
              continue;
            }

            const startOfMonth = new Date(year, month, 1);
            const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

            const expensesAggregate = await transactionModel.aggregate([
              {
                $match: {
                  userId: user._id,
                  transactionType: "EXPENSE",
                  date: { $gte: startOfMonth, $lte: endOfMonth },
                  accountId: account._id,
                },
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: "$amount" },
                },
              },
            ]);

            const totalExpenses = expensesAggregate[0]?.total || 0;

            const usagePercentage = totalExpenses / budget.amount;

            if (usagePercentage >= threshold) {
              notifyList.push({
                email: user.email,
                name: user.name,
                usage: (usagePercentage * 100).toFixed(2),
                budgetId: budget._id,
                budget: budget,
                user: user,
                account: account,
              });
            }
          }
        }

        console.log("Users to notify:", notifyList.length);
        return notifyList;
      }
    );

    await step.run("send-budget-alert-emails", async () => {
      for (const user of usersToNotify) {
        const { email, name, usage, budget, user: userDetails, account } = user;

        // Send custom email
        try {
          await SendEmail({
            to: email,
            subject: `Budget Alert for ${account.name}`,
            userName: name,
            type: "budget-alert",
            data: {
              percentageUsed: usage,
              budgetAmount: budget.amount,
              totalExpenses: (usage / 100) * budget.amount,
              accountName: account.name,
            },
          });

          // Update the lastAlertSent field
          await budgetModel.findByIdAndUpdate(budget._id, {
            lastAlertSent: new Date(),
          });
        } catch (err) {
          console.error(err);
          throw new Error("unable to send email");
        }

        console.log(
          `Alert sent and budget updated for user: ${name}, Account: ${account.name}`
        );
      }
    });
  }
);

// recurring transaction
const triggerRecurringTransaction = inngest.createFunction(
  {
    id: "trigger-recurring-transaction",
    name: "trigger-recurring-transaction",
  },
  { cron: "0 0 * * *" },

  async ({ step }) => {
    const recurringTransaction = await step.run(
      "find-recurring-transactions",
      async () => {
        return await transactionModel.find({
          isRecurring: true,
          status: "COMPLETED",
          $or: [
            { lastProcessed: null },
            { nextRecurringDate: { $lte: new Date() } },
          ],
        });
      }
    );

    if (recurringTransaction.length > 0) {
      const events = recurringTransaction.map((transaction) => ({
        name: "transaction.recurring.process",
        data: { transactionId: transaction._id, userId: transaction.userId },
      }));

      await inngest.send(events);
    }

    return { triggered: recurringTransaction.length };
  }
);

const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    throttle: {
      limit: 10,
      period: "1m",
      key: "event.data.userId",
    },
  },
  { event: "transaction.recurring.process" },

  async ({ event, step }) => {
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }

    const transaction = await step.run("fetch-transaction", async () => {
      return await transactionModel
        .findOne({
          _id: event.data.transactionId,
          userId: event.data.userId,
        })
        .populate("accountId");
    });

    if (!transaction || !isTransactionDue(transaction)) {
      console.error("Transaction not found or not due");
      return { error: "Transaction not found or not due" };
    }

    const account = await accountModel.findOne({
      userId: transaction.userId,
      _id: transaction.accountId,
    });

    if (!account) {
      console.error("Account not found");
      return { error: "Account not found" };
    }

    if (account.balance >= transaction.amount) {
      const newTransaction = await transactionModel.create({
        transactionType: transaction.transactionType,
        amount: transaction.amount,
        priorBalance: account.balance,
        description: `${transaction.description} (Recurring)`,
        date: new Date(),
        category: transaction.category,
        userId: transaction.userId,
        accountId: transaction.accountId,
        isRecurring: false,
      });

      account.balance =
        transaction.transactionType === "INCOME"
          ? account.balance + Number(transaction.amount)
          : account.balance - Number(transaction.amount);

      await account.save();

      await transactionModel.findByIdAndUpdate(transaction._id, {
        lastProcessed: new Date(),
        nextRecurringDate: CalculateNextRecurringDate(
          new Date(),
          transaction.recurringInterval
        ),
      });

      return { success: true, transaction: newTransaction };
    } else {
      console.error("Insufficient balance");
      return { error: "Insufficient balance" };
    }
  }
);

// monthly report
const createMonthyReport = inngest.createFunction(
  { id: "create-monthly-report", name: "createMonthyReport" },
  { cron: "0 0 1 * *" },
  async ({ step }) => {
    const users = await step.run("fetch-users", async () => {
      const printUser = await userModel.find({});

      return await userModel.find({});
    });

    for (const user of users) {
      await step.run(`generate-report-${user._id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats = await getMonthlyStats(user._id, lastMonth);
        const monthName = lastMonth.toLocaleString("default", {
          month: "long",
        });

        const insights = await generateFinancialInsights(stats, monthName);

        SendEmail({
          to: user.email,
          subject: "Your Monthly Financial Report",
          userName: user.name,
          type: "monthly-report",

          data: {
            totalIncome: stats.totalIncome,
            totalExpense: stats.totalExpenses,
            net: stats.totalIncome - stats.totalExpenses,
            byCategory: Object.entries(stats.byCategory),
            insights,
            month: monthName,
            amount: stats.totalIncome - stats.totalExpenses,
            transactionCount: stats.transactionCount,
          },
        });
      });
    }
    return { processed: users.length };
  }
);

const getMonthlyStats = async (userId, month) => {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await transactionModel.find({
    userId: userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });
  const stats = transactions.reduce(
    (stats, transaction) => {
      const amount = transaction?.amount;
      if (transaction.transactionType === "EXPENSE") {
        stats.totalExpenses += amount;

        const existingCategory = stats.byCategory.find(
          (item) => item.category === transaction.category
        );

        if (existingCategory) {
          existingCategory.amount += amount;
        } else {
          stats.byCategory.push({
            category: transaction.category,
            amount: amount,
          });
        }
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: [],
      transactionCount: transactions.length,
    }
  );

  return stats;
};

const generateFinancialInsights = async (stats, month) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  const prompt = `
  Analyze this financial data and provide 3 concise, actionable insights.
  Focus on spending patterns and practical advice.
  Keep it friendly and conversational. currency is indian rupees

  Financial Data for ${month}:
  - Total Income: ₹${stats.totalIncome}
  - Total Expenses: ₹${stats.totalExpenses}
  - Net Income: ₹${stats.totalIncome - stats.totalExpenses}
  - Expense Categories: ${stats.byCategory
    .map((item) => `${item.category}: ₹${item.amount}`)
    .join(", ")}


  Format the response as a JSON array of strings, like this:
  ["insight 1", "insight 2", "insight 3"]
`;

  const result = await model.generateContent([prompt]);

  try {
    const response = await result.response;
    const text = await response.text();

    const cleanedText = text
      .replace(/```(?:json)?\n?/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.log(error);
    return [
      "Your highest expense category this month might need attention.",
      "Consider setting up a budget for better financial management.",
      "Track your recurring expenses to identify potential savings.",
    ];
  }
};

export const functions = [
  checkBudget,
  triggerRecurringTransaction,
  processRecurringTransaction,
  createMonthyReport,
];
