import { AppContext } from "@/context/AppContext";
import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { BarLoader } from "react-spinners";
const AccountChart = lazy(() => import("@/components/AccountChart"));
const TransactionTable = lazy(() => import("@/components/TransactionTable"));

const Account = () => {
  document.title = "Accounts | NeoFinance";
  const { accountId } = useParams();
  const { fetchTransactions, transactions, currency, fetchAccountDataUsingId } =
    useContext(AppContext);

  const [accountData, setAccountData] = useState([]);

  useEffect(() => {
    if (accountId) {
      (async () => {
        const result = await fetchAccountDataUsingId(accountId);
        if (result?.success) {
          setAccountData(result?.data);
          await fetchTransactions(accountId);
        }
      })();
    }
  }, [accountId]);

  return (
    <>
      <Header />
      <div className="min-h-[80vh] px-3 md:px-10 lg:px-20 pt-3">
        {/* account info */}
        <div className="flex justify-between flex-col xl:flex-row items-start xl:items-center gap-2">
          <div className="">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold gradient-title tracking-tight leading-snug capitalize transition-transform transform ">
              {accountData?.name?.length > 45
                ? `${accountData.name.slice(0, 45)}...`
                : accountData?.name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground capitalize sm:-mt-2">
              {accountData?.type?.toLowerCase()} account
            </p>
          </div>

          <div className="w-full xl:w-fit flex flex-row xl:flex-col justify-between items-end text-right">
            <p className="text-xl sm:text-2xl font-medium inline-block">
              {currency} {parseFloat(accountData.balance).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              {transactions.length}{" "}
              {transactions.length <= 1 ? "Transaction" : "Transactions"}
            </p>
          </div>
        </div>

        {/* Chart Table */}
        <div className="mt-4">
          <Suspense fallback={<BarLoader width={"100%"} color="#3b82f6" />}>
            <AccountChart transactions={transactions} />
          </Suspense>
        </div>

        {/* Transaction Table */}
        <div className="mt-4">
          <Suspense fallback={<BarLoader width={"100%"} color="#3b82f6" />}>
            <TransactionTable transactions={transactions} />
          </Suspense>
        </div>
      </div>
      <div className="mt-7">
        <Footer />
      </div>
    </>
  );
};

export default Account;
