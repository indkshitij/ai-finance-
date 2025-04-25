import AccountGrid from "@/components/AccountGrid";
import AccountOverview from "@/components/AccountOverview";
import BudgetProgress from "@/components/BudgetProgress";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import useFetch from "@/hooks/useFetch";
import React, { useEffect } from "react";

const Dashboard = () => {
  document.title = "Dashboard | NeoFinance"
  const { apiCall } = useFetch();
  useEffect(() => {}, []);
  return (
    <>
      <Header />
      <div className="min-h-[80vh] px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 pt-3">
        <h1 className="text-3xl md:text-4xl lg:text-5xl pb-6 gradient-title tracking-tight font-inter font-bold">
          Dashboard
        </h1>

        <div className="flex flex-col gap-5">
          <BudgetProgress />

          <AccountOverview />

          <AccountGrid />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
