import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "sonner";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const currency = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const formatted = parsedDate.toLocaleString("en-GB", options);
    return formatted;
  };

  const formatTime = (time) => {
    const parsedDate = new Date(time);
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formatted = parsedDate.toLocaleString("en-GB", options);
    return formatted;
  };

  // Function to fetch account details
  const [accountData, setAccountData] = useState([]);
  const fetchAccountDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/account/fetch`, {
        withCredentials: true,
      });
      if (data.success) {
        setAccountData(data.data);
      } else {
        toast.error(data.message || "Failed to fetch account details.");
      }
    } catch (err) {
      console.log(err);
      const serverMessage = err?.response?.data?.message;
      const finalMessage =
        serverMessage ||
        err?.message ||
        "An unexpected error occurred. Please try again later.";
      toast.error(finalMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch particular  account Using id
  const fetchAccountDataUsingId = async (accountId) => {
    setLoading(true);

    try {
      const { data } = await axios.get(`${backendUrl}/account/${accountId}`, {
        withCredentials: true,
      });
      
      if (data.success) {
        return { success: true, data: data.data };
      } else {
        toast.error(data.message || "Failed to fetch account details.");
        return { success: false, data: null };
      }
    } catch (err) {
      console.error(err);
      const serverMessage = err?.response?.data?.message;
      const finalMessage =
        serverMessage ||
        err?.message ||
        "An unexpected error occurred. Please try again later.";
      toast.error(finalMessage);
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch transactions for a specific account
  const [transactions, setTransactions] = useState([]);
  const fetchTransactions = async (accountId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/transaction/${accountId}`,
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        setTransactions(data.data);
        return { success: true, data: data };
      } else {
        toast.error(data.message || "Failed to fetch transactions.");
      }
    } catch (err) {
      console.log(err);
      const serverMessage =
        err?.response?.data?.message ||
        err?.message ||
        "An unexpected error occurred. Please try again later.";
      toast.error(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  // function to fetch particular transaction
  const fetchTransactionDataUsingId = async (transactionId) => {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `${backendUrl}/transaction/id/${transactionId}`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        toast.error(data.message || "Failed to fetch transaction details.");
        return { success: false, data: null };
      }
    } catch (err) {
      console.error(err);
      const serverMessage = err?.response?.data?.message;
      const finalMessage =
        serverMessage ||
        err?.message ||
        "An unexpected error occurred. Please try again later.";
      toast.error(finalMessage);
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardTransactionsUsingAccountId = async (accountId) => {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `${backendUrl}/transaction/dashboard/${accountId}`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        toast.error(data.message || "Failed to fetch transaction details.");
        return { success: false, data: null };
      }
    } catch (err) {
      console.error(err);
      const serverMessage = err?.response?.data?.message;
      const finalMessage =
        serverMessage ||
        err?.message ||
        "An unexpected error occurred. Please try again later.";
      toast.error(finalMessage);
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  // Function To Delete Transaction
  const deleteTransaction = async (transactionIds) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`${backendUrl}/transaction/delete`, {
        data: { transactionIds },
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message || "Transactions deleted successfully!");
      } else {
        toast.error(data.message || "Failed to delete transactions.");
      }
    } catch (err) {
      console.log(err);
      const serverMessage =
        err?.response?.data?.message ||
        err?.message ||
        "An unexpected error occurred. Please try again later.";
      toast.error(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function To Delete Transaction
  const deleteAccount = async (accountId) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${backendUrl}/account/delete/${accountId}`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(
          data.message ||
            "Account deleted successfully along with all related data."
        );
      } else {
        toast.error(data.message || "Failed to delete the account.");
      }
    } catch (err) {
      console.error("Delete Account Error:", err);

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again later.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to change the default account
  const changeDefaultAccount = async (accountId) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/account/change-default`,
        { accountId },
        { withCredentials: true }
      );

      if (data.success) {
        fetchAccountDetails();
        fetchBudget();
        toast.success(data.message || "Default account changed successfully!");
      } else {
        toast.error(data.message || "Failed to change default account.");
      }
    } catch (err) {
      console.log(err);
      const serverMessage = err?.response?.data?.message;
      const finalMessage =
        serverMessage ||
        err?.message ||
        "An unexpected error occurred. Please try again later.";
      toast.error(finalMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch budget
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const fetchBudget = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/budget/get`, {
        withCredentials: true,
      });
      if (data?.success) {
        setBudget(data?.data?.budget?.amount);
        setExpenses(data?.data?.currentExpenses);
        return { success: true, data: data };
      } else {
        toast.error(data?.message || "Failed to fetch budget.");
        return { success: false };
      }
    } catch (err) {
      console.log(err);
      const serverMessage = err?.response?.data?.message;
      const finalMessage =
        serverMessage ||
        err?.message ||
        "An unexpected error occurred. Please try again later.";
      toast.error(finalMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Function to update budget
  const handleUpdateBudget = async (updatedBudget) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/budget/setup`,
        updatedBudget,
        { withCredentials: true }
      );

      if (data.success) {
        fetchBudget();
        toast.success(data.message || "Budget updated successfully!");
        return { success: true };
      } else {
        toast.error(data.message || "Failed to update budget.");
        return { success: false };
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      const serverMessage = error?.response?.data?.message;
      const finalMessage =
        serverMessage || error?.message || "An unexpected error occurred.";
      toast.error(finalMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // function to create transaction
  const createTransaction = async (formData) => {
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/transaction/add`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        fetchBudget();
        fetchAccountDetails();
        toast.success(data.message || "Transaction added successfully.");
        return { success: true };
      } else {
        toast.error(data.message || "Something went wrong.");
        return { success: false };
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      const serverMessage = error?.response?.data?.message;
      const finalMessage =
        serverMessage ||
        error?.message ||
        "An unexpected error occurred. Please try again later.";
      toast.error(finalMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // function to update transaction
  const updateTransaction = async (formData, transactionId) => {
    setLoading(true);

    try {
      const { data } = await axios.put(
        `${backendUrl}/transaction/update/${transactionId}`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        fetchBudget();
        fetchAccountDetails();
        toast.success(data.message || "Transaction updated successfully.");
        return { success: true };
      } else {
        toast.error(data.message || "Something went wrong.");
        return { success: false };
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      const serverMessage = error?.response?.data?.message;
      const finalMessage =
        serverMessage ||
        error?.message ||
        "An unexpected error occurred. Please try again later.";
      toast.error(finalMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // function to create account
  const createAccount = async (formData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/account/create`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (data?.success) {
        toast.success(
          data?.message || "Your account has been created successfully!"
        );
        fetchAccountDetails();
        return { success: true };
      } else {
        toast.error(data?.message || "Something went wrong. Please try again.");
        return { success: false };
      }
    } catch (err) {
      console.log(err);
      const serverMessage = err?.response?.data?.message;
      const finalMessage =
        serverMessage ||
        err?.message ||
        "An unexpected error occurred. Please try again later.";
      toast.error(finalMessage);
      return { success: false };
    }
  };

  // function to delete account
  const handleDeleteAccount = async (accountId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/account/delete/${accountId}`,
        { withCredentials: true }
      );
      
      if (data.success) {
        toast.success(data?.message || "Your account has been deleted successfully!");
        fetchAccountDetails()
      } else {
        toast.error(data?.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.log(err);
      const serverMessage = err?.response?.data?.message;
      const finalMessage =
        serverMessage || err?.message || "An unexpected error occurred. Please try again later.";
      
      toast.error(finalMessage);
    }
  };
  

  // function to scan receipt
  const scanReceipt = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post(
        `${backendUrl}/transaction/scan`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (data?.success) {
        toast.success(data?.message || "Receipt scanned successfully!");
        return { success: true, data: data.data };
      } else {
        toast.error(
          data?.message ||
            "Couldn't extract details from the receipt. Please try another image."
        );
        return { success: false };
      }
    } catch (err) {
      console.log(err);
      const serverMessage = err?.response?.data?.message;
      const finalMessage =
        serverMessage ||
        err?.message ||
        "An unexpected error occurred. Please try again later.";
      toast.error(finalMessage);
      return { success: false };
    }
  };

  // sync user
  const syncUser = async (clerkUser) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/user/user-sync`,
        { clerkUser },
        { withCredentials: true }
      );

      if (data?.success) {
      
      } else {
        toast.error(data?.message || "Failed to sync user");
      }
    } catch (err) {
      console.log(err);
      const serverMessage = err?.response?.data?.message;
      const finalMessage =
        serverMessage ||
        err?.message ||
        "An unexpected error occurred. Please try again later.";
      toast.error(finalMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/user/logout`,
        {},
        { withCredentials: true }
      );

      if (data?.success) {
        toast.success(data?.message || "Logged out successfully");
      } else {
        toast.error(data?.message || "Logout failed");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Logout failed";
      toast.error(message);
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    backendUrl,
    currency,
    loading,
    setLoading,

    syncUser,
    logout,

    formatDate,
    formatTime,

    createAccount,
    fetchAccountDetails,
    fetchAccountDataUsingId,
    accountData,
    handleDeleteAccount,

    changeDefaultAccount,

    transactions,
    fetchTransactions,
    deleteTransaction,
    fetchTransactionDataUsingId,
    fetchDashboardTransactionsUsingAccountId,

    scanReceipt,

    createTransaction,
    updateTransaction,

    fetchBudget,
    handleUpdateBudget,
    budget,
    expenses,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext };
export default AppContextProvider;
