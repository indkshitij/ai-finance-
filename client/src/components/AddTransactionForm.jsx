import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { transactionSchema } from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "./ui/switch";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";
import CreateAccountDrawer from "./CreateAccountDrawer";
import { defaultCategories } from "../lib/categories.js";

const AddTransactionForm = () => {
  const navigate = useNavigate();
  const {
    fetchAccountDetails,
    accountData,
    currency,
    formatDate,
    formatTime,
    createTransaction,
  } = useContext(AppContext);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transactionType: "EXPENSE",
      amount: "",
      description: "",
      date: new Date(),
      accountId: accountData.find((acc) => acc.isDefault)?._id || "",
      category: "",
      // receiptUrl: "",
      isRecurring: false,
      recurringInterval: "MONTHLY",
    },
  });

  const isRecurring = watch("isRecurring");
  const date = watch("date");
  const transactionType = watch("transactionType");
  const filteredCategory = defaultCategories.filter(
    (category) => category.type === transactionType
  );

  // description popover
  const [open, setOpen] = useState(false);
  const [addTransactionLoading, setAddTransactionLoading] = useState(false);

  const onSubmit = async (formData) => {
    const formatData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };
    setAddTransactionLoading(true);
    const result = await createTransaction(formData);
    if (result.success) {
      reset();
      navigate(-1);
    }
    setAddTransactionLoading(false);
  };

  useEffect(() => {
    fetchAccountDetails();
  }, []);

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {/* Transaction Type */}
        <div className="space-y-2">
          <label className="text-xs font-medium">Transaction Type</label>
          <Select
            disabled={addTransactionLoading}
            onValueChange={(value) => setValue("transactionType", value)}
            defaultValue={transactionType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Transaction type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXPENSE">Expense</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
            </SelectContent>
          </Select>
          {errors.transactionType && (
            <p className="text-red-500 text-xs">
              {errors.transactionType.message}
            </p>
          )}
        </div>

        {/* Amount & Account */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-medium">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base">
                {currency}
              </span>
              <Input
                disabled={addTransactionLoading}
                className="pl-8"
                type="number"
                step="0.01"
                {...register("amount")}
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Account</label>
            <Select
              onValueChange={(value) => setValue("accountId", value)}
              defaultValue={getValues("accountId")}
              disabled={addTransactionLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                {accountData?.map((acc) => (
                  <SelectItem key={acc._id} value={acc._id}>
                    <div className="flex flex-col">
                      <span className="font-medium text-left">{acc.name}</span>
                      <span className="text-xs text-muted-foreground text-left">
                        Balance: ₹{acc.balance.toFixed(2)}{" "}
                        {acc.isDefault && "[Default]"}
                      </span>
                    </div>
                  </SelectItem>
                ))}
                <CreateAccountDrawer>
                  <Button variant="outline" className="w-full mt-2">
                    Create New Account
                  </Button>
                </CreateAccountDrawer>
              </SelectContent>
            </Select>
            {errors.accountId && (
              <p className="text-red-500 text-xs">{errors.accountId.message}</p>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="space-y-1 flex flex-col gap-0">
          <label className="text-xs font-medium">Date</label>
          <Popover className="w-full" disabled={addTransactionLoading}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {date ? (
                  `${formatDate(date)}, ${formatTime(date)}`
                ) : (
                  <span className="">Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => setValue("date", date)}
                className="rounded-md"
                disabled={(date) =>
                  date > new Date() || date < new Date("1990-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {errors.date && (
            <p className="text-red-500 text-xs">{errors.date.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-xs font-medium">Category</label>
          <Popover
            open={open}
            onOpenChange={setOpen}
            disabled={addTransactionLoading}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="font-normal w-full justify-between"
              >
                {watch("category")
                  ? filteredCategory.find(
                      (cat) => cat.name === watch("category")
                    )?.name
                  : "Select Category"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command className="w-full">
                <CommandInput placeholder="Search category..." />
                <CommandList>
                  <CommandEmpty className="p-2">
                    No category found.
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredCategory.map((category, index) => (
                      <CommandItem
                        key={index}
                        value={category.name}
                        onSelect={() => {
                          setValue("category", category.name);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            watch("category") === category.name
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {category.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {errors.category && (
            <p className="text-red-500 text-xs">{errors.category.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-medium">Description</label>
          <Input
            {...register("description")}
            placeholder="Description"
            disabled={addTransactionLoading}
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        {/* isRecurring */}
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <label
                htmlFor="isDefault"
                className="text-base font-medium cursor-pointer"
              >
                Reccuring transaction
              </label>
              <p className="text-sm text-muted-foreground">
                setup a reccuring schedule for this transaction
              </p>
            </div>
            <Switch
              id="isRecurring"
              checked={isRecurring}
              onCheckedChange={(checked) => setValue("isRecurring", checked)}
              disabled={addTransactionLoading}
            />
          </div>
        </div>

        {isRecurring && (
          <div className="space-y-2">
            <label className="text-xs font-medium">Recurrence Interval</label>
            <Select
              onValueChange={(value) => setValue("recurringInterval", value)}
              defaultValue={getValues("recurringInterval")}
              disabled={addTransactionLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Recurrence Interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {errors.recurringInterval && (
              <p className="text-red-500 text-xs">
                {errors.recurringInterval.message}
              </p>
            )}
          </div>
        )}
        {/* Submit Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
          <Button
            variant="outline"
            onClick={() => {
              navigate(-1);
            }}
            className="w-full sm:w-auto cursor-pointer hover:scale-[1.02] duration-300"
            disabled={addTransactionLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={addTransactionLoading}
            className="w-full sm:w-auto cursor-pointer hover:scale-[1.02] duration-300"
          >
            {addTransactionLoading ? "Adding..." : "Add Transaction"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddTransactionForm;
