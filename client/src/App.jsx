import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Toaster } from "sonner";
import { useEffect, useContext } from "react";
import { AppContext } from "./context/AppContext";

// Pages
import Home from "./pages/Home";
import Transaction from "./pages/Transaction";
import Account from "./pages/Account";
import Dashboard from "./pages/Dashboard";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import PageNotFound from "./pages/PageNotFound";
import CreateTransaction from "./pages/CreateTransaction";

function App() {
  const { syncUser, logout } = useContext(AppContext);
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      console.log("Syncing user:", user);
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route
              path="/account/:accountId"
              element={!isSignedIn ? <Navigate to="/" /> : <Account />}
            />
            <Route
              path="/transaction"
              element={!isSignedIn ? <Navigate to="/" /> : <Transaction />}
            />
            <Route
              path="/transaction/create"
              element={
                !isSignedIn ? <Navigate to="/" /> : <CreateTransaction />
              }
            />
            <Route
              path="/dashboard"
              element={!isSignedIn ? <Navigate to="/" /> : <Dashboard />}
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
