import React, { useEffect, useRef } from "react";
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
  const header = useRef();

  return (
    <header
      ref={header}
      className="w-full h-[10vh] bg-white z-50 px-4 md:px-10 flex justify-between items-center shadow-md "
    >
      <div>
        <Logo />
      </div>

      <div className="hidden md:flex items-center space-x-8">
        <SignedOut>
          <a
            href="#features"
            className="text-gray-600 hover:text-blue-600 font-normal"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-gray-600 hover:text-blue-600 font-normal"
          >
            Testimonials
          </a>
        </SignedOut>
      </div>

      <div className="flex items-center space-x-4">
        <SignedIn>
          <nav className="flex gap-2 items-center">
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
              <Button className="flex items-center gap-2 text-white text-sm font-normal cursor-pointer bg-blue-500 hover:bg-blue-600 hover:scale-105 duration-300 ease-in-out">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </nav>
        </SignedIn>

        <SignedOut>
          <nav className="flex gap-2 items-center">
            <Link to="/sign-up">
              <Button
                variant="outline"
                className="cursor-pointer text-sm  hover:scale-105 duration-300 ease-in-out"
              >
                Sign Up
              </Button>
            </Link>
            <Link to="/sign-in">
              <Button className="cursor-pointer text-sm bg-blue-500 hover:bg-blue-600 hover:scale-105 duration-300 ease-in-out">
                Sign In
              </Button>
            </Link>
          </nav>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
