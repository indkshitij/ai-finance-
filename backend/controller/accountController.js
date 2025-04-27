import userModel from "../models/userModel.js";
import accountModel from "../models/accountModel.js";
import transactionModel from "../models/transactionModel.js";
import budgetModel from "../models/budgetModel.js";

const getMonthName = (monthNumber) => {
  return new Date(2000, monthNumber).toLocaleString("default", {
    month: "long",
  });
};

export const createAccount = async (req, res) => {
  try {
    const { name, balance, isDefault, type } = req.body;
    const { _id } = req.user;

    if (!name || balance === undefined) {
      return res.status(400).json({
        success: false,
        message: "Account name and balance are required",
      });
    }

    const existingAccount = await accountModel.findOne({ userId: _id, name });

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message:
          "An account with this name already exists. Please choose a different name.",
      });
    }

    const balanceFloat = parseFloat(balance);
    if (isNaN(balanceFloat)) {
      return res.status(400).json({
        success: false,
        message: "Invalid balance amount",
      });
    }

    const existingAccounts = await accountModel.find({ userId: _id });
    const shouldBeDefault = existingAccounts.length === 0 ? true : isDefault;

    if (shouldBeDefault) {
      await accountModel.updateMany(
        { userId: _id, isDefault: true },
        { isDefault: false }
      );
    }

    const newAccount = await accountModel.create({
      name: name.trim(),
      balance: balanceFloat,
      userId: _id,
      type,
      isDefault: shouldBeDefault,
    });

    const transaction = new transactionModel({
      userId: _id,
      accountId: newAccount?._id,
      transactionType: "INCOME",
      priorBalance: 0,
      amount: balanceFloat,
      description: "Initial deposit for the newly created account.",
      accountId: newAccount._id,
      date: new Date().toISOString(),
      category: "Account Added",
      isRecurring: false,
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: newAccount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server issue: Unable to create account",
      error: error.message,
    });
  }
};

export const getUserAccount = async (req, res) => {
  try {
    const { _id } = req.user;

    const existingAccount = await accountModel.find({ userId: _id });

    res.status(201).json({
      success: true,
      message: "User accounts retrieved successfully",
      data: existingAccount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server issue: Unable to fetch accounts",
      error: error.message,
    });
  }
};

export const getSingleAccountById = async (req, res) => {
  try {
    const { accountId } = req.params;

    const account = await accountModel.findById(accountId);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found with the provided ID.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account retrieved successfully.",
      data: account,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to retrieve the account.",
      error: error.message,
    });
  }
};

export const changeDefaultSetting = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { accountId } = req.body;

    const currentAccount = await accountModel.findById(accountId);

    if (!currentAccount) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    if (currentAccount.isDefault) {
      return res.status(200).json({
        success: false,
        message:
          "This is already your default account. Please select another to change it. One account must always be default.",
        data: currentAccount,
      });
    }

    const updatedDefault = await accountModel.findByIdAndUpdate(
      accountId,
      { isDefault: true },
      { new: true }
    );

    const budget = await budgetModel.find({
      accountId: currentAccount._id,
    });

    if (budget.length === 0) {
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      const monthName = getMonthName(month); // Make sure getMonthName is defined somewhere

      await budgetModel.create({
        userId: userId,
        accountId: currentAccount._id,
        amount: "0",
        month,
        monthName,
        year,
        alertThreshold: 80,
        isRecurring: false,
      });
    }

    await accountModel.updateMany(
      { userId, _id: { $ne: accountId } },
      { $set: { isDefault: false } }
    );

    return res.status(200).json({
      success: true,
      message: "Default account updated successfully",
      data: updatedDefault,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server issue: Unable to update default account",
      error: error.message,
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { _id: userId } = req.user;

    const account = await accountModel.findOne({ _id: accountId, userId });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found or unauthorized access",
      });
    }

    await transactionModel.deleteMany({ accountId, userId });

    await budgetModel.deleteMany({ accountId, userId });

    await accountModel.deleteOne({ _id: accountId, userId });

    return res.status(200).json({
      success: true,
      message:
        "Account and all related transactions and budgets deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to delete account",
      error: error.message,
    });
  }
};

