import userModel from "../models/userModel.js";
import accountModel from "../models/accountModel.js";
import transactionModel from "../models/transactionModel.js";
import budgetModel from "../models/budgetModel.js";

const getMonthName = (monthNumber) => {
  return new Date(2000, monthNumber).toLocaleString("default", {
    month: "long",
  });
};

export const createOrUpdateBudget = async (req, res) => {
  try {
    const { _id } = req.user;
    const { amount, alertThreshold, isRecurring, recurrence, accountId } =
      req.body;

    if (amount < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Oops! The amount can’t be negative. Please try again with a valid number.",
      });
    }

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const findAccount = await accountModel.findOne({
      userId: _id,
      _id:accountId,
    });

    if (!findAccount) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    let budget = await budgetModel.findOne({
      userId: _id,
      accountId,
      month,
      year,
    });

    if (budget) {
      if (amount !== undefined) budget.amount = Number(amount);
      if (alertThreshold !== undefined) budget.alertThreshold = alertThreshold;
      if (isRecurring !== undefined) budget.isRecurring = isRecurring;
      if (recurrence !== undefined) budget.recurrence = recurrence;
      budget.monthName = getMonthName(month);
      budget.lastAlertSent = null;

      await budget.save();

      return res.status(200).json({
        success: true,
        message: "Budget updated successfully.",
        data: budget,
      });
    }

    budget = await budgetModel.create({
      userId: _id,
      accountId: findAccount._id,
      amount,
      month,
      monthName: getMonthName(month),
      year,
      alertThreshold: alertThreshold || 80,
      isRecurring: isRecurring ?? false,
      recurrence: recurrence || "NONE",
    });

    res.status(201).json({
      success: true,
      message: "Budget has been created successfully.",
      data: budget,
    });
  } catch (error) {
    console.error("Create/Update budget error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: An error occurred while processing the budget.",
    });
  }
};

export const getBudget = async (req, res) => {
  try {
    const { _id } = req.user;

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const defaultAccount = await accountModel.findOne({
      userId: _id,
      isDefault: true,
    });

    if (!defaultAccount) {
      return res.status(404).json({
        success: false,
        message: "Default account not found for user.",
      });
    }

    const budget = await budgetModel.findOne({
      userId: _id,
      accountId: defaultAccount._id,
      month,
      year,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "No budget found for this month.",
      });
    }

    const accountId = defaultAccount?._id;

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const expensesAggregate = await transactionModel.aggregate([
      {
        $match: {
          userId: _id,
          transactionType: "EXPENSE",
          date: { $gte: startOfMonth, $lte: endOfMonth },
          accountId: accountId,
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

    return res.status(200).json({
      success: true,
      message: "Budget and current month's expenses fetched successfully.",
      data: {
        budget,
        currentExpenses: totalExpenses,
      },
    });
  } catch (error) {
    console.error("Error fetching budget:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch budget and expenses.",
    });
  }
};
