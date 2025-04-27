import React from "react";
import { Card, CardContent } from "./ui/card";
import { BarChart, Receipt, CreditCard, Globe, PieChart, Zap } from 'lucide-react';

const featuresData = [
  {
    icon: <BarChart className="h-8 w-8 text-blue-600" />,
    title: "Smart Analytics",
    description:
      "Unlock the power of AI to reveal trends in your spending, helping you make informed financial decisions.",
  },
  {
    icon: <Receipt className="h-8 w-8 text-blue-600" />,
    title: "Instant Receipt Capture",
    description:
      "Snap and upload receipts, and let AI extract transaction details, saving you hours of manual input.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "Effortless Budgeting",
    description:
      "Set up personalized budgets with ease, and get smart suggestions to stay on track and save more.",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "All Accounts Unified",
    description:
      "Link all your bank accounts, credit cards, and wallets for seamless tracking in one secure platform.",
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-600" />,
    title: "Global Currency Tracking",
    description:
      "Manage and track expenses across multiple currencies with real-time conversion, no matter where you are.",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: "Instant Financial Insights",
    description:
      "Get AI-powered, actionable insights in real time, guiding you to smarter spending and savings.",
  },
];


const Features = () => {
  return (
    <section id="feature" className="py-10 sm:py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-zinc-800 mb-8">
          Everything You Need to Manage Your Finances
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 ">
          {featuresData.map((feature, index) => (
            <Card
              key={index}
              className="bg-white hover:shadow-xl transition-shadow duration-300 rounded-2xl border border-gray-200 cursor-default"
            >
              <CardContent className="px-4 py-3 space-y-3 sm:space-y-4">
                <div className="bg-blue-100 w-fit h-fit p-2.5 flex items-center justify-center rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-zinc-800">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
