import React from "react";
import Logo from "@/lib/Logo";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { LayoutDashboard, PenBox } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="h-[10vh] px-4 md:px-10 flex justify-between items-center shadow-md">
      <div>
        <Logo />
      </div>

      <div className="flex items-center space-x-4">
        <SignedIn>
          <nav className="hidden sm:flex gap-2 items-center">
            <Link to="/dashboard">
              <Button
                variant="outline"
                className="flex items-center gap-2 cursor-pointer hover:scale-105 duration-300 ease-in-out"
              >
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link to="/transaction/create">
              <Button className="flex items-center gap-2 text-white text-sm font-normal cursor-pointer hover:scale-105 duration-300 ease-in-out">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </nav>
        </SignedIn>

        <SignedOut>
          <Link to="/sign-in">
            <Button
              variant="outline"
              className="cursor-pointer text-sm  hover:scale-105 duration-300 ease-in-out"
            >
              Login
            </Button>
          </Link>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
