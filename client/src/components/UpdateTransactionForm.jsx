import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { transactionSchema } from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Check, ChevronsUpDown, CalendarIcon } from "lucide-react";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "./ui/input";
import CreateAccountDrawer from "./CreateAccountDrawer";
import { defaultCategories } from "../lib/categories.js";
import ReceiptScanner from "./ReceiptScanner";

const UpdateTransactionForm = ({ accountData }) => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const {
    currency,
    formatDate,
    formatTime,
    updateTransaction,
    fetchAccountDetails,
    fetchTransactionDataUsingId,
  } = useContext(AppContext);
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    (async () => {
      await fetchAccountDetails();

      const transaction = await fetchTransactionDataUsingId(transactionId);
      if (transaction?.success) {
        setTransactionDetails(transaction.data);
      }
    })();
  }, [transactionId]);

  // form and default values
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
  });

  useEffect(() => {
    (async () => {
      await fetchAccountDetails();
      const transaction = await fetchTransactionDataUsingId(transactionId);
      if (transaction?.success) {
        setTransactionDetails(transaction.data);

        // Reset form values after data is loaded
        reset({
          transactionType: transaction?.data?.transactionType || "",
          amount: transaction?.data.amount?.toString() || "",
          description: transaction?.data.description?.toString() || "",
          date: transaction?.data?.date?.toString() || "",
          accountId: transaction?.data?.accountId?.toString() || "",
          category: transaction?.data?.category?.toString() || "",
          isRecurring: transaction?.data?.isRecurring || false,
          recurringInterval: transaction?.data?.isRecurring
            ? transaction?.data?.recurringInterval || ""
            : "",
        });
      }
    })();
  }, [transactionId, reset]);

  const watchedAmount = watch("amount");
  const datee = watch("date");
  const selectedAcc = watch("accountId");
  const isRecurring = watch("isRecurring");
  const transactionType = watch("transactionType");
  const filteredCategory = defaultCategories.filter(
    (category) => category.type === transactionType
  );
  // Category popover
  const [open, setOpen] = useState(false);
  const [updateTransactionLoading, setUpdateTransactionLoading] =
    useState(false);

  // handle form submit
  const onSubmit = async (formData) => {
    setUpdateTransactionLoading(true);
    const formatData = {
      ...formData,
      amount: parseFloat(formData?.amount),
    };

    let result = await updateTransaction(formatData, transactionDetails._id);
    if (result.success) {
      reset();
      navigate(-1);
    }
    setUpdateTransactionLoading(false);
  };

  // time Picker
  const [date, setDate] = useState(datee);
  const [isOpen, setIsOpen] = useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setValue("date", selectedDate);
    }
  };

  // handle time change
  const handleTimeChange = (type, value) => {
    if (date) {
      const newDate = new Date(date);
      const currentHours = newDate.getHours();

      if (type === "hour") {
        const hourValue = parseInt(value);
        const isPM = currentHours >= 12;
        newDate.setHours(isPM ? (hourValue % 12) + 12 : hourValue % 12);
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      } else if (type === "ampm") {
        if (value === "AM" && currentHours >= 12) {
          newDate.setHours(currentHours - 12);
        } else if (value === "PM" && currentHours < 12) {
          newDate.setHours(currentHours + 12);
        }
      }

      setDate(newDate);

      setValue("date", newDate);
    }
  };

  // for seeting values scanned from AI response
  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      const stringfyAmount = scannedData?.amount?.toString();
      setValue("amount", stringfyAmount);
      if (scannedData) {
        setDate(scannedData.date);
      }
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
    }
  };

  const selectedAccountName = accountData?.find(
    (acc) => acc._id == selectedAcc
  )?.name;
  
  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2 sm:space-y-4">
        {/* Receipt Scanner */}
        <div className="space-y-2">
          <ReceiptScanner onScanComplete={handleScanComplete} />
        </div>
        {/* Transaction Type */}
        <div className="space-y-0">
          <label className="text-xs font-medium">Transaction Type</label>
          <Select
            disabled={updateTransactionLoading}
            onValueChange={(value) => setValue("transactionType", value)}
            value={transactionType}
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
          <div className="space-y-0">
            <label className="text-xs font-medium">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base">
                {currency}
              </span>
              <Input
                {...register("amount")}
                disabled={updateTransactionLoading}
                className="pl-8"
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-0">
            <label className="text-xs font-medium">Account</label>
            <Select
              onValueChange={(value) => setValue("accountId", value)}
              defaultValue={getValues("accountId")}
              disabled={true}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={selectedAccountName}>
                  {accountData?.find((acc) => acc._id === selectedAcc?.name)}
                </SelectValue>
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
        <div className="space-y-0 ">
          <label className="text-xs font-medium">Date</label>
          <Popover
            open={isOpen}
            onOpenChange={setIsOpen}
            disabled={updateTransactionLoading}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />

                {datee ? (
                  <span className="text-sm text-black">
                    {formatDate(datee)}, {formatTime(datee)}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Pick a date & time
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="sm:flex">
                <Calendar
                  mode="single"
                  selected={datee}
                  onSelect={handleDateSelect}
                  initialFocus
                />
                <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {hours.map((hour) => (
                        <Button
                          key={hour}
                          size="icon"
                          className={`sm:w-full shrink-0 aspect-square ${
                            datee &&
                            datee instanceof Date &&
                            !isNaN(datee.getHours()) &&
                            datee.getHours() % 12 === hour % 12
                              ? "bg-blue-500 hover:bg-blue-600  text-white"
                              : "text-black bg-white hover:bg-gray-100"
                          }`}
                          onClick={() =>
                            handleTimeChange("hour", hour.toString())
                          }
                        >
                          {hour}
                        </Button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                        <Button
                          key={minute}
                          size="icon"
                          className={`sm:w-full shrink-0 aspect-square ${
                            datee &&
                            datee instanceof Date &&
                            !isNaN(datee.getMinutes()) &&
                            datee.getMinutes() === minute
                              ? "bg-blue-500 hover:bg-blue-600  text-white"
                              : "text-black bg-white hover:bg-gray-100"
                          }`}
                          onClick={() =>
                            handleTimeChange("minute", minute.toString())
                          }
                        >
                          {minute}
                        </Button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="">
                    <div className="flex sm:flex-col p-2">
                      {["AM", "PM"].map((ampm) => (
                        <Button
                          key={ampm}
                          size="icon"
                          className={`sm:w-full shrink-0 aspect-square ${
                            datee instanceof Date &&
                            !isNaN(datee.getHours()) &&
                            ((ampm === "AM" && datee.getHours() < 12) ||
                              (ampm === "PM" && datee.getHours() >= 12))
                              ? "bg-blue-500 hover:bg-blue-600  text-white"
                              : "text-black bg-white hover:bg-gray-100"
                          }`}
                          onClick={() => handleTimeChange("ampm", ampm)}
                        >
                          {ampm}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {errors.date && (
            <p className="text-red-500 text-xs">{errors.date.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-0">
          <label className="text-xs font-medium">Category</label>
          <Popover
            open={open}
            onOpenChange={setOpen}
            disabled={updateTransactionLoading}
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
            <PopoverContent align="start">
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
        <div className="space-y-0">
          <label className="text-xs font-medium">Description</label>
          <Input
            {...register("description")}
            placeholder="Description"
            disabled={updateTransactionLoading}
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        {/* isRecurring */}
        <div className="space-y-0">
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
              disabled={updateTransactionLoading}
            />
          </div>
        </div>

        {isRecurring && (
          <div className="space-y-0">
            <label className="text-xs font-medium">Recurrence Interval</label>
            <Select
              onValueChange={(value) => setValue("recurringInterval", value)}
              defaultValue={getValues("recurringInterval")}
              disabled={updateTransactionLoading}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 lg:gap-5 mt-5">
          <Button
            variant="outline"
            onClick={() => {
              navigate(-1);
            }}
            className="w-full sm:w-auto cursor-pointer hover:scale-[1.02] duration-300"
            disabled={updateTransactionLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateTransactionLoading}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 cursor-pointer hover:scale-[1.02] duration-300"
          >
            {updateTransactionLoading ? "Updating..." : "Update Transaction"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateTransactionForm;
