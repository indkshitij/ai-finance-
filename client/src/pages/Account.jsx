import { AppContext } from "@/context/AppContext";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import useFetch from "@/hooks/useFetch";
import TransactionTable from "@/components/TransactionTable";
import { BarLoader } from "react-spinners";
import AccountChart from "@/components/AccountChart";

const Account = () => {
  document.title = "Accounts | NeoFinance";
  const { accountId } = useParams();
  const { fetchTransactions, transactions, currency } = useContext(AppContext);
  const { apiCall } = useFetch();

  const [accountData, setAccountData] = useState([]);

  useEffect(() => {
    if (accountId) {
      (async () => {
        const result = await apiCall("get", `/account/${accountId}`);
        setAccountData(result?.data);
        await fetchTransactions(accountId);
      })();
    }
  }, [accountId]);
  return (
    <>
      <Header />
      <div className="min-h-[80vh] px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 pt-3">
        {/* account info */}
        <div className="flex justify-between flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-title tracking-tight capitalize transition-transform transform ">
              {accountData?.name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground capitalize">
              {accountData?.type?.toLowerCase()} account
            </p>
          </div>

          <div className="w-full sm:w-fit flex flex-row sm:flex-col justify-between sm:justify-around items-end sm:text-right">
            <p className="text-xl sm:text-2xl font-medium">
              {currency} {parseFloat(accountData.balance).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              {transactions.length}{" "}
              {transactions.length === 1 ? "Transaction" : "Transactions"}
            </p>
          </div>
        </div>

        {/* Chart Table */}
        <div className="mt-4">
          <Suspense
            fallback={
              <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
            }
          >
            <AccountChart transactions={transactions} />
          </Suspense>
        </div>

        {/* Transaction Table */}
        <div className="mt-4">
          <Suspense
            fallback={
              <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
            }
          >
            <TransactionTable transactions={transactions} />
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Account;
