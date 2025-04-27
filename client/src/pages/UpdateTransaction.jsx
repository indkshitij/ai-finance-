import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BarLoader } from "react-spinners";
import { AppContext } from "@/context/AppContext";
import { useParams } from "react-router-dom";

const UpdateTransactionForm = lazy(() =>
  import("@/components/UpdateTransactionForm")
);

const UpdateTransaction = () => {
  document.title = "Update Transaction | NeoFinance";

  const { accountData } = useContext(AppContext);

  return (
    <>
      <Header />
      <div className="min-h-[80vh] w-full px-4 sm:px-6 md:px-12 lg:px-50 xl:px-100 pt-5">
        <h1 className="text-3xl md:text-4xl lg:text-5xl pb-6 gradient-title tracking-tight font-inter font-bold">
          Edit Transaction
        </h1>
        <Suspense fallback={<BarLoader width={"100%"} color="#3b82f6" />}>
          <UpdateTransactionForm accountData={accountData} />
        </Suspense>
      </div>
      <div className="mt-7">
        <Footer />
      </div>
    </>
  );
};

export default UpdateTransaction;
