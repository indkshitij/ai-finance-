import React, { useContext, useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
  DrawerTitle,
} from "./ui/drawer";
import { useForm } from "react-hook-form";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button.jsx";
import { accountSchema } from "../lib/formSchema.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import { toast } from "sonner";

const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { fetchAccountDetails, createAccount } = useContext(AppContext);
  const [createAccountLoading, setCreateAccountLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const onSubmit = async (formData) => {
    setCreateAccountLoading(true);
    const result = await createAccount(formData);

    if (result?.success) {
      setOpen(false);
      reset();
    }
    setCreateAccountLoading(false);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="px-2 sm:px-40 pb-10 sm:pb-5">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-semibold">
              Create New Account
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium leading-none"
                >
                  Account Name
                </label>
                <Input
                  id="name"
                  disabled={createAccountLoading}
                  placeholder="e.g., Main Checking"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="type"
                  className="text-sm font-medium leading-none"
                >
                  Account Type
                </label>
                <Select
                  onValueChange={(value) => setValue("type", value)}
                  defaultValue={watch("type")}
                  disabled={createAccountLoading}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CURRENT">Current</SelectItem>
                    <SelectItem value="SAVINGS">Savings</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-xs text-red-500">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="balance"
                  className="text-sm font-medium leading-none"
                >
                  Initial Balance
                </label>
                <Input
                  id="balance"
                  type="number"
                  step="1"
                  placeholder="0.00"
                  disabled={createAccountLoading}
                  {...register("balance")}
                />
                {errors.balance && (
                  <p className="text-xs text-red-500">
                    {errors.balance.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <label
                    htmlFor="isDefault"
                    className="text-base font-medium cursor-pointer"
                  >
                    Set as Default
                  </label>
                  <p className="text-sm text-muted-foreground">
                    This account will be selected by default for transactions
                  </p>
                </div>
                <Switch
                  id="isDefault"
                  checked={watch("isDefault")}
                  onCheckedChange={(checked) => setValue("isDefault", checked)}
                  disabled={createAccountLoading}
                />
              </div>

              <div className="flex gap-6  pt-4">
                <DrawerClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 font-normal cursor-pointer duration-300 ease-in-out "
                  >
                    Cancel
                  </Button>
                </DrawerClose>
                <Button
                  type="submit"
                  className="flex-1 font-normal cursor-pointer bg-blue-500 hover:bg-blue-600 duration-300 ease-in-out"
                  disabled={createAccountLoading}
                >
                  {createAccountLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CreateAccountDrawer;
