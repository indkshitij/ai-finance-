import React, { useContext, useEffect } from "react";
import CreateAccountDrawer from "./CreateAccountDrawer.jsx";
import { Card, CardContent } from "./ui/card.jsx";
import { PlusIcon } from "lucide-react";
import AccountCard from "./AccountCard.jsx";
import { AppContext } from "@/context/AppContext.jsx";

const AccountGrid = () => {
  const { fetchAccountDetails, accountData } = useContext(AppContext);

  useEffect(() => {
    fetchAccountDetails();
  }, [accountData]);
  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
          <CreateAccountDrawer>
            <Card className="w-full h-44 sm:h-48 md:h-52 transition-all shadow-md duration-300 transform hover:scale-[1.02] hover:shadow-xl cursor-pointer flex justify-center items-center">
              <CardContent className="flex flex-col justify-center items-center p-5 text-gray-500">
                <PlusIcon className="w-10 h-10 mb-2" />
                <p className="">Add New Account</p>
              </CardContent>
            </Card>
          </CreateAccountDrawer>

          {accountData.map((account, index) => (
            <AccountCard key={index} account={account} />
          ))}
        </div>
      </section>
    </>
  );
};

export default AccountGrid;
