import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import error404grphic from "@/assets/error/error404.json";
import Lottie from "lottie-react";

const PageNotFound = () => {
  document.title = "Error 404 | NeoFinance";
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-radial from-blue-600 via-white to-blue-600 bg-[length:200%_200%] overflow-hidden px-4">
      {/* Floating Blur Shapes */}
      <div className="absolute w-[600px] h-[500px] bg-blue-600 opacity-30 rounded-full blur-3xl -top-40 left-[-250px] animate-pulse-slow z-0" />
      <div className="absolute w-[400px] h-[400px] bg-blue-600 opacity-30 rounded-full blur-3xl -bottom-40 right-[-250px] animate-pulse-slow z-0" />

      <div
        className="relative z-10 w-full flex flex-col items-center text-center"
       
      >
        <div className="w-full max-w-sm mb-6">
          <Lottie
            animationData={error404grphic}
            loop
            autoplay
            className="w-full h-auto"
          />
        </div>

        <p className="text-blue-600 font-semibold uppercase text-sm mb-2 tracking-wider">
          Error 404: Page Not Found
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-3 tracking-tight">
          Lost in the Ledger...
        </h1>

        <p className="text-xs sm:text-base md:text-lg text-gray-600 max-w-lg mb-8">
          Oops! The page you're looking for doesn't exist, or maybe it’s been
          rebalanced into another corner of our system. Let’s get you back on
          track!
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Button
            onClick={() => navigate(-1)}
            className="cursor-pointer bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 transition duration-300 shadow-md hover:scale-105 hover:shadow-xl"
          >
            <ArrowLeft className="mr-2" />
            Take Me Back
          </Button>

          <SignedIn>
            <Link to="/dashboard" className="group">
              <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 transition duration-300 text-white shadow-md group-hover:scale-105 group-hover:shadow-xl">
                Go to Dashboard <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <Link to="/" className="group">
              <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 transition duration-300 text-white shadow-md group-hover:scale-105 group-hover:shadow-xl">
                Return to Home <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
