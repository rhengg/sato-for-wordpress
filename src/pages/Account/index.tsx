import React from "react";
import { decodeBase64 } from "../../utils/base64";
import Cookies from "js-cookie";
import Loader from "../../components/Loader";
import axios from "../../utils/axios-instance";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import { formatDate } from "../../utils/helper";
import "../../pages/Profile/profile.css";

const AccountPage = () => {
  const navigate = useNavigate();

  const [subscription, setSubscription] = React.useState<any>();
  const user = decodeBase64(Cookies.get("s-user") as string);
  const [openModalCancel, setOpenModalCancel] = React.useState<boolean>(false);
  const [loadingMedia, setLoadingMedia] = React.useState<boolean>(false);
  const [media, setMedia] = React.useState([]);
  const [activePlan, setActivePlan] = React.useState<any>();
  const [loadingPlan, setLoadingPlan] = React.useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = React.useState<any>();
  const [paymentMethodDetails, setPaymentMethodDetails] = React.useState<any>();

  const handleCancelSubscription = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // console.log("cancel", res.data);
      setOpenModalCancel(false);
      await fetchSubscription();
    } catch (error) {
      console.log("error cancel subscription", error);
    }
  };

  const fetchSubscription = async () => {
    try {
      setLoadingPlan(true);
      const res = await axios.get(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      setSubscription(res?.data?.subscription);
      // console.log("success subscriptions fetch", res.data);
      setPaymentMethod(res?.data?.subscription?.payment_method);
      setPaymentMethodDetails(res?.data?.payment_method);

      const plans = await axios.get(`/plans/${res.data.subscription.plan_id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // const planDetails = allPlans.data.find(
      //   (item: any) => item.id === res.data.subscription.plan_id
      // );
      setActivePlan(plans.data.plan);
      setLoadingPlan(false);
    } catch (error: any) {
      console.log("error in subscription", error);
      setLoadingPlan(false);
      if (error.response.status === 401) {
        navigate({ pathname: "/signin" });
      }
    } finally {
      setLoadingPlan(false);
    }
  };

  React.useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoadingMedia(true);
      const res = await axios.get("/videos", {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
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
      <div
        style={{
          // padding: "24px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* {(subscription?.status === "pending" ||
          subscription?.status === "halted") && (
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
              justifyContent: "center",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <p className="body">
              Charge attempt towards your subscription has failed. To continue
              with this subscription, you must &nbsp;
              <Link
                to={subscription?.short_url}
                target="_blank"
                style={{
                  textDecoration: "none",
                }}
                className="primary"
              >
                update payment method
              </Link>
            </p>
          </div>
        )} */}

        {(subscription?.status as string)?.toLowerCase() === "cancelled" && (
          <div
            style={{
              // position: "absolute",
              boxSizing: "border-box",
              // top: 0,
              width: "100%",
              borderRadius: "0.25rem",
              border: "1px solid var(--stroke)",
              padding: "1rem",
              marginBottom: "2rem",
              backgroundColor: "#f5fab3ff",
              display: "flex",
              // justifyContent: "center",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <p className="body">
              Your subscription has been cancelled. To continue using Sato, you
              must&nbsp;
              <Link
                to={"/plans"}
                style={{
                  textDecoration: "none",
                }}
                className="primary"
              >
                subscribe to a plan
              </Link>
            </p>
          </div>
        )}

        {(subscription?.status as string)?.toLowerCase() === "created" && (
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
            <p className="body">
              Subscription to {activePlan?.name} was abandoned.&nbsp;
              <Link
                to={"/plans"}
                style={{
                  textDecoration: "none",
                }}
                className="primary"
              >
                Complete now
              </Link>
            </p>
          </div>
        )}

        <p className="subtitle-one">Your Profile</p>
        <div
          style={{
            marginTop: "2rem",
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
                    to={"/plans"}
                    style={{
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                    className="primary"
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
