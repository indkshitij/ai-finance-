import React from "react";
import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  document.title = "Sign Up | NeoFinance"
  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-900 p-4">
        <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
      </div>
    </>
  );
};

export default SignUpPage;
