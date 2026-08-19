import React from "react";
import Loader from "../../components/Loader";
import axios from "../../utils/axios-instance";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import { formatDate } from "../../utils/helper";
import SatoLogo from "../../components/SatoLogo";
import config from "../../config";
import { Button, Snackbar } from "@wordpress/components";
import { NoticeType } from "../Home";

const AccountPage = ({ token }: { token: string }) => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = React.useState<any>();
  const [user, setUser] = React.useState<any>();
  const [openModalCancel, setOpenModalCancel] = React.useState<boolean>(false);
  const [openModalLogout, setOpenModalLogout] = React.useState<boolean>(false);
  const [media, setMedia] = React.useState([]);
  const [invoices, setInvoices] = React.useState<any>([]);
  const [loadingMedia, setLoadingMedia] = React.useState<boolean>(true);
  const [loadingInvoices, setLoadingInvoices] = React.useState(true);
  const [activePlan, setActivePlan] = React.useState<any>();
  const [notice, setNotice] = React.useState<NoticeType>();
  const { nonce, apiUrl } = window.satoConfig;

  const showNotice = (item: NoticeType) => {
    setNotice(item);
    setTimeout(() => {
      setNotice(undefined);
    }, 3000);
  };

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
      showNotice({
        status: "error",
        text: "Subscription cancellation failed!",
      });
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
      if (error.response.status === 401) {
        navigate({ pathname: "/signin" });
      }
    }
  };

  const fetchInvoice = async () => {
    try {
      const res = await axios.get(`/subscriptions/invoices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInvoices(res.data);
    } catch (error) {
      // console.log("error fetching media", error);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const fetchMedia = async () => {
    try {
      const res = await axios.get("/videos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMedia(res.data);
    } catch (error: any) {
      if (error.response.status === 401) {
        navigate({ pathname: "/signin" });
      }
    } finally {
      setLoadingMedia(false);
    }
  };

  React.useEffect(() => {
    fetchSubscription();
    fetchUserDetail();
    fetchInvoice();
  }, []);

  const handleLogout = async () => {
    await fetch(`${apiUrl}logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": nonce,
      },
    });
    window.location.reload();
  };

  if (!user || !subscription || !activePlan || loadingMedia || loadingInvoices)
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
      <SatoLogo />

      {notice && (
        <div
          style={{
            position: "fixed",
            top: "2%",
            left: "50%",
            zIndex: "9999",
            transform: "translate(0%,50%)",
          }}
        >
          <Snackbar
            politeness="polite"
            onDismiss={() => {
              setNotice(undefined);
            }}
            onRemove={() => {
              setNotice(undefined);
            }}
          >
            {notice.text}
          </Snackbar>
        </div>
      )}

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
                    to={"https://app.satoplayer.com/plans"}
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
                    to={"https://app.satoplayer.com/plans"}
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
                    to={"https://app.satoplayer.com/plans"}
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
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    width: "max-content",
                  }}
                >
                  <p className="subtitle-two">Your Payment Receipts</p>
                </div>
              </div>

              <p
                className="caption textSecondary"
                style={{
                  marginTop: "0.5rem",
                }}
              >
                All your payment receipts are listed here.
              </p>

              {invoices && invoices.length > 0 ? (
                <div className="plan-list">
                  {[...invoices]
                    .sort(
                      (a: any, b: any) =>
                        new Date(b.paid_at).getTime() -
                        new Date(a.paid_at).getTime(),
                    )
                    .map((inv: any, index: number) => (
                      <div
                        key={inv.id}
                        className="plan-item"
                        style={{
                          borderBottom:
                            index === invoices.length - 1
                              ? "none"
                              : "1px solid var(--stroke)",
                          paddingBottom:
                            index === invoices.length - 1 ? "1rem" : "1rem",
                          paddingTop:
                            index === invoices.length - 1 ? "1rem" : "1rem",
                        }}
                      >
                        <div className="plan-details">
                          <span className="body">{inv.plan_name}</span>
                          <span className="dot">•</span>
                          {inv.status === "paid" ? (
                            <span
                              className="label"
                              style={{ color: "var(--positive)" }}
                            >
                              Paid on {formatDate(inv.paid_at)}
                            </span>
                          ) : (
                            <span className="label">{inv.status}</span>
                          )}
                        </div>

                        <Link
                          to={new URL(
                            inv.short_url,
                            config.IMAGE_CDN_URL,
                          ).toString()}
                          target="_blank"
                          style={{
                            textDecoration: "none",
                          }}
                          className="sato-link"
                        >
                          View
                        </Link>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="plan-list">
                  <p className="body" style={{ padding: "1rem 0" }}>
                    No receipts found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <Button
            variant="secondary"
            __next40pxDefaultSize
            onClick={() => setOpenModalLogout(true)}
          >
            Logout
          </Button>
        </div>

        <Modal
          isOpen={openModalLogout}
          setOpen={setOpenModalLogout}
          title={"Confirm Logout"}
          size="sm"
        >
          <p className="body">
            Are you sure you want to logout? All unsaved changes will be lost
            and you will need to login again to access your account.
          </p>
          <form onSubmit={handleLogout}>
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
                  setOpenModalLogout(false);
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
