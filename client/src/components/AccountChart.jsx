import React, { useContext, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { endOfDay, startOfDay, subDays, format } from "date-fns";
import { AppContext } from "@/context/AppContext";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

const AccountChart = ({ transactions }) => {
  const { currency } = useContext(AppContext);
  const [dateRange, setDateRanges] = useState("7D");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    //  Generate full date list
    const dateList = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endOfDay(now)) {
      dateList.push(format(currentDate, "MMM dd"));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    //  Initialize date map
    const dateMap = {};
    dateList.forEach((date) => {
      dateMap[date] = { name: date, income: 0, expense: 0 };
    });

    // transaction data
    transactions.forEach((t) => {
      const createdAt = new Date(t.date);
      if (createdAt >= startDate && createdAt <= endOfDay(now)) {
        const dateKey = format(createdAt, "MMM dd");
        if (!dateMap[dateKey]) {
          dateMap[dateKey] = { name: dateKey, income: 0, expense: 0 };
        }
        if (t.transactionType === "INCOME") {
          dateMap[dateKey].income += t.amount;
        } else {
          dateMap[dateKey].expense += t.amount;
        }
      }
    });

    // Return sorted values
    return Object.values(dateMap).sort(
      (a, b) => new Date(a.name) - new Date(b.name)
    );
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  const netTotal = totals.income - totals.expense;

  return (
    <section className="w-full">
      <Card className="px-0 pb-12 rounded-lg">
        <CardHeader>
          {/* Heading */}
          <div className="flex flex-col md:flex-row justify-between  items-end sm:items-center gap-4 ">
            {/* Stats */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 justify-start items-center mt-2 gap-4">
              <div className="text-left ">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Total Income
                </p>
                <p className="text-green-500 font-medium text-md sm:text-lg">
                  {currency} {totals.income.toFixed(2)}
                </p>
              </div>
              <div className="text-left">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Total Expense
                </p>
                <p className="text-red-500 font-medium text-md sm:text-lg">
                  {currency} {totals.expense.toFixed(2)}
                </p>
              </div>
              <div className="text-left">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Net Total
                </p>
                <p
                  className={`font-medium text-md sm:text-lg ${
                    netTotal >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {currency} {netTotal.toFixed(2)}
                </p>
              </div>
            </div>
            <Select defaultValue={dateRange} onValueChange={setDateRanges}>
              <SelectTrigger className="w-[130px] sm:w-[150px]">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                  <SelectItem
                    key={key}
                    value={key}
                    className="text-xs sm:text-sm"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <div className="h-60 sm:h-52 md:h-[300px] ">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 15, left: 5, bottom: 15 }}
              barCategoryGap="25%"
            >
              <CartesianGrid
                strokeDasharray="5 5"
                stroke="#e5e7eb"
                vertical={false}
              />

              {/* X Axis */}
              <XAxis
                dataKey="name"
                angle={-40}
                textAnchor="end"
                interval={
                  filteredData.length > 15
                    ? Math.ceil(filteredData.length / 15)
                    : 0
                }
                style={{ fontSize: "12px" }}
              />

              {/* Y Axis */}
              <YAxis
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${currency} ${value}`}
              />

              {/* Tooltip */}
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  fontSize: "14px",
                }}
                formatter={(value, name) => [`${currency} ${value}`, name]}
                labelFormatter={(label) => `Date: ${label}`}
              />

              {/* Bars */}
              <Bar
                dataKey="income"
                name="Income"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center items-center gap-5 mt-3">
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-3 h-3 bg-[#ef4444] rounded-full"></div>
              <p className="text-[#ef4444] text-xs sm:text-sm font-normal sm:font-medium">
                Expense
              </p>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-3 h-3 bg-[#22c55e] rounded-full"></div>
              <p className="text-[#22c55e] text-xs sm:text-sm font-normal sm:font-medium">
                Income
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default AccountChart;
