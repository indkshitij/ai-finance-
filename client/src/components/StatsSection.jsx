import React from "react";
import { BrainCircuit, Zap, LifeBuoy, Users } from "lucide-react";

const statsData = [
  {
    id: 1,
    icon: <BrainCircuit className="w-8 h-8 text-blue-600" />,
    label: "AI Engine",
    value: "Fully Integrated",
  },
  {
    id: 2,
    icon: <Zap className="w-8 h-8 text-yellow-500" />,
    label: "Tracking Speed",
    value: "Real-Time Insights",
  },
  {
    id: 3,
    icon: <Users className="w-8 h-8 text-green-600" />,
    label: "Beta Testers",
    value: "Now Open",
  },
  {
    id: 4,
    icon: <LifeBuoy className="w-8 h-8 text-red-500" />,
    label: "Support",
    value: "24/7 Help Desk",
  },
];

const StatsSection = () => {
  return (
    <section className="py-10 sm:py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsData.map((stat) => (
          <div
            key={stat.id}
            className="cursor-default flex flex-col justify-center items-center bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
          >
            <div className="mx-auto mb-4 ">{stat.icon}</div>
            <h3 className="text-sm sm:text-lg font-semibold sm:font-medium text-zinc-800">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
