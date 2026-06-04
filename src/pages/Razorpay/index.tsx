import React from "react";
import config from "../../config";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import { decodeBase64, encodeBase64 } from "../../utils/base64";
import "./razorpay.css";
import Loader from "../../components/Loader";
import CountrySelect, { Country } from "../../components/CountrySelect";
import Modal from "../../components/Modal";
import IndianStateSelect from "../../components/IndianStateSelect";

const Razorpay = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("planId");
  const planAmount = searchParams.get("planAmount");
  // const subscription_id = searchParams.get("s_id");

  const [paymentError, setPaymentError] = React.useState("");
  const [error, setError] = React.useState("");
  const [plan, setPlan] = React.useState<any>();
  const [inputCountry, setInputCountry] = React.useState<Country>({
    name: "India",
    code: "IN",
    flag: "🇮🇳",
  });
  const [inputState, setInputState] = React.useState<Country>({
    name: "Assam",
    code: "AS",
  });
  const [inputPin, setInputPin] = React.useState<any>();
  const [inputAddress, setInputAddress] = React.useState<any>();
  const [inputAddressTwo, setInputAddressTwo] = React.useState<any>();
  const [inputCity, setInputCity] = React.useState<any>();
  const [inputGST, setInputGST] = React.useState<any>();
  const [inputPhone, setInputPhone] = React.useState<any>();
  const [validatePhone, setValidatePhone] = React.useState<any>();
  const [isloading, setLoading] = React.useState(false);

  const [show, setShow] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const [subscription, setSubscription] = React.useState<any>();
  const [subscriptionLoading, setSubscriptionLoading] = React.useState<any>();

  const [openModalConfirm, setOpenModalConfirm] = React.useState(false);

  const user = decodeBase64(Cookies.get("s-user") as string);

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
      setInputState({ ...inputState, name: res.data?.state });
      setInputPin(res?.data?.postal_code);
      setInputPhone(res?.data?.phone_number);
      setInputCountry({ ...inputCountry, name: res.data.country });
      setInputGST(res?.data?.gst_number);
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
        state: inputState?.name,
        country: inputCountry?.name,
        postal_code: inputPin,
        phone_number: inputPhone,
        gst_number: inputGST,
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

  const subscriptionToSplay = async () => {
    try {
      setLoading(true);
      // await saveBillingAddress();
      const value = Number(plan?.amount) === 0 ? "free" : "razorpay";
      const url = `/subscriptions/${planId}/${value}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      console.log("success subscriptions", res.data);
      if (res?.data?.order_id && Number(plan?.amount) > 0) {
        await displayRazorpay(res?.data?.order_id);
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
      // if (error.response.status === 500) {
      //   navigate({
      //     pathname: "/500",
      //      search: `?m=${encodeBase64(
      //        "At the end of your billing cycle, your subscription will automatically switch to the free plan."
      //      )}`,
      //   });
      // }
      console.log("error in subscription", error.response);
      setErrorMessage(error.response.data.error);
      showToast();
      navigate({
        pathname: "/500",
        search: `?m=${encodeBase64(error.response?.data?.error || error.response?.data)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const showToast = () => {
    setShow(true);
  };

  const hideToast = () => {
    setShow(false);
  };

  async function sleep(ms: any) {
    return new Promise((res: any, rej: any) => {
      setTimeout(() => {
        res();
      }, ms);
    });
  }

  function loadScript(src: any) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const displayRazorpay = async (order_id: string) => {
    if (!inputPhone) {
      console.log("emp");
      return setValidatePhone("empty-phone");
    }
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/magic-checkout.js",
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      var options = {
        key: config.RAZORPAY_KEY,
        one_click_checkout: true,
        name: "Sato",
        image: "/sato_icon1.svg",
        amount: plan?.amount,
        currency: plan?.currency?.toUpperCase(),
        order_id: order_id,
        handler: async function (response: any) {
          console.log(response.razorpay_payment_id);
          console.log(response.razorpay_signature);
          console.log(response.razorpay_order_id);
          await sleep(3000);
          try {
            setLoading(true);
            if (
              response.razorpay_payment_id &&
              response.razorpay_signature &&
              response.razorpay_order_id
            ) {
              const res = await axios.post(
                `/subscriptions/verify/razorpay`,
                response,
                {
                  headers: {
                    Authorization: `Bearer ${Cookies.get("s-token")}`,
                  },
                },
              );
              // const res = await axios.post(`/subscriptions/payment`, {
              //   ...response,
              //   status: "active",
              // });
              console.log("res", res.data);
              sessionStorage.removeItem("choosen-plan");
              window.location.href = `/payment-success?plan=${encodeBase64(
                plan?.name,
              )}`;
            } else {
              // const res = await axios.post(`/subscriptions/payment`, {
              //   razorpay_subscription_id: subscription_id,
              //   status: "failed",
              // });
              // console.log("res", res.data);
              sessionStorage.removeItem("choosen-plan");
              window.location.href = "/payment-failed";
            }
          } catch (error) {
            console.log("error", error);
            setError("unable-to-create-plan");
            setLoading(false);
          } finally {
            setLoading(false);
            sessionStorage.removeItem("choosen-plan");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: inputPhone,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#fe6244",
        },
        modal: {
          escape: false,
          confirm_close: true,
          // ondismiss: async function () {
          //   const res = await axios.post(`/subscriptions/payment`, {
          //     razorpay_subscription_id: subscription_id,
          //     status: "failed",
          //   });
          // },
        },
      };

      //@ts-ignore
      const paymentObject = new window.Razorpay(options);
      // paymentObject.on("payment.failed", async function (response: string) {
      //   const res = await axios.post(`/subscriptions/payment`, {
      //     razorpay_subscription_id: subscription_id,
      //     status: "failed",
      //   });
      // });
      paymentObject.open();
    } catch (error) {
      setPaymentError("error");
      console.log("error in payment", error);
      window.location.href = "/payment-failed";
    }
  };

  return (
    <>
      {/* {subscription?.subscription?.payment_method === "card" &&
        !subscription?.payment_method?.international && (
          <div
            style={{
              boxSizing: "border-box",
              width: "100%",
              borderRadius: "0.25rem",
              border: "1px solid var(--stroke)",
              padding: "1rem",
              marginTop: "2rem",
              backgroundColor: "#f5fab3ff",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <p className="label textSecondary">Note:</p>
            <div
              style={{
                paddingLeft: "1rem",
              }}
            >
              <ul className="label textSecondary">
                <li>
                  Changing your plan before the end of your billing cycle will
                  activate the new plan and you will be charged for the new plan
                  immediately.
                </li>
                <li>
                  Amount charged in your current plan will not be carried over.
                </li>
                <li>
                  Alternatively, you can cancel the current subscription and
                  once your billing cycle ends, you can choose a new plan.
                </li>
              </ul>
            </div>
          </div>
        )} */}

      {/* {subscription?.subscription?.payment_method === "upi" && (
        <div
          style={{
            boxSizing: "border-box",
            // top: 0,
            width: "100%",
            borderRadius: "0.25rem",
            border: "1px solid var(--stroke)",
            padding: "1rem",
            marginTop: "2rem",
            backgroundColor: "#f5fab3ff",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          <p className="label textSecondary">Note:</p>
          <div
            style={{
              paddingLeft: "1rem",
            }}
          >
            <ul className="label textSecondary">
              <li>
                Changing your plan before the end of your billing cycle will
                activate the new plan and you will be charged for the new plan
                immediately.
              </li>
              <li>
                Amount charged in your current plan will not be carried over.
              </li>
              <li>
                Alternatively, you can cancel the current subscription and once
                your billing cycle ends, you can choose a new plan.
              </li>
            </ul>
          </div>
        </div>
      )} */}

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
                      Address Line 1<span style={{ color: "red" }}>*</span>
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
                  {/* <div style={{ width: "100%" }}>
                <p className="input-title">Country</p>
                <CountrySelect
                  value={inputCountry}
                  onChange={setInputCountry}
                />
              </div> */}
                </div>

                <div className="address-container">
                  <div style={{ width: "100%" }}>
                    <p className="input-title">
                      City<span style={{ color: "red" }}>*</span>
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
                      State<span style={{ color: "red" }}>*</span>
                    </p>
                    <IndianStateSelect
                      value={inputState}
                      onChange={setInputState}
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
                  <p className="input-title">GST</p>
                  <input
                    className="input-main"
                    style={{ width: "100%" }}
                    maxLength={200}
                    value={inputGST}
                    onChange={(e) => setInputGST(e.target.value)}
                    name="gst"
                    placeholder="Enter GST Number"
                  />
                </div>

                <div>
                  <p className="input-title">
                    Phone<span style={{ color: "red" }}>*</span>
                  </p>
                  <input
                    className="input-main"
                    style={{ width: "100%" }}
                    type="tel"
                    maxLength={15}
                    value={inputPhone}
                    onChange={(e) => setInputPhone(e.target.value)}
                    name="phone"
                    placeholder="Enter your phone number"
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
    </>
  );
};

export default Razorpay;
