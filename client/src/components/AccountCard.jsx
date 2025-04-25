import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AppContext } from "@/context/AppContext.jsx";
import { Switch } from "./ui/switch.jsx";

const AccountCard = ({ account }) => {
  const { currency, changeDefaultAccount } = useContext(AppContext);
  const { name, balance, type, _id, isDefault } = account;

  return (
    <Card className="w-full h-52  transition-all shadow-md duration-300 transform hover:scale-[1.02] hover:shadow-xl">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-md font-medium truncate">{name}</CardTitle>
        <Switch
          checked={isDefault}
          onCheckedChange={() => changeDefaultAccount(_id)}
          className="cursor-pointer"
        />
      </CardHeader>

      <Link
        to={`/account/${_id}`}
        className="flex flex-col h-full mt-2 justify-between"
      >
        <CardContent>
          <div className="text-2xl font-medium">
            {currency} {parseFloat(balance).toFixed(2)}
          </div>
          <p className="capitalize text-xs text-muted-foreground">
            {type.toLowerCase()} Account
          </p>
        </CardContent>

        <CardFooter className="flex justify-between text-muted-foreground ">
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

export default AccountCard;
