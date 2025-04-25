import userModel from "../models/userModel.js";
import accountModel from "../models/accountModel.js";
import transactionModel from "../models/transactionModel.js";
import budgetModel from "../models/budgetModel.js";
import mongoose from "mongoose";
import CalculateNextRecurringDate from "../libs/NextRecurringDate.js";

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

// with trnsaction property
// export const transactionDelete = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { _id: userId } = req.user;
//     const { transactionIds } = req.body;
//     console.log("Transaction IDs from client:", transactionIds);
//     console.log("Request Body:", req.body);
//     console.log("User from auth middleware:", req.user);

//     if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide valid transaction IDs.",
//       });
//     }

//     console.log("Received transaction IDs:", transactionIds);
//     console.log("User ID:", userId);

//     const transactionsToDelete = await transactionModel
//       .find({
//         userId,
//         _id: { $in: transactionIds },
//       })
//       .session(session);

//     for (let transaction of transactionsToDelete) {
//       const account = await accountModel
//         .findById(transaction.accountId)
//         .session(session);

//       if (!account) {
//         throw new Error(
//           `Account not found for transaction ID ${transaction._id}`
//         );
//       }

//       let newBalance = account.balance;

//       if (transaction.transactionType === "INCOME") {
//         newBalance -= transaction.amount;
//       } else if (transaction.transactionType === "EXPENSE") {
//         newBalance += transaction.amount;
//       }

//       await accountModel.findByIdAndUpdate(
//         transaction.accountId,
//         { balance: newBalance },
//         { session }
//       );
//     }

//     const deleteResult = await transactionModel
//       .deleteMany({
//         userId,
//         _id: { $in: transactionIds },
//       })
//       .session(session);

//     await session.commitTransaction();

//     return res.status(200).json({
//       success: true,
//       message:
//         "Transactions deleted and account balances updated successfully.",
//       data: deleteResult,
//     });
//   } catch (error) {
//     try {
//       await session.abortTransaction();
//     } catch (abortErr) {
//       console.error("Failed to abort transaction:", abortErr);
//     }
//     console.error("Server error during transaction delete:", error.message);
//     console.error(error.stack);

//     console.error("Server error during transaction delete:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error: Unable to delete transactions.",
//       error: error.message,
//     });
//   } finally {
//     session.endSession();
//   }
// };

// without transaction property
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

    const transactionsToDelete = await transactionModel
      .find({
        userId,
        _id: { $in: transactionIds },
      })
      // .session(session);

    for (let transaction of transactionsToDelete) {
      const account = await accountModel
        .findById(transaction.accountId)
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
        { balance: newBalance },
        // { session }
      );
    }

    const deleteResult = await transactionModel
      .deleteMany({
        userId,
        _id: { $in: transactionIds },
      })
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
// with transaction property
// export const addTransaction = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { _id } = req.user;
//     const {
//       transactionType,
//       amount,
//       description,
//       accountId,
// date,
//       category,
//       receiptUrl,
//       isRecurring,
//       recurringInterval,
//     } = req.body;

//     if (!transactionType || !amount || !accountId || !date) {
//       return res.status(400).json({
//         success: false,
//         message: "Transaction type, amount, date and account are required.",
//       });
//     }

//     const nextRecurringDate = isRecurring
//       ? CalculateNextRecurringDate(Date.now(), recurringInterval)
//       : null;

//     const createdTransaction = await transactionModel.create(
//       [
//         {
//           userId: _id,
//           transactionType,
//           amount,
//           description,
//           accountId,
//            date,
//           category,
//           receiptUrl,
//           isRecurring,
//           recurringInterval,
//           nextRecurringDate,
//         },
//       ],
//       { session }
//     );

//     const account = await accountModel
//       .findOne({ _id: accountId, userId: _id })
//       .session(session);

//     if (!account) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: "Account not found. Please check the account.",
//       });
//     }

//     account.balance =
//       transactionType === "INCOME"
//         ? account.balance + Number(amount)
//         : account.balance - Number(amount);

//     await account.save({ session });

//     await session.commitTransaction();

//     return res.status(200).json({
//       success: true,
//       message: "Transaction added successfully.",
//       data: createdTransaction[0],
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Error while adding transaction:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error. Could not add transaction.",
//       error: error.message,
//     });
//   } finally {
//     session.endSession();
//   }
// };

// without transaction property
export const addTransaction = async (req, res) => {
  try {
    const { _id } = req.user;
  
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

      const createdTransaction = await transactionModel.create({
      userId: _id,
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


    const account = await accountModel.findOne({ _id: accountId, userId: _id });

    if (!account) {
      
      return res.status(404).json({
        success: false,
        message: "Account not found. Please check the account.",
      });
    }

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

// export const addTransaction = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     console.log("User", req.user)
//     const {
//       transactionType,
//       amount,
//       description,
//       accountId,
//       date,
//       category,
//       receiptUrl,
//       isRecurring,
//       recurringInterval,
//     } = req.body;
//     // Basic validation
//     if (!transactionType || !amount || !accountId || !date) {
//       return res.status(400).json({
//         success: false,
//         message: "Transaction type, amount, date and account are required.",
//       });
//     }

//     const nextRecurringDate = isRecurring
//       ? CalculateNextRecurringDate(Date.now(), recurringInterval)
//       : null;

//     // Create the transaction
//     const createdTransaction = await transactionModel.create({
//       userId: _id,
//       transactionType,
//       amount,
//       description,
//       accountId,
//       date,
//       category,
//       receiptUrl,
//       isRecurring,
//       recurringInterval,
//       nextRecurringDate,
//     });

//     // Update the account balance
//     const account = await accountModel.findOne({ _id: accountId, userId: _id });

//     if (!account) {
//       return res.status(404).json({
//         success: false,
//         message: "Account not found. Please check the account.",
//       });
//     }

//     account.balance =
//       transactionType === "INCOME"
//         ? account.balance + Number(amount)
//         : account.balance - Number(amount);

//     await account.save();

//     return res.status(200).json({
//       success: true,
//       message: "Transaction added successfully.",
//       data: createdTransaction,
//     });
//   } catch (error) {
//     console.error("Error while adding transaction:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error. Could not add transaction.",
//       error: error.message,
//     });
//   }
// };
