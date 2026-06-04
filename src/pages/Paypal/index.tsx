import React from "react";
import CountrySelect, { Country } from "../../components/CountrySelect";
import { decodeBase64, encodeBase64 } from "../../utils/base64";
import Cookies from "js-cookie";
import Loader from "../../components/Loader";
import "../Razorpay/razorpay.css";
import axios from "../../utils/axios-instance";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Modal from "../../components/Modal";

const Paypal = () => {
  const { country } = useParams(); // IN, US, etc

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("planId");
  const planAmount = searchParams.get("planAmount");

  const user = decodeBase64(Cookies.get("s-user") as string);

  const [plan, setPlan] = React.useState<any>();
  const [inputCountry, setInputCountry] = React.useState<Country>({
    name: "India",
    code: "IN",
    flag: "🇮🇳",
  });
  const [inputState, setInputState] = React.useState<any>();
  const [inputPin, setInputPin] = React.useState<any>();
  const [inputAddress, setInputAddress] = React.useState<any>();
  const [inputAddressTwo, setInputAddressTwo] = React.useState<any>();
  const [inputCity, setInputCity] = React.useState<any>();
  const [inputPhone, setInputPhone] = React.useState<any>();
  const [validatePhone, setValidatePhone] = React.useState<any>();
  const [isloading, setLoading] = React.useState(false);

  const [error, setError] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const [openModalConfirm, setOpenModalConfirm] = React.useState(false);

  const [activePlan, setActivePlan] = React.useState<any>();

  const fetchBillingAddress = async () => {
    try {
      const res = await axios.get(`subscriptions/billing-address`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // console.log("billing address", res.data);
      setInputAddress(res?.data?.address_line_1);
      setInputAddressTwo(res?.data?.address_line_2);
      setInputCity(res?.data?.city);
      setInputState(res?.data?.state);
      setInputPin(res?.data?.postal_code);
      setInputPhone(res?.data?.phone_number);
      setInputCountry({ ...inputCountry, name: res.data.country });
    } catch (error) {
      console.log("error fetching billing address", error);
    }
  };

  const saveBillingAddress = async () => {
    setLoading(true);
    try {
      const data = {
        address_line_1: inputAddress,
        address_line_2: inputAddressTwo,
        city: inputCity,
        state: inputState,
        country: inputCountry?.name,
        postal_code: inputPin,
        phone_number: inputPhone,
      };
      if (Number(plan?.amount) > 0) {
        const res = await axios.put(`subscriptions/billing-address`, data, {
          headers: {
            Authorization: `Bearer ${Cookies.get("s-token")}`,
          },
        });
        console.log("billing address", res.data);
      }
      setOpenModalConfirm(true);
    } catch (error) {
      console.log("error saving billing address", error);
      setLoading(false);
      setOpenModalConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`/plans/${planId}`);
      console.log("fetching plan by id", res);
      setPlan(res.data?.plan);
      sessionStorage.removeItem("from-landing-page");
    } catch (error) {
      console.log("error fetching plans", error);
    }
  };

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // setSubscription(res?.data?.subscription);
      const plans = await axios.get(`/plans/${res.data.subscription.plan_id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // console.log("plan details", plans?.data);
      setActivePlan(plans.data?.plan);
    } catch (error: any) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSubscription();
  }, []);

  React.useEffect(() => {
    fetchPlans();
  }, []);

  React.useEffect(() => {
    fetchBillingAddress();
  }, []);

  const openCustomWindowPaypal = (url: string) => {
    const features =
      "width=600,height=800,left=100,top=100,resizable=yes,scrollbars=yes,noopener";
    window.open(url, "_blank", features);
  };

  const checkSubscriptionStatus = () => {
    const timer = setInterval(async () => {
      setLoading(true);
      let subscription = (
        await axios.get(`/subscriptions`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("s-token")}`,
          },
        })
      ).data?.subscription;

      if (subscription?.status?.toUpperCase() === "ACTIVE") {
        clearInterval(timer);
        setLoading(false);
        navigate({
          pathname: `/payment-success`,
          search: `?plan=${encodeBase64(plan?.name)}`,
        });
        return;
      }
    }, 10000);
  };

  const subscriptionToSplay = async () => {
    try {
      setLoading(true);
      // await saveBillingAddress();
      const url = `/subscriptions/${planId}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      console.log("success subscriptions", res.data);
      if (res?.data?.payment_url && Number(plan?.amount) > 0) {
        // open new tab for paypal
        openCustomWindowPaypal(res?.data?.payment_url);
        // Get the subscription status
        checkSubscriptionStatus();
        sessionStorage.removeItem("choosen-plan");
      } else {
        sessionStorage.removeItem("choosen-plan");
        navigate({
          pathname: `/payment-success`,
          search: `?plan=${encodeBase64(plan?.name)}`,
        });
      }
    } catch (error: any) {
      setLoading(false);
      if (error.response.status === 403) {
        setError("downgrade-error");
        setErrorMessage(error.response.data.error);
        return;
      }

      console.log("error in subscription", error.response.status);
      setErrorMessage(error.response.data.error);
      navigate({
        pathname: "/500",
        search: `?m=${encodeBase64(error.response.data.error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-page-wrapper">
      <div
        style={{
          // padding: "1rem",
          display: "flex",
          flexDirection: "column",
          // justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="plan-details-container">
          <p className="subtitle-one">Confirm Subscription</p>
          <p className="body">Plan name: {plan?.name}</p>
          <p className="body">Plan tenure: {plan?.period}</p>
          <p className="body">
            Total cost: {plan?.currency + " " + plan?.amount / 100}
          </p>

          <div
            style={{
              marginTop: "2rem",
            }}
          >
            <p className="subtitle-one" style={{ marginBottom: "0.5rem" }}>
              Your billing information
            </p>
            <p className="input-title">Name</p>
            <div
              className="input-main"
              style={{
                width: "100%",
                flex: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <p className="body">{user.name || ""}</p>
            </div>
          </div>

          <div>
            <p className="input-title">Email</p>
            <div
              className="input-main"
              style={{
                width: "100%",
                flex: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <p className="body">{user.email || ""}</p>
            </div>
          </div>

          {Number(plan?.amount) > 0 && (
            <>
              <div className="address-container">
                <div style={{ width: "100%" }}>
                  <p className="input-title">
                    Address Line 1 <span style={{ color: "red" }}>*</span>
                  </p>
                  <input
                    className="input-main"
                    style={{ width: "100%" }}
                    value={inputAddress}
                    onChange={(e) => setInputAddress(e.target.value)}
                    name="address"
                    placeholder="Enter Address Line 1"
                  />
                </div>
                <div style={{ width: "100%" }}>
                  <p className="input-title">Address Line 2</p>
                  <input
                    className="input-main"
                    style={{ width: "100%" }}
                    value={inputAddressTwo}
                    onChange={(e) => setInputAddressTwo(e.target.value)}
                    name="addressLineTwo"
                    placeholder="Enter Address Line 2"
                  />
                </div>
              </div>

              <div className="address-container">
                <div style={{ width: "100%" }}>
                  <p className="input-title">
                    Country <span style={{ color: "red" }}>*</span>
                  </p>
                  <CountrySelect
                    value={inputCountry}
                    onChange={setInputCountry}
                  />
                </div>

                <div style={{ width: "100%" }}>
                  <p className="input-title">
                    State/Province <span style={{ color: "red" }}>*</span>
                  </p>
                  <input
                    className="input-main"
                    style={{ width: "100%" }}
                    value={inputState}
                    onChange={(e) => setInputState(e.target.value)}
                    name="gst"
                    placeholder="Enter State/Province"
                  />
                </div>
              </div>

              <div className="address-container">
                <div style={{ width: "100%" }}>
                  <p className="input-title">
                    City <span style={{ color: "red" }}>*</span>
                  </p>
                  <input
                    className="input-main"
                    style={{ width: "100%" }}
                    value={inputCity}
                    onChange={(e) => setInputCity(e.target.value)}
                    name="city"
                    placeholder="Enter City"
                  />
                </div>

                <div style={{ width: "100%" }}>
                  <p className="input-title">
                    Postal code <span style={{ color: "red" }}>*</span>
                  </p>
                  <input
                    className="input-main"
                    style={{ width: "100%" }}
                    type="text"
                    maxLength={100}
                    value={inputPin}
                    onChange={(e) =>
                      // setInputPin(e.target.value?.replace(/[^0-9+]/g, ""))
                      setInputPin(e.target.value)
                    }
                    name="gst"
                    placeholder="Enter Postal Code"
                  />
                </div>
              </div>

              <div>
                <p className="input-title">
                  Phone <span style={{ color: "red" }}>*</span>
                </p>
                <input
                  className="input-main"
                  style={{ width: "100%" }}
                  type="tel"
                  maxLength={15}
                  value={inputPhone}
                  onChange={(e) =>
                    setInputPhone(e.target.value?.replace(/[^0-9+]/g, ""))
                  }
                  name="phone"
                  placeholder="Enter Phone Number"
                />
                <div style={{ minHeight: "1rem" }}>
                  {validatePhone === "empty-phone" && (
                    <p className="error-text required-error-text-space">
                      Required field!
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="error-container">
            {error === "unable-to-create-plan" && (
              <p className="body">
                Could not complete subscription. Please contact
                hello@satoplayer.com with a screenshot of the transaction
              </p>
            )}
            {error === "downgrade-error" && (
              <p className="error-text">{errorMessage}</p>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            <button
              // onClick={subscriptionToSplay}
              onClick={saveBillingAddress}
              // disabled={!inputPhone}
              disabled={
                Number(plan?.amount) > 0 &&
                (!inputPhone ||
                  !inputAddress ||
                  !inputCountry?.name ||
                  !inputState ||
                  !inputCity ||
                  !inputPin)
              }
              type="button"
              className="large-primary-btn button-width"
            >
              {isloading ? <Loader /> : "Save and Continue"}
            </button>
          </div>

          <Modal
            isOpen={openModalConfirm}
            setOpen={setOpenModalConfirm}
            title={`Confirm Subscription`}
            size="sm"
          >
            {activePlan ? (
              <>
                <p
                  className="body textSecondary"
                  style={{
                    marginTop: "1rem",
                  }}
                >
                  You are moving from{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {activePlan?.name}-{activePlan?.period}
                  </span>{" "}
                  to{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {plan?.name}-{plan?.period}
                  </span>
                  .
                </p>
                <br />
                <p className="body textSecondary">
                  This will cancel your current plan immediately and start the
                  new one.
                </p>
              </>
            ) : (
              <>
                <p
                  className="body textSecondary"
                  style={{
                    marginTop: "1rem",
                  }}
                >
                  You are subscribing to{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {plan?.name}-{plan?.period}
                  </span>
                  .
                </p>
                <p className="body textSecondary">Continue?</p>
              </>
            )}

            <button
              onClick={subscriptionToSplay}
              className="large-primary-btn"
              disabled={isloading}
              style={{
                marginTop: "2rem",
                width: "100%",
              }}
            >
              {isloading ? <Loader /> : "Continue"}
            </button>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Paypal;
