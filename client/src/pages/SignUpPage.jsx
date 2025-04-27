import React from "react";
import { SignUp } from "@clerk/clerk-react";
import Lottie from "lottie-react";
import SignUpLottie from "../assets/SignUp.json";

const SignUpPage = () => {
  document.title = "Sign Up | NeoFinance";
  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-radial from-blue-600 via-white to-blue-600 bg-[length:200%_200%] overflow-hidden px-4 py-5 sm:py-0">
        {/* Floating Blur Shapes */}
        <div className="absolute w-[600px] h-[500px] bg-blue-600 opacity-30 rounded-full blur-3xl -top-40 left-[-250px] animate-pulse-slow z-0" />
        <div className="absolute w-[400px] h-[400px] bg-blue-600 opacity-30 rounded-full blur-3xl -bottom-40 right-[-250px] animate-pulse-slow z-0" />

        <div className="h-screen flex justify-center items-center w-full flex-col sm:flex-row">
          <div className="relative flex justify-center items-center sm:w-1/2 w-full py-8 sm:py-0">
            <Lottie
              animationData={SignUpLottie}
              loop
              autoplay
              className="absolute right-12 w-[80%] h-auto max-w-[520px]"
            />
          </div>

          <div className="h-full flex justify-center items-center sm:w-1/2 w-full py-8 sm:py-0">
            <SignUp
              path="/sign-up"
              routing="path"
              signInUrl="/sign-in"
              afterSignInUrl="/dashboard"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
