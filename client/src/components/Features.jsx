import React from "react";
import {
  Zap,
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";

const featuresData = [
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "Advanced Analytics",
    description:
      "Get detailed insights into your spending patterns with AI-powered analytics.",
  },
  {
    icon: <Receipt className="h-8 w-8 text-blue-600" />,
    title: "Smart Receipt Scanner",
    description:
      "Extract data automatically from receipts using advanced AI technology.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "Budget Planning",
    description:
      "Create and manage budgets effortlessly with intelligent recommendations.",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "Multi-Account Support",
    description:
      "Link and manage multiple accounts and cards all in one secure place.",
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-600" />,
    title: "Multi-Currency",
    description:
      "Track spending in different currencies with real-time conversion rates.",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: "Automated Insights",
    description:
      "Receive smart, real-time insights to help you improve your finances.",
  },
];

const Features = () => {
  return (
    <section className="py-10 sm:py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-zinc-800 mb-8">
          Everything You Need to Manage Your Finances
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {featuresData.map((feature, index) => (
            <Card
              key={index}
              className="bg-white hover:shadow-xl transition-shadow duration-300 rounded-2xl border border-gray-100 cursor-default"
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
