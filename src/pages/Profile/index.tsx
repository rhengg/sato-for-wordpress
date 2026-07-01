import React, { SyntheticEvent } from "react";
import "./profile.css";
import Modal from "../../components/Modal";
import Cookies from "js-cookie";
import { decodeBase64 } from "../../utils/base64";
import TwoFA from "../../components/TwoFA";
import DeleteAccount from "../../components/DeleteAccount";
import packagejson from "../../../package.json";
import axios from "../../utils/axios-instance";
import Loader from "../../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import Invoices from "../Invoices";
import { formatDate } from "../../utils/helper";

const Profile = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [loadingMedia, setLoadingMedia] = React.useState<boolean>(false);
  const [loadingPlan, setLoadingPlan] = React.useState<boolean>(false);

  const [password, setPassword] = React.useState("");
  const [confrmPassword, setConfirmPassword] = React.useState("");
  const [media, setMedia] = React.useState([]);
  const [activePlan, setActivePlan] = React.useState<any>();
  const [paymentMethod, setPaymentMethod] = React.useState<any>();
  const [paymentMethodDetails, setPaymentMethodDetails] = React.useState<any>();

  const [subscription, setSubscription] = React.useState<any>();

  const user = decodeBase64(Cookies.get("s-user") as string);

  const [openModalCancel, setOpenModalCancel] = React.useState<boolean>(false);

  const handleChangePassword = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log("Changed", { password, confrmPassword });
  };

  const handleCancelSubscription = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await axios.delete(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      setOpenModalCancel(false);
      await fetchSubscription();
    } catch (error) {
      console.log("error cancel subscription", error);
    }
  };

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
        window.location.href = `${window.location.pathname}?page=sato-signin`;
      }
    } finally {
      setLoadingMedia(false);
    }
  };

  React.useEffect(() => {
    fetchMedia();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoadingPlan(true);
      const res = await axios.get(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      setSubscription(res?.data?.subscription);
      setPaymentMethod(res?.data?.subscription?.payment_method);
      setPaymentMethodDetails(res?.data?.payment_method);

      const plans = await axios.get(`/plans/${res.data.subscription.plan_id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      setActivePlan(plans.data);
      setLoadingPlan(false);
    } catch (error: any) {
      console.log("error in subscription", error);
      setLoadingPlan(false);
      if (error.response.status === 401) {
        window.location.href = `${window.location.pathname}?page=sato-signin`;
      }
    } finally {
      setLoadingPlan(false);
    }
  };

  React.useEffect(() => {
    fetchSubscription();
  }, []);

  if (!user) return <Loader />;

  return (
    <>
      {(subscription?.status === "pending" ||
        subscription?.status === "halted") && (
        <div
          style={{
            // position: "absolute",
            boxSizing: "border-box",
            // top: 0,
            width: "100%",
            borderRadius: "0.25rem",
            border: "1px solid var(--stroke)",
            padding: "1rem",
            marginTop: "2rem",
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
      )}

      {subscription?.status === "cancelled" && (
        <div
          style={{
            // position: "absolute",
            boxSizing: "border-box",
            // top: 0,
            width: "100%",
            borderRadius: "0.25rem",
            border: "1px solid var(--stroke)",
            padding: "1rem",
            marginTop: "2rem",
            backgroundColor: "#f5fab3ff",
            display: "flex",
            // justifyContent: "center",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <p className="body">
            Your subscription has been cancelled. To continue using Sato, you
            must &nbsp;
            <Link
              to={"/plans"}
              style={{
                textDecoration: "none",
              }}
              className="primary"
            >
              subscribed to a plan
            </Link>
          </p>
        </div>
      )}

      <div className="main-page-wrapper" style={{ position: "relative" }}>
        <p className="subtitle-one">Profile</p>

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
                Active Plan
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
              ) : activePlan ? (
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
                  {subscription?.cancel_at === 0 && (
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

        {subscription?.cancel_at > 0 && subscription?.status != "cancelled" && (
          <div
            style={{
              // position: "absolute",
              boxSizing: "border-box",
              // top: 0,
              width: "100%",
              borderRadius: "0.25rem",
              border: "1px solid var(--stroke)",
              padding: "1rem",
              marginTop: "2rem",
              backgroundColor: "#f5fab3ff",
              display: "flex",
              // justifyContent: "center",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <p className="body">
              We’ve processed your cancellation request. Your subscription will
              stay active through {formatDate(subscription.cancel_at)}
            </p>
          </div>
        )}

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

        {paymentMethod && (
          <>
            <p className="subtitle-one" style={{ margin: "2.5rem 0 1rem 0" }}>
              Your Payment Method
            </p>
            <p
              className="label textSecondary"
              style={{
                marginTop: "1rem",
              }}
            >
              This is the payment method used for your recurring transactions.
            </p>

            <div className="profile-box">
              <div>
                <p className="label textSecondary">{paymentMethod}</p>
                {paymentMethod === "card" ? (
                  <div style={{ marginTop: "0.5rem" }}>
                    <span className="body">
                      {paymentMethodDetails?.type.charAt(0).toUpperCase() +
                        paymentMethodDetails?.type.slice(1).toLowerCase()}
                    </span>
                    <span className="dot" style={{ margin: "0 10px" }}>
                      •
                    </span>
                    <span className="body">
                      {paymentMethodDetails?.network}
                    </span>
                    <span className="dot" style={{ margin: "0 10px" }}>
                      •
                    </span>
                    <span className="body">
                      **** **** **** {paymentMethodDetails?.last4}
                    </span>
                  </div>
                ) : (
                  <p className="body" style={{ marginTop: "0.5rem" }}>
                    {paymentMethodDetails?.vpa}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* <div style={{
        marginTop: '2rem',
      }}>
        <p className='body'>Password</p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          width: '22rem',
          gap: '1rem'

        }}>
          <div className='profile-box' style={{ marginTop: '0' }}>
            <p className='body'>********</p>
          </div>

          <button className='large-primary-btn'
            onClick={() => setOpenModal(true)}
          >Change</button>
        </div>
      </div> */}

        <Modal
          isOpen={openModal}
          setOpen={setOpenModal}
          title={`Change Password`}
          size="sm"
        >
          <form onSubmit={handleChangePassword}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
              }}
            >
              <p className="input-title">Password</p>
              <input
                className="input-main"
                style={{ width: "90%" }}
                autoComplete="off"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                placeholder="********"
              />

              <div style={{ marginTop: "2rem" }}>
                <p className="input-title">Confirm Password</p>
                <input
                  className="input-main"
                  style={{ width: "90%" }}
                  autoComplete="off"
                  type="password"
                  value={confrmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  name="password"
                  placeholder="********"
                />
              </div>

              <button
                type="submit"
                className="large-primary-btn"
                style={{
                  marginTop: "2rem",
                }}
              >
                Confirm Change
              </button>
            </div>
          </form>
        </Modal>

        {activePlan?.amount > 0 && <Invoices length={5} />}
        <TwoFA email={user.email} enabled={user.twoFAEnabled} />

        <DeleteAccount email={user.email} />

        <div className="version-container-profile">
          <p className="label" style={{ marginTop: "0.5rem" }}>
            Version {packagejson.version}
          </p>
        </div>
      </div>
    </>
  );
};

export default Profile;
