import React from "react";
import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  document.title = "Sign In | NeoFinance"
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-900 p-4">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
};

export default SignInPage;
