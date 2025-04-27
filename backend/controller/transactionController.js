import userModel from "../models/userModel.js";
import accountModel from "../models/accountModel.js";
import transactionModel from "../models/transactionModel.js";
import budgetModel from "../models/budgetModel.js";
import mongoose from "mongoose";
import CalculateNextRecurringDate from "../libs/NextRecurringDate.js";
import aj from "../config/arcjet.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getTransactionsByAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { _id } = req.user;

    const transactions = await transactionModel.find({
      accountId,
      userId: _id,
    });

    res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully.",
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to retrieve transactions.",
      error: error.message,
    });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { _id: userId } = req.user;

    const transaction = await transactionModel.findOne({
      _id: transactionId,
      userId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction retrieved successfully.",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to retrieve transaction.",
      error: error.message,
    });
  }
};

export const transactionDelete = async (req, res) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    const { _id: userId } = req.user;
    const { transactionIds } = req.body;

    if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid transaction IDs.",
      });
    }

    const transactionsToDelete = await transactionModel.find({
      userId,
      _id: { $in: transactionIds },
    });
    // .session(session);

    for (let transaction of transactionsToDelete) {
      const account = await accountModel.findById(transaction.accountId);
      // .session(session);

      if (!account) {
        throw new Error(
          `Account not found for transaction ID ${transaction._id}`
        );
      }

      let newBalance = account.balance;

      if (transaction.transactionType === "INCOME") {
        newBalance -= transaction.amount;
      } else if (transaction.transactionType === "EXPENSE") {
        newBalance += transaction.amount;
      }

      await accountModel.findByIdAndUpdate(
        transaction.accountId,
        { balance: newBalance }
        // { session }
      );
    }

    const deleteResult = await transactionModel.deleteMany({
      userId,
      _id: { $in: transactionIds },
    });
    // .session(session);

    // await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message:
        "Transactions deleted and account balances updated successfully.",
      data: deleteResult,
    });
  } catch (error) {
    // try {
    //   await session.abortTransaction();
    // } catch (abortErr) {
    //   console.error("Failed to abort transaction:", abortErr);
    // }
    // console.error("Server error during transaction delete:", error.message);
    // console.error(error.stack);

    console.error("Server error during transaction delete:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to delete transactions.",
      error: error.message,
    });
  } finally {
    // session.endSession();
  }
};

export const addTransaction = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const {
      transactionType,
      amount,
      description,
      accountId,
      date,
      category,
      receiptUrl,
      isRecurring,
      recurringInterval,
    } = req.body;

    const decision = await aj.protect(req, {
      userId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        const resetInHours = Math.ceil(reset / 3600);

        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInHours,
          },
        });

        return res.status(429).json({
          success: false,
          message: `You’ve reached the maximum number of requests. Please try again after ${resetInHours} hour(s).`,
        });
      }

      return res.status(403).json({
        success: false,
        message:
          "Your request was blocked due to security or permission issues. Please ensure you have the correct permissions and try again.",
      });
    }

    if (!transactionType || !amount || !accountId || !date) {
      console.log(" Validation Failed: Missing required fields.");
      return res.status(400).json({
        success: false,
        message: "Transaction type, amount, date and account are required.",
      });
    }

    const nextRecurringDate = isRecurring
      ? CalculateNextRecurringDate(Date.now(), recurringInterval)
      : null;

    const account = await accountModel.findOne({ _id: accountId, userId });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    if (transactionType === "EXPENSE" && amount > account.balance) {
      return res.status(400).json({
        success: false,
        message: "Transaction failed: Insufficient balance in your account.",
      });
    }
    const createdTransaction = await transactionModel.create({
      userId,
      transactionType,
      amount,
      description,
      accountId,

      date,
      category,
      receiptUrl,
      isRecurring,
      recurringInterval,
      nextRecurringDate,
    });

    account.balance =
      transactionType === "INCOME"
        ? account.balance + Number(amount)
        : account.balance - Number(amount);

    await account.save();

    return res.status(200).json({
      success: true,
      message: "Transaction added successfully.",
      data: createdTransaction,
    });
  } catch (error) {
    console.error("Error while adding transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not add transaction.",
      error: error.message,
    });
  }
};

