import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddTransactionForm from "@/components/AddTransactionForm";

const CreateTransaction = () => {
  document.title = "Create Transaction | NeoFinance";
  return (
    <>
      {" "}
      <Header />
      <div className="min-h-[80vh] w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-80 pt-3">
        <h1 className="text-3xl md:text-4xl lg:text-5xl pb-6 gradient-title tracking-tight font-inter font-bold">
          Add Transaction
        </h1>
        <AddTransactionForm />
      </div>
      <Footer />
    </>
  );
};

export default CreateTransaction;
