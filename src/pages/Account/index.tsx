import React from "react";
import Loader from "../../components/Loader";
import axios from "../../utils/axios-instance";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import { formatDate } from "../../utils/helper";
import "../../pages/Profile/profile.css";
import Invoices from "../Invoices";
import DetailMenu from "../../components/DetailMenu";
import config from "../../config";

const AccountPage = ({ token }: { token: string }) => {
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = React.useState("US");
  const [subscription, setSubscription] = React.useState<any>();
  const [user, setUser] = React.useState<any>();
  const [openModalCancel, setOpenModalCancel] = React.useState<boolean>(false);
  const [loadingMedia, setLoadingMedia] = React.useState<boolean>(false);
  const [media, setMedia] = React.useState([]);
  const [activePlan, setActivePlan] = React.useState<any>();

  const fetchUserDetail = async () => {
    try {
      const res = await axios.get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (error) {
      console.log("error fetching user detail", error);
    }
  };

  const handleCancelSubscription = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await axios.delete(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOpenModalCancel(false);
      await fetchSubscription();
    } catch (error) {
      console.log("error cancel subscription", error);
    }
  };

  const fetchSubscription = async () => {
    try {
      const res = await axios.get(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubscription(res?.data?.subscription);

      const plans = await axios.get(`/plans/${res.data.subscription.plan_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActivePlan(plans.data.plan);
    } catch (error: any) {
      console.log("error in subscription", error);
      if (error.response.status === 401) {
        navigate({ pathname: "/signin" });
      }
    }
  };

  React.useEffect(() => {
    fetchSubscription();
    fetchUserDetail();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoadingMedia(true);
      const res = await axios.get("/videos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMedia(res.data);
    } catch (error: any) {
      console.log("error fetching media", error);
      setLoadingMedia(false);
      if (error.response.status === 401) {
        navigate({ pathname: "/signin" });
      }
    } finally {
      setLoadingMedia(false);
    }
  };

  React.useEffect(() => {
    fetchMedia();
    axios
      .get(config.IP_API)
      .then((response) => {
        const code = response?.data?.countryCode?.toUpperCase();
        if (code) {
          setCountryCode(code);
        }
      })
      .catch((error) => {
        console.error("Error fetching country:", error);
      });
  }, []);

  if (!user || loadingMedia)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader
          height="64px"
          width="64px"
          borderColor="#f0f0f0"
          borderBottom="#000000"
        />
      </div>
    );

  return (
    <>
      <DetailMenu />

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {(subscription?.status as string)?.toLowerCase() === "cancelled" ||
          ((subscription?.status as string)?.toLowerCase() === "created" && (
            <div
              style={{
                boxSizing: "border-box",
                width: "100%",
                borderRadius: "0.25rem",
                border: "1px solid var(--stroke)",
                padding: "1rem",
                marginBottom: "2rem",
                backgroundColor: "#f5fab3ff",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              {(subscription?.status as string)?.toLowerCase() ===
                "cancelled" && (
                <p className="body">
                  Your subscription has been cancelled. To continue using Sato,
                  you must&nbsp;
                  <Link
                    to={`https://app.satoplayer.com/plans/${countryCode}`}
                    style={{
                      textDecoration: "none",
                    }}
                    target="_blank"
                    className="sato-link"
                  >
                    subscribe to a plan
                  </Link>
                </p>
              )}
              {(subscription?.status as string)?.toLowerCase() ===
                "created" && (
                <p className="body">
                  Subscription to {activePlan?.name} was abandoned.&nbsp;
                  <Link
                    to={`https://app.satoplayer.com/plans/${countryCode}`}
                    style={{
                      textDecoration: "none",
                    }}
                    target="_blank"
                    className="sato-link"
                  >
                    Complete now
                  </Link>
                </p>
              )}
            </div>
          ))}

        <p className="subtitle-two">Your Profile</p>
        <div
          style={{
            marginTop: "0.5rem",
          }}
        >
          <div className="profile-box">
            <div>
              <p className="label textSecondary">Name</p>
              <p className="body" style={{ marginTop: "0.5rem" }}>
                {user.name}
              </p>
            </div>
            <div>
              <p className="label textSecondary">Email</p>
              <p className="body" style={{ marginTop: "0.5rem" }}>
                {user.email}
              </p>
            </div>
            <div>
              <p className="label textSecondary">Uploaded Videos</p>
              <p className="body" style={{ marginTop: "0.5rem" }}>
                {loadingMedia ? <Loader /> : media.length}
              </p>
            </div>
            <div>
              <p className="label textSecondary">
                Subscription:{" "}
                <span
                  className={
                    (subscription?.status as string)?.toLowerCase() === "active"
                      ? "positive"
                      : "negative"
                  }
                  style={{ display: "inline-block" }}
                >
                  {subscription &&
                  subscription?.status?.toUpperCase() !== "APPROVAL_PENDING"
                    ? subscription.status.charAt(0).toUpperCase() +
                      subscription.status.slice(1)
                    : "--"}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "5px",
                    height: "5px",
                    margin: "0 0.5rem",
                    borderRadius: "50%",
                    backgroundColor: "var(--textSecondary)",
                  }}
                ></span>
                <span className="primary" style={{ cursor: "pointer" }}>
                  <Link
                    to={`https://app.satoplayer.com/plans/${countryCode}`}
                    style={{
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                    target="_blank"
                    className="sato-link"
                  >
                    Change Plan
                  </Link>
                </span>
              </p>
              {loadingMedia ? (
                <Loader />
              ) : activePlan &&
                (subscription?.status as string)?.toLowerCase() !==
                  "approval_pending" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <p className="body" style={{ marginTop: "0.5rem" }}>
                    {activePlan?.name} {activePlan?.currency}{" "}
                    {activePlan?.amount / 100}/{activePlan?.period.slice(0, -2)}
                  </p>
                  {activePlan?.currency?.toLowerCase() === "usd" &&
                    (subscription?.status as string)?.toLowerCase() !==
                      "cancelled" &&
                    (subscription?.status as string)?.toLowerCase() !==
                      "approval_pending" && (
                      <button
                        className="notnow-btn"
                        style={{ marginTop: "0.5rem" }}
                        onClick={() => {
                          setOpenModalCancel(true);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                </div>
              ) : (
                <p className="body" style={{ marginTop: "0.5rem" }}>
                  No Active Plan
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {subscription && activePlan?.amount > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <p className="subtitle-two">Your Subscription Details</p>
              <div className="profile-box" style={{ marginBottom: "2rem" }}>
                <div>
                  <p className="label textSecondary">Billing Cycle</p>
                  <p className="body" style={{ marginTop: "0.5rem" }}>
                    {formatDate(subscription.current_start)}&nbsp;-&nbsp;
                    {formatDate(subscription.current_end)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: "2rem" }}>
            <Invoices />
          </div>
        </div>

        <Modal
          isOpen={openModalCancel}
          setOpen={setOpenModalCancel}
          title={`Are you sure?`}
          size="sm"
        >
          <p className="body">
            If you continue, your active subscription will be cancelled at the
            end of billing cycle.
          </p>
          <form onSubmit={handleCancelSubscription}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setOpenModalCancel(false);
                }}
                className="large-primary-btn"
                style={{
                  width: "100%",
                  margin: "2rem 0 0 0",
                }}
              >
                No
              </button>

              <button
                type="submit"
                className="large-danger-btn"
                style={{
                  width: "100%",
                  margin: "2rem 0 0 0",
                }}
              >
                Yes
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default AccountPage;
