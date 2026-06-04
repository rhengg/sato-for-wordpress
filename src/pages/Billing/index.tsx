import React from "react";
import { decodeBase64 } from "../../utils/base64";
import Cookies from "js-cookie";
import Loader from "../../components/Loader";
import axios from "../../utils/axios-instance";
import { useNavigate } from "react-router-dom";
import Invoices from "../Invoices";
import { formatDate } from "../../utils/helper";
import Error from "../../components/Error";

const BillingPage = () => {
  const navigate = useNavigate();

  const [subscription, setSubscription] = React.useState<any>();
  const user = decodeBase64(Cookies.get("s-user") as string);
  const [activePlan, setActivePlan] = React.useState<any>();
  const [loadingPlan, setLoadingPlan] = React.useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = React.useState<any>();
  const [paymentMethodDetails, setPaymentMethodDetails] = React.useState<any>();

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
      setActivePlan(plans.data?.plan);
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

  if (!user || loadingPlan)
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

  // if (!paymentMethod)
  //   return (
  //     <div
  //       style={{
  //         maxWidth: "900px",
  //         margin: "0 auto",
  //       }}
  //     >
  //       <Error
  //         errorMessage={
  //           !subscription
  //             ? "No billing details to show. You do not have any active subscription."
  //             : "No billing details to show. You’re currently using the free plan"
  //         }
  //       />
  //     </div>
  //   );

  return (
    <div
      style={{
        // padding: "24px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {subscription && activePlan?.amount > 0 && (
        <>
          <p className="subtitle-one">Your Subscription Details</p>

          <div className="profile-box" style={{ marginBottom: "2rem" }}>
            <div>
              <p className="label textSecondary">Billing Cycle</p>
              <p className="body" style={{ marginTop: "0.5rem" }}>
                {formatDate(subscription.current_start)}&nbsp;-&nbsp;
                {formatDate(subscription.current_end)}
              </p>
            </div>

            {/* <div>
              <p className="label textSecondary">Expiry</p>
              <p className="body" style={{ marginTop: "0.5rem" }}>
                {formatDate(subscription.current_end)}
              </p>
            </div> */}
          </div>

          {/* <p className="subtitle-one">Your Payment Method</p>
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
                  <span className="body">{paymentMethodDetails?.network}</span>
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
          </div> */}
        </>
      )}

      {paymentMethod && <div style={{ marginTop: "2rem" }}></div>}

      <Invoices />
    </div>
  );
};

export default BillingPage;
