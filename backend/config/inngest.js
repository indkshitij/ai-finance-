import { Inngest } from "inngest";
import budgetModel from "../models/budgetModel.js";
import transactionModel from "../models/transactionModel.js";
import userModel from "../models/userModel.js";
import accountModel from "../models/accountModel.js";
// import { sendCustomEmail } from "../emails/sendEmail.js";
import sendCustomEmail from "../emails/sendEmail.js";

export const inngest = new Inngest({ id: "neoFinance", name: "neoFinance" });

const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const checkBudget = inngest.createFunction(
  { id: "checkBudget" },
  { cron: "0 */6 * * *" },
  // { event: "budget/check" },
  async ({ step }) => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const threshold = 0.8; // 80%

    const usersToNotify = await step.run(
      "fetch-users-exceeding-budget",
      async () => {
        const users = await userModel.find({});
        const notifyList = [];

        for (const user of users) {
          const defaultAccount = await accountModel.findOne({
            userId: user._id,
            isDefault: true,
          });
          if (!defaultAccount) continue;

          const budget = await budgetModel.findOne({
            userId: user._id,
            accountId: defaultAccount._id,
            month,
            year,
          });
          if (!budget || !budget.amount) continue;

          // Check if alert was already sent this month
          const lastAlert = budget.lastAlertSent;
          const alreadyAlerted =
            lastAlert &&
            lastAlert.getMonth() === month &&
            lastAlert.getFullYear() === year;

          if (alreadyAlerted) continue;

          const startOfMonth = new Date(year, month, 1);
          const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

          const expensesAggregate = await transactionModel.aggregate([
            {
              $match: {
                userId: user._id,
                type: "EXPENSE",
                createdAt: { $gte: startOfMonth, $lte: endOfMonth },
                accountId: defaultAccount._id,
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
              account: defaultAccount,
            });
          }
        }

        return notifyList;
      }
    );

    await step.run("send-budget-alert-emails", async () => {
      for (const user of usersToNotify) {
        const { email, name, usage, budget, user: userDetails, account } = user;

        const emailData = {
          userName: userDetails.name,
          type: "budget-alert",
          data: {
            percentageUsed: usage,
            budgetAmount: budget.amount,
            totalExpenses: (usage / 100) * budget.amount,
            accountName: account.name,
          },
        };

        // Send custom email
        await sendCustomEmail({
          to: email,
          subject: `Budget Alert for ${account.name}`,
          userName: name,
          type: "budget-alert",
          data: emailData,
        });

        // Update the lastAlertSent field
        await budgetModel.findByIdAndUpdate(budget._id, {
          lastAlertSent: new Date(),
        });
      }
    });
  }
);

export const functions = [helloWorld, checkBudget];
