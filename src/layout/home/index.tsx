import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import navigation from "../../database/navigation.json";
import Cookies from "js-cookie";
import packagejson from "../../../package.json";
import axios from "../../utils/axios-instance";

/**
 * This layout returns two spaces divided horizontally.
 * Navigation component is used which will render the topbar in top space.
 * Dynamic pages (i.e list view page and detail page) will be rendered in bottom space.
 */
const Index = () => {
  // const navigator = useNavigate()
  const { pathname } = useLocation();

  return (
    <Hello>
      <div className="home-layout-body">
        <div className="right-home-outlet">
          <Outlet />
        </div>
      </div>
    </Hello>
  );
};

export default Index;

const Hello = ({ children }: { children: React.ReactNode }) => {
  const [activePlan, setActivePlan] = React.useState<any>();
  const [session, setSession] = React.useState<any>();
  const [refetch, setRefetch] = React.useState<any>();
  const navigate = useNavigate();

  const fetchSubscription = async () => {
    try {
      const res = await axios.get(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // console.log("success subscriptions fetch", res.data);

      const plans = await axios.get(`/plans/${res.data.subscription.plan_id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // console.log("plan details", plans?.data);
      setActivePlan(plans.data?.plan);
      const storedToken = sessionStorage.getItem("s-upgrade");
      setSession(storedToken);
    } catch (error: any) {
      console.log("error in subscription", error);
    }
  };

  React.useEffect(() => {
    fetchSubscription();
  }, []);

  React.useEffect(() => {
    const storedToken = sessionStorage.getItem("s-upgrade");
    setSession(storedToken);
    renderContent();
  }, [refetch]);

  const renderContent = () => activePlan?.amount === 0 && session !== "not-now";

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {renderContent() && (
        <div className="upgrade-container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <span
              className="material-symbols-outlined white"
              style={{
                fontWeight: "bold",
              }}
            >
              award_star
            </span>
            <p
              className="body white"
              style={{
                fontFamily: "Satoshi-Bold",
              }}
            >
              Want to upload unlimited videos without size restrictions?
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <button
              className="upgrade-plan-btn"
              onClick={() => {
                navigate("/plans");
              }}
            >
              Upgrade
            </button>

            <button
              className="notnow-btn"
              onClick={() => {
                sessionStorage.setItem("s-upgrade", "not-now");
                setRefetch(Math.random());
              }}
            >
              Not now
            </button>
          </div>
        </div>
      )}
      <Navigation />

      <div className="information-container">
        <p
          className="body white"
          style={{
            fontFamily: "Satoshi-Bold",
          }}
        >
          You are now on the latest version of Sato Player. &nbsp;
          <Link
            to={
              "https://www.satoplayer.com/blog/sato-player-2-0-fresh-themes-in-video-ctas-and-a-smoother-checkout-experience"
            }
            target="_blank"
            style={{
              fontWeight: "bold",
              // textDecoration: "none",
            }}
            className=" white"
          >
            See what's new
          </Link>
        </p>
      </div>
      <main>{children}</main>
    </div>
  );
};
