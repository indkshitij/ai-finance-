import { AppContext } from "@/context/AppContext";
import React, { useContext, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Sector,
  Label,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
const colors = [
  "#FF6B6B",
  "#6BCB77",
  "#4D96FF",
  "#FFD93D",
  "#FF6F91",
  "#845EC2",
  "#FFC75F",
  "#F9F871",
  "#D65DB1",
  "#2C73D2",
  "#FF9671",
  "#FFC75F",
  "#0081CF",
  "#845EC2",
  "#FFC75F",
  "#FF8066",
  "#00C9A7",
  "#B39CD0",
  "#FF5E78",
  "#2D4059",
  "#FF9671",
  "#FFC75F",
  "#EA7773",
  "#1FAB89",
  "#E23E57",
  "#66DE93",
  "#AB83A1",
  "#C34A36",
  "#40407a",
  "#5f27cd",
  "#ff9f43",
  "#48dbfb",
  "#00d2d3",
  "#ff6b81",
  "#10ac84",
  "#feca57",
  "#341f97",
  "#ee5253",
  "#0abde3",
  "#576574",
  "#1dd1a1",
  "#ff793f",
  "#82589F",
  "#3dc1d3",
  "#e15f41",
  "#38ada9",
  "#ffb142",
  "#3B3B98",
  "#ff5252",
  "#0fbcf9",
  "#34e7e4",
  "#f368e0",
];

const AccountOverview = ({ accountData }) => {
  const {
    fetchDashboardTransactionsUsingAccountId,
    currency,
    formatDate,
    formatTime,
  } = useContext(AppContext);
  const defaultAcc = accountData.find((acc) => acc.isDefault === true);

  const [accountTransactions, setAccountTransactions] = useState([]);
  const [selectedAccId, setSelectedAccId] = useState(defaultAcc?._id || null);

  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.transactionType === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const expensesByCategory = Array.isArray(currentMonthExpenses)
    ? currentMonthExpenses.reduce((acc, t) => {
        const category = t.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += t.amount;
        return acc;
      }, {})
    : {};

  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({ name: category, value: amount })
  );
  const total = pieChartData.reduce(
    (acc, curr) => acc + Number(curr.value || 0),
    0
  );

  const isMobile = window.innerWidth < 640;

  useEffect(() => {
    const fetchAccountTransactions = async () => {
      if (selectedAccId) {
        const result = await fetchDashboardTransactionsUsingAccountId(
          selectedAccId
        );
        if (result?.success) {
          setAccountTransactions(result.data || []);
        }
      }
    };
    fetchAccountTransactions(selectedAccId);
  }, [selectedAccId]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="w-full ">
        <CardHeader>
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base sm:text-md md:text-lg font-medium text-gray-900">
              Recent Transactions
            </CardTitle>
            <Select value={selectedAccId} onValueChange={setSelectedAccId}>
              <SelectTrigger className="w-[250px] md:w-[280px]">
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                {accountData.map((acc) => (
                  <SelectItem key={acc._id} value={acc._id}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-2.5">
          <div className={`flex flex-col`}>
            {accountTransactions?.length === 0 ? (
              <div className="text-center text-gray-500">
                No transactions made yet
              </div>
            ) : (
              accountTransactions.slice(0, 5).map((t) => (
                <div
                  key={t._id}
                  className="flex flex-col px-4 py-2.5 border-b transition-all bg-white"
                >
                  {/* Description */}
                  <div className="text-sm font-normal break-words text-gray-800">
                    {t?.description.length === 0
                      ? "Description is not Mentioned"
                      : t.description.length > 80
                      ? `${t.description.slice(0, 80)}...`
                      : t.description}
                  </div>

                  {/* Date/Time and Amount */}
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <p>
                      {formatDate(t?.date)}, {formatTime(t?.date)}
                    </p>
                    <div
                      className={`flex items-center font-medium text-base ${
                        t?.transactionType === "EXPENSE"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      <span className="mr-1">
                        {t?.transactionType === "EXPENSE" ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </span>
                      {currency}
                      {t?.amount?.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-md md:text-lg font-medium text-gray-900">
            Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-full flex justify-center items-center ">
          {pieChartData.length == 0 ? (
            <p className="text-center text-gray-500">No Expense This Month</p>
          ) : (
            <div className="w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={isMobile ? 90 : 120}
                    innerRadius={isMobile ? 55 : 70}
                    dataKey="value"
                    isAnimationActive
                    animationDuration={1000}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>

                  {/* Center Total Amount */}
                  <text
                    x="50%"
                    y="45%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: isMobile ? "16px" : "18px",
                      fontWeight: 500,
                      fill: "#364153",
                    }}
                  >
                    {`${currency}${total.toFixed(2)}`}
                  </text>

                  {/* Tooltip */}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                    }}
                    itemStyle={{
                      fontSize: "14px",
                      color: "#374151",
                    }}
                    formatter={(value, name) => [
                      `${currency}${Number(value || 0).toFixed(2)}`,
                      name,
                    ]}
                  />

                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{
                      marginTop: "20px",
                      fontSize: "13px",
                      color: "#6b7280",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountOverview;
