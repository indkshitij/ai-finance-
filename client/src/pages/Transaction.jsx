import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";

const Transaction = () => {
  document.title = "Transaction | NeoFinance";
  return (
    <>
      <Header />
      <div className="min-h-[80vh] w-full flex justify-center items-center">
        Transaction
      </div>

      <div className="mt-7">
        <Footer />
      </div>
    </>
  );
};

export default Transaction;
