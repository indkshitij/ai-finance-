import React from "react";
import { BarChart3, PieChart, CreditCard,Lightbulb } from "lucide-react";

export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "1. Set Up Your Account",
    description:
      "Quickly create a secure account and get ready to take control of your finances in no time.",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "2. Connect Your Accounts",
    description:
      "Link your bank and payment accounts seamlessly for automatic tracking of all your transactions.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "3. Track Your Spending",
    description:
      "Keep an eye on your spending with real-time transaction updates and automatic categorization.",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-blue-600" />,
    title: "4. Get Smarter Insights",
    description:
      "Receive personalized AI-driven tips and alerts to optimize your budget and improve your financial health.",
  },
];


const HowItWork = () => {
  return (
    <section className="py-12">
      <div className="max-w-8xl mx-auto px-2">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-zinc-800 mb-8">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-7">
          {howItWorksData.map((step, index) => (
            <div
              key={index}
              className="text-center py-6 px-4 rounded-xl hover:shadow-xl hover:scale-[1.02] ease-in-out transition-shadow duration-300 bg-white cursor-default"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-zinc-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-xs lg:text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWork;