export const scanTransaction = async (req, res) => {
  try {
    const image = req.file;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const arrayBuffer = await image.buffer;
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date : Select a date and time in ISO 8601 format (YYYY-MM-DDTHH:MM:SS.sssZ), using 24-hour time and timezone      offset.
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: Account Added, Salary, Freelance, Investments, Business, Rental, Other Income, Cashback, Rewards, Grants, Gifts Received, Refunds, Tax Return, Dividends, Lottery Winnings, Royalties, Resale, Consulting, Equipment Rental, Affiliate Income, Tips, Bonus, Reimbursements, Side Hustle, Gratuity, Rent Payback, Stock Sale, Cashback, YouTube Income, Podcast Income, Course Sales, Blogging Income, Residuals, Ad Revenue, Grants, Inheritance, Insurance Claim, Rent Deposit Return, Gambling Winnings, Donations Received, Refunds, Cash Gifts, Tax Refund, Property Rental, Partnership Profit, E-book Sales, Merchandise Sales, Housing, Transportation, Groceries, Utilities, Entertainment, Food, Shopping, Healthcare, Education, Personal Care, Travel, Insurance, Gifts & Donations, Bills & Fees, Pet Care, Subscriptions, Events, Investment Outflows, Childcare, Loan Payments, Emergency Fund, Other Expenses, Furnishing, Legal Services, Hobbies, Home Office, Maintenance, Fun & Leisure, Charity, Alcohol, Smoking, Laundry, ATM Withdrawal, Home Security, Software Subscriptions, Storage, Eco-friendly Purchases, Parking, Pet Food, Streaming Services, Celebrations, Makeup & Beauty, Baby Supplies, Kid's Education, Fines & Penalties, Gardening, Event Tickets, Coffee, Cosmetics, Tools & Equipment, Debt Repayment, Therapy, Pet Grooming, Internet, Haircut, Music Subscriptions, Vehicle Service, Account Added, Salary, Freelance, Investments, Business, Rental, Other Income, Cashback, Rewards, Grants, Gifts Received, Refunds, Tax Return, Dividends, Lottery Winnings, Royalties, Resale, Consulting, Equipment Rental, Affiliate Income, Tips, Bonus, Reimbursements, Side Hustle, Gratuity, Rent Payback, Stock Sale, Cashback, YouTube Income, Podcast Income, Course Sales, Blogging Income, Residuals, Ad Revenue, Grants, Inheritance, Insurance Claim, Rent Deposit Return, Gambling Winnings, Donations Received, Refunds, Cash Gifts, Tax Refund, Property Rental, Partnership Profit, E-book Sales, Merchandise Sales, Housing, Transportation, Groceries, Utilities, Entertainment, Food, Shopping, Healthcare, Education, Personal Care, Travel, Insurance, Gifts & Donations, Bills & Fees, Pet Care, Subscriptions, Events, Investment Outflows, Childcare, Loan Payments, Emergency Fund, Other Expenses, Furnishing, Legal Services, Hobbies, Home Office, Maintenance, Fun & 
      Leisure, Charity, Alcohol, Smoking, Laundry, ATM Withdrawal, Home Security, Software Subscriptions, 
        Storage, Eco-friendly Purchases, Parking, Pet Food, Streaming Services, Celebrations, Makeup & Beauty, Baby Supplies, Kid's 
        Education, Fines & Penalties, Gardening, Event Tickets, Coffee, Cosmetics, Tools & Equipment, Debt Repayment, 
        Therapy, Pet Grooming, Internet, Haircut, Music Subscriptions, Vehicle Service)      
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date&time ",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object`;
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: image.mimetype,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = await response.text();

    const cleanedText = text
      .replace(/```(?:json)?\n?/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedData;

    try {
      parsedData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Error parsing JSON from AI:", parseError);
      return res.status(500).json({
        success: false,
        message: "Failed to parse response from AI.",
        error: parseError.message,
      });
    }

    if (
      !parsedData ||
      Object.keys(parsedData).length === 0 ||
      !parsedData.amount ||
      !parsedData.date
    ) {
      return res.status(200).json({
        success: false,
        message: "No valid receipt data found in the image.",
      });
    }

    const transaction = {
      amount: parseFloat(parsedData.amount),
      date: new Date(parsedData.date),
      description: parsedData.description,
      merchantName: parsedData.merchantName,
      category: parsedData.category,
    };

    return res.status(200).json({
      success: true,
      message: "Receipt data extracted successfully.",
      data: transaction,
    });
  } catch (error) {
    console.error("Error while scanning transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not extract transaction from receipt.",
      error: error.message,
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { transactionId } = req.params;

    const {
      transactionType,
      amount,
      description,
      accountId,
      date,
      category,
      receiptUrl,
      isRecurring,
      recurringInterval,
    } = req.body;

    if (!transactionType || !amount || !date || !category || !accountId) {
      console.log("Validation Failed: Missing required fields.");
      return res.status(400).json({
        success: false,
        message:
          "Transaction type, amount, date, category and account ID are required.",
      });
    }

    const originalTransaction = await transactionModel.findById(transactionId);
    if (!originalTransaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found." });
    }

    const account = await accountModel.findOne({ _id: accountId, userId });
    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found." });
    }

    const oldBalanceChange =
      originalTransaction.transactionType === "INCOME"
        ? originalTransaction.amount
        : -originalTransaction.amount;

    const newBalanceChange = transactionType === "INCOME" ? amount : -amount;

    const netBalanceChange = newBalanceChange - oldBalanceChange;

    if (
      transactionType === "EXPENSE" &&
      account.balance + netBalanceChange < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Transaction failed: Insufficient balance in your account to update.",
      });
    }

    const updatedTransaction = await transactionModel.findByIdAndUpdate(
      transactionId,
      {
        transactionType,
        amount,
        description,
        accountId,
        date,
        category,
        receiptUrl,
        isRecurring,
        recurringInterval,
      },
      { new: true }
    );

    if (isRecurring) {
      const nextRecurringDate = CalculateNextRecurringDate(
        Date.now(),
        recurringInterval
      );
      updatedTransaction.nextRecurringDate = nextRecurringDate;
      await updatedTransaction.save();
    }

    account.balance += netBalanceChange;
    await account.save();

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully.",
      data: updatedTransaction,
    });
  } catch (error) {
    console.error("Error while updating transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not update transaction.",
      error: error.message,
    });
  }
};

export const getDashBoardTransaction = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { _id } = req.user;

     const transactions = await transactionModel
      .find({
        accountId,
        userId: _id,
      })
      .sort({ date: -1 }) 
      .limit(10); 

    res.status(200).json({
      success: true,
      message: "Dashboard Transactions retrieved successfully.",
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to retrieve transactions.",
      error: error.message,
    });
  }
};
