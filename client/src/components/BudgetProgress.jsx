import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Check, Pencil, X } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";

const BudgetProgress = () => {
  const {
    currency,
    fetchBudget,
    budget,
    expenses,
    accountData,
    handleUpdateBudget,
  } = useContext(AppContext);

  let prevBudget = parseFloat(budget);
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(prevBudget || 0);
  const [loading, setLoading] = useState(false);

  let defaultAcc;
  if (accountData) {
    defaultAcc = accountData.find((acc) => acc.isDefault === true);
  }

  const handleCancel = () => {
    setNewBudget(budget?.amount?.toString() || "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!newBudget || isNaN(newBudget) || parseFloat(newBudget) <= 0) {
      toast.error("Please enter a valid budget amount.");
      return;
    }

    const updatedBudget = {
      accountId: defaultAcc._id,
      amount: parseFloat(newBudget),
      recurrence,
    };
    const updateResult = await handleUpdateBudget(updatedBudget);
    if (updateResult?.success) {
      setIsEditing(false);
    }
  };

  let percentageUsed =
    budget && expenses != null ? (expenses / budget) * 100 : 0;
  if (percentageUsed > 100) {
    percentageUsed = 100;
  }

  useEffect(() => {
    fetchBudget();
  }, []);

  return (
    <section className="">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex-1">
            <CardTitle className="text-gray-800">Monthly Budget (Default Account)</CardTitle>
            <div className="flex items-center gap-2 mt-3">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-32"
                    placeholder="Enter Amount"
                    autoFocus
                    disabled={loading}
                  />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSave}
                    className="cursor-pointer"
                    disabled={loading}
                  >
                    <Check className="w-4 h-4 text-green-500" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCancel}
                    className="cursor-pointer"
                    disabled={loading}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ) : (
                <>
                  <CardDescription>
                    {budget
                      ? `${currency}${Number(expenses).toFixed(
                          2
                        )} of ${currency}${Number(budget).toFixed(2)}`
                      : "No Budget Set"}
                  </CardDescription>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="cursor-pointer"
                  >
                    <Pencil className="w-4 h-4 " />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {budget !== 0 && (
            <div className="space-y-2">
              <Progress
                value={percentageUsed}
                extraStyles={`${
                  percentageUsed >= 90
                    ? "bg-red-500"
                    : percentageUsed >= 75
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }`}
              />
              <p className="text-muted-foreground text-right text-xs">
                {Number(percentageUsed.toFixed(1))} % used
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default BudgetProgress;
