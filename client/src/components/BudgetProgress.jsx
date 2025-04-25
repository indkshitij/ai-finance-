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
import { toast } from "sonner";

const BudgetProgress = () => {
  const { backendUrl, currency, fetchBudget, budget, expenses } =
    useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState("");
  const [recurrence, setRecurrence] = useState(budget?.recurrence || "MONTHLY");
  const [loading, setLoading] = useState(false);

  // Function to update budget
  const handleUpdateBudget = async (budget, newBudget, recurrence) => {
    const updatedBudget = {
      ...budget,
      amount: parseFloat(newBudget),
      recurrence,
    };
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/budget/setup`,
        updatedBudget,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message || "Budget updated successfully!");
        return { success: true };
      } else {
        toast.error(data.message || "Failed to update budget.");
        return { success: false };
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      const serverMessage = error?.response?.data?.message;
      const finalMessage =
        serverMessage || error?.message || "An unexpected error occurred.";
      toast.error(finalMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewBudget(budget?.toString() || "");
    setIsEditing(false);
  };

  const percentageUsed = budget && budget > 0 ? (expenses / budget) * 100 : 0;

  // useEffect(() => {
  //   setNewBudget(budget?.toString() || "");
  // }, [budget]);

  useEffect(() => {
    fetchBudget();
  }, [handleUpdateBudget]);
  return (
    <section className="">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex-1">
            <CardTitle>Monthly Budget (Default Account)</CardTitle>
            <div className="flex items-center gap-2 mt-3">
              {isEditing ? (
                <div className="flex items-center gap-2 ">
                  <Input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-32"
                    placeholder="Enter Amount"
                    autoFocus
                    disabled={loading}
                  />
                  <Select
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                      <SelectItem value="NONE">None</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateBudget()}
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
                    : "bg-green-500"
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
