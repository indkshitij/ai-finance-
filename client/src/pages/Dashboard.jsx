import React, { lazy, Suspense, useContext, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { BarLoader } from "react-spinners";
import AccountGrid from "@/components/AccountGrid";
import { AppContext } from "@/context/AppContext";
const AccountOverview = lazy(() => import("@/components/AccountOverview"));
const BudgetProgress = lazy(() => import("@/components/BudgetProgress"));

const Dashboard = () => {
  document.title = "Dashboard | NeoFinance";
  const { accountData } = useContext(AppContext);
  return (
    <>
      <Header />
      <div className="min-h-[80vh] px-3 md:px-10 lg:px-20 pt-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold gradient-title tracking-tight leading-snug capitalize transition-transform transform ">
          Dashboard
        </h1>

        <div className="flex flex-col gap-2 md:gap-5 mt-2">
          <Suspense fallback={<BarLoader width={"100%"} color="#3b82f6" />}>
            <BudgetProgress />
          </Suspense>

          <Suspense fallback={<BarLoader width={"100%"} color="#3b82f6" />}>
            <AccountOverview accountData={accountData} />
          </Suspense>

          <Suspense fallback={<BarLoader width={"100%"} color="#3b82f6" />}>
            <AccountGrid />
          </Suspense>
        </div>
      </div>

      <div className="mt-7">
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
