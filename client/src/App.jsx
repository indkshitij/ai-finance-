import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Toaster } from "sonner";
import { lazy, Suspense, useEffect, useContext } from "react";

import { AppContext } from "./context/AppContext";

// Pages
const Home = lazy(() => import("./pages/Home"));
const Account = lazy(() => import("./pages/Account"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SignInPage = lazy(() => import("./pages/SignInPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const CreateTransaction = lazy(() => import("./pages/CreateTransaction"));
const UpdateTransaction = lazy(() => import("./pages/UpdateTransaction"));

function App() {
  const { syncUser, logout } = useContext(AppContext);
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      syncUser(user);
    } else if (!isSignedIn) {
      console.log("No user found or signed out. Logging out.");
      logout();
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  return (
    <>
      <div className="">
        <Router>
          <Toaster richColors />
          <Suspense
            fallback={
              <div className="text-center h-screen flex justify-center items-center text-4xl font-semibold gradient-title ">
                Loading...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route
                path="/account/:accountId"
                element={!isSignedIn ? <Navigate to="/" /> : <Account />}
              />

              <Route
                path="/transaction/create"
                element={
                  !isSignedIn ? <Navigate to="/" /> : <CreateTransaction />
                }
              />
              <Route
                path="/transaction/update/:transactionId"
                element={
                  !isSignedIn ? <Navigate to="/" /> : <UpdateTransaction />
                }
              />
              <Route
                path="/dashboard"
                element={!isSignedIn ? <Navigate to="/" /> : <Dashboard />}
              />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </div>
    </>
  );
}

export default App;
