import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import { AppContext } from "@/context/AppContext.jsx";
import { Switch } from "./ui/switch.jsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AccountCard = ({ account }) => {
  const { currency, changeDefaultAccount, handleDeleteAccount } =
    useContext(AppContext);
  const { name, balance, type, _id, isDefault } = account;

  return (
    <Card className="group w-full h-44 sm:h-48 md:h-52  transition-all shadow-md duration-300 transform hover:scale-[1.02] hover:shadow-xl">
      <CardHeader className="h-12 flex justify-between items-center">
        <CardTitle className="text-md font-medium truncate text-gray-800">
          {name}
        </CardTitle>
        <div className="flex jusctify-center items-center gap-3">
          <div className="hidden group-hover:block hover:scale-125 duration-300 ease-in-out ">
            <DeleteButton
              accountId={_id}
              handleDeleteAccount={handleDeleteAccount}
            />
          </div>
          <Switch
            checked={isDefault}
            onCheckedChange={() => changeDefaultAccount(_id)}
            className="cursor-pointer bg-blue-500"
          />
        </div>
      </CardHeader>

      <Link
        to={`/account/${_id}`}
        className="flex flex-col h-full mt-2 justify-between"
      >
        <CardContent className="mb-4 md:mb-0">
          <div className="">
            <div className="text-2xl font-semibold text-gray-800">
              {currency} {parseFloat(balance).toFixed(2)}
            </div>
            <p className="capitalize text-xs text-muted-foreground">
              {type.toLowerCase()} Account
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between text-muted-foreground">
          <div className="flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 mr-1 text-green-600" />
            Income
          </div>
          <div className="flex items-center text-sm">
            <ArrowDownRight className="w-4 h-4 mr-1 text-red-600" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

const DeleteButton = ({ accountId, handleDeleteAccount }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className="bg-blue-500/20  rounded cursor-pointer">
          <Trash2 className="w-7 h-7 p-1 text-blue-800" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 cursor-pointer"
            onClick={() => handleDeleteAccount(accountId)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AccountCard;
