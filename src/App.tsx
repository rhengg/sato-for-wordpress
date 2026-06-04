import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import HomeLayout from "./layout/home";
import Detail from "./pages/Detail";
import Login from "./pages/Auth/Login";
import Auth from "./pages/Auth";
import NotFound from "./pages/404";
import Cookies from "js-cookie";
import Register from "./pages/Auth/register";
import Profile from "./pages/Profile";
import Plans from "./pages/Plans";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Razorpay from "./pages/Razorpay";
import MediaLibrary from "./pages/MediaLibrary";
import Success from "./pages/Razorpay/success";
import Failed from "./pages/Razorpay/failed";
import AccountRecovery from "./pages/Auth/AccountRecovery";
import Players from "./pages/Players";
import Error500 from "./pages/500";
import Invoices from "./pages/Invoices";
import WebflowConfirmation from "./pages/WebflowConfirmation";
import PlansById from "./pages/PlansById";
import CanvaAuth from "./pages/CanvaAuth";
import ProfileLayout from "./layout/ProfileLayout";
import AccountPage from "./pages/Account";
import BillingPage from "./pages/Billing";
import SecurityPrivacyPage from "./pages/SecurityPrivacy";
import PlansLoader from "./pages/PlanLoader";
import Paypal from "./pages/Paypal";
import React from "react";
import Oauth from "./pages/Oauth";

const App = () => {
  // returns true if the cookie is present, otherwise returns false
  const isUserAuthenticated = () => {
    const cookie = Cookies.get("s-token");
    if (cookie) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <LandingTracker>
      <Routes>
        <Route
          path="/callback/wb-plugin"
          element={<WebflowConfirmation />}
        ></Route>
        <Route path="/not-found" element={<NotFound />} />

        {!isUserAuthenticated() && (
          <>
            <Route element={<Auth />}>
              <Route path="/signin" element={<Login />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/canva-auth" element={<CanvaAuth />}></Route>
              <Route
                path="/account-recovery"
                element={<AccountRecovery />}
              ></Route>
              <Route
                path="/forgot-password"
                element={<ForgotPassword />}
              ></Route>
              <Route path="*" element={<Navigate to="/signin" />} />
            </Route>
            <Route path="/plans" element={<PlansLoader />} />
            <Route path="/plans/:country" element={<Plans />}></Route>
            <Route path="/custom-plans" element={<PlansById />}></Route>
          </>
        )}

        {isUserAuthenticated() && (
          <>
            <Route element={<HomeLayout />}>
              <Route path="/" element={<Home />}></Route>
              {/* <Route path="/profile" element={<Profile />}></Route> */}
              <Route path="/oauth/authorize" element={<Oauth />}></Route>
              <Route path="/plans" element={<PlansLoader />} />
              <Route path="/plans/:country" element={<Plans />}></Route>
              <Route path="/custom-plans" element={<PlansById />}></Route>
              <Route path="/checkout/IN" element={<Razorpay />}></Route>
              <Route path="/checkout/:country" element={<Paypal />}></Route>
              <Route path="/payment-success" element={<Success />}></Route>
              <Route path="/payment-failed" element={<Failed />}></Route>
              <Route path="/video-library" element={<MediaLibrary />}></Route>
              <Route path="/all-players" element={<Players />}></Route>
              {/* <Route path="/invoices" element={<Invoices />}></Route> */}
              <Route path="*" element={<NotFound />} />
              <Route path="/500" element={<Error500 />} />

              <Route element={<ProfileLayout />}>
                <Route path="/profile" element={<AccountPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/security" element={<SecurityPrivacyPage />} />
              </Route>
            </Route>
            <Route path="/detail" element={<Detail />}></Route>
          </>
        )}
      </Routes>
    </LandingTracker>
  );
};

export default App;

const LandingTracker: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("global")) {
      sessionStorage.setItem(
        "from-landing-page",
        JSON.stringify({
          planId: params.get("planId"),
        }),
      );
    }
    if (params.get("client_id") && params.get("state")) {
      sessionStorage.setItem(
        "o-auth",
        JSON.stringify({
          url: location,
        }),
      );
    }
  }, [location.search]);

  return <>{children}</>;
};
