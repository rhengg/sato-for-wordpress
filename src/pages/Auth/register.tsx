import axios from "../../utils/axios-instance";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../../components/Loader";
import { encodeBase64 } from "../../utils/base64";
import { loadUserIp, validatePassword } from "../../utils/helper";

type FormDataType = {
  title: string;
  placeholder: string;
  name: string;
  value?: string;
  type: string;
  error: boolean;
};

/**
 * Returns the register page.
 * Renders four input fields(i.e name,email, password and confirmPassword)
 * Renders two buttons(i.e signin and signup)
 */
const Register = () => {
  const params = new URLSearchParams(window.location.search);

  // Handle choosen plan from landing page using session storage
  const fromLandingPage = sessionStorage.getItem("from-landing-page");
  const choosenPlanFromLandingPage = JSON.parse(fromLandingPage as string);

  // Handle oauth flow for canva using session storage
  const oAuthData = sessionStorage.getItem("o-auth");
  const oAuthObj = JSON.parse(oAuthData as any);

  const choosenPlan = params.get("planId");
  const choosenPlanAmount = params.get("planAmount");
  React.useEffect(() => {
    if (choosenPlan) {
      // console.log('choosen plan', choosenPlan, choosenPlanAmount)
      sessionStorage.setItem(
        "choosen-plan",
        JSON.stringify({
          planId: choosenPlan,
          amount: choosenPlanAmount,
        }),
      );
    }
  }, [choosenPlan]);

  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [incorrectPassword, setIncorrectPassword] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);
  const [pin, setPin] = React.useState("");
  const [pinId, setPinId] = React.useState("");
  const [error, setError] = React.useState("");
  const [renderElement, setRenderElement] = React.useState("register");
  const [pVisibility, setPVisibility] = React.useState(false);
  const [cPVisibility, setCPVisibility] = React.useState(false);

  const [acceptPolicy, setAcceptPolicy] = React.useState(false);

  const [formData, setFormData] = React.useState<FormDataType[]>([
    {
      title: "Name",
      placeholder: "Enter your name",
      name: "name",
      value: "",
      type: "text",
      error: false,
    },
    {
      title: "Email",
      placeholder: "Enter your email",
      name: "email",
      value: "",
      type: "email",
      error: false,
    },
    {
      title: "Password",
      placeholder: "********",
      name: "password",
      value: "",
      type: !pVisibility ? "password" : "text",
      error: false,
    },
    {
      title: "Re-enter Password",
      placeholder: "********",
      name: "confirmPassword",
      value: "",
      type: !cPVisibility ? "password" : "text",
      error: false,
    },
  ]);

  /**
   * If "value" key is empty then returns the "error" key value of each object of as true.
   * Otherwise it returns "error" key value as false.
   */
  const checkValidation = () => {
    const validateData = formData.map((item) => {
      if (item.value === "") {
        item.error = true;
        return item;
      } else {
        item.error = false;
        return item;
      }
    });
    return validateData;
  };

  // function runs on change in input value and stores the value in a useState hook called "formData"
  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const filteredData = formData.map((item) => {
      if (item.name === event.target.name) {
        item.value = event.target.value;
        return item;
      } else {
        return item;
      }
    });
    setFormData(filteredData);
  };

  const generateOTP = async (email: string) => {
    setOtpSent(false);
    setLoading(true);
    try {
      const res = await axios.post("/otps/generate", {
        email,
        // purpose: "register",
      });
      setOtpSent(true);
      setRenderElement("otp-sent");
      setPinId(res.data.id);
      setLoading(false);
      // console.log('success', res);
    } catch (error: any) {
      setOtpSent(false);
      setLoading(false);
      console.log("error generating otp", error);
      if (error.response.status === 409) {
        setError("user-already-exist");
      }
    }
  };

  // const verifyOTP = async (e: React.SyntheticEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);
  //   if (pin === "") {
  //     setError("pin-empty");
  //   }
  //   const otpdata = { id: pinId, code: pin };

  //   try {
  //     const res = await axios.post("/otps/verify", otpdata);
  //     // console.log('otp verification', res);
  //     Cookies.set("splay-token", res.data.token, { expires: 7, path: "/" });
  //     await registerUser();
  //   } catch (error: any) {
  //     setLoading(false);
  //     if (error?.response?.status === 401) {
  //       setError("invalid-otp");
  //       console.log("invalid-otp");
  //     }
  //     console.log("error verifying otp", error);
  //   }
  // };

  const localstorage = localStorage.getItem("testUser");
  const parsedData = JSON.parse(localstorage as string);

  const registerUser = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setError("");
    if (!pin || pin === "") {
      setError("pin-empty");
      return;
    }
    setLoading(true);
    const userdata = {
      email: parsedData.email,
      name: parsedData.name,
      password: parsedData.password,
      otp: pin,
    };
    try {
      const countryCode = await loadUserIp();
      const res = await axios.post("/register", userdata, {
        headers: {
          Authorization: `Bearer ${Cookies.get("splay-token")}`,
        },
      });
      // console.log('success', res);
      setRenderElement("account-created");
      setOtpSent(false);
      setLoading(false);
      localStorage.removeItem("testUser");
      Cookies.set("s-token", res.data.token, {
        expires: 30,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("s-user", encodeBase64(res.data.user), {
        expires: 30,
        secure: true,
        sameSite: "Strict",
      });
      setTimeout(() => {
        if (choosenPlanFromLandingPage) {
          window.location.replace(
            `/checkout/${countryCode === "IN" ? "IN" : countryCode}?planId=${choosenPlanFromLandingPage?.planId}`,
          );
        } else if (choosenPlan && choosenPlanAmount) {
          window.location.replace(
            `/checkout/${countryCode === "IN" ? "IN" : countryCode}?planId=${choosenPlan}&planAmount=${choosenPlanAmount}`,
          );
        } else if (oAuthObj) {
          window.location.replace(
            oAuthObj?.url?.pathname + oAuthObj?.url?.search,
          );
        } else {
          window.location.replace("/");
        }
      }, 800);
    } catch (error: any) {
      setLoading(false);
      if (error?.response?.status === 401) {
        setError("invalid-otp");
        console.log("exists");
      }
      if (error?.response?.status === 409) {
        setError("exists");
        console.log("exists");
      }
      console.log("error registration", error);
    }
  };

  /**
   * Validates the user input.
   * After validation, stores(registers) the user data in localStorage for later login flows.
   * If Validation fails, sets respective useState hooks with its respective error.
   */
  // const handleSignUp = async (e: React.BaseSyntheticEvent) => {
  //   e.preventDefault();

  //   const values = Object.fromEntries(
  //     new FormData(e.target as HTMLFormElement).entries()
  //   );

  //   if (values.name === "" || values.email === "" || values.password === "") {
  //     setFormData(checkValidation());
  //   } else if (
  //     values.password !== "" &&
  //     values.password !== values.confirmPassword
  //   ) {
  //     setFormData(checkValidation());
  //     setIncorrectPassword(true);
  //   } else {
  //     setFormData(checkValidation());
  //     setIncorrectPassword(false);
  //     await generateOTP(values.email as string);
  //     localStorage.setItem(
  //       "testUser",
  //       JSON.stringify({
  //         name: values.name,
  //         email: values.email,
  //         password: values.password,
  //       })
  //     );
  //     // setAccountCreated(true)
  //   }
  // };

  const handleSignUp = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const values = Object.fromEntries(
      new FormData(e.target as HTMLFormElement).entries(),
    );

    // 1. Required fields
    if (values.name === "" || values.email === "" || values.password === "") {
      setFormData(checkValidation());
      return;
    }

    // 2. Password strength validation
    if (!validatePassword(values.password as string)) {
      setFormData(checkValidation());
      setError("invalid-password");
      return;
    }

    // 3. Confirm password match
    if (values.password !== values.confirmPassword) {
      setFormData(checkValidation());
      setIncorrectPassword(true);
      return;
    }

    setFormData(checkValidation());
    setIncorrectPassword(false);
    await generateOTP(values.email as string);

    localStorage.setItem(
      "testUser",
      JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
      }),
    );
  };

  // redirects the user to login page
  const handleSignInClick = () => {
    navigate({
      pathname: "/signin",
    });
  };

  const checkPasswordType = (val: string) => {
    if (val === "password") {
      if (pVisibility === true) {
        return "text";
      } else {
        return "password";
      }
    } else {
      if (cPVisibility === true) {
        return "text";
      } else {
        return "password";
      }
    }
  };

  const renderVisibiltyIcon = (val: string) => {
    if (val === "password") {
      if (pVisibility === true) {
        return "visibility";
      } else {
        return "visibility_off";
      }
    } else {
      if (cPVisibility === true) {
        return "visibility";
      } else {
        return "visibility_off";
      }
    }
  };

  const timerValue = 59;
  const [toggleOtpTimer, setToggleOtpTimer] = React.useState(false);
  const [minutes, setMinutes] = React.useState<string>();
  const [seconds, setSeconds] = React.useState<string>();
  const [timer, setTimer] = React.useState(0);

  React.useEffect(() => {
    const minuteFromTimer = Math.floor(timer / 60).toLocaleString();
    setMinutes(minuteFromTimer);
    const secondFromTimer = (timer % 60).toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    });
    setSeconds(secondFromTimer);

    setTimeout(() => {
      if (timer !== 0) {
        setTimer(timer - 1);
      } else {
        setToggleOtpTimer(false);
      }
    }, 1500);
  }, [timer]);

  const resendOtp = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const res = await axios.post("/otps/generate", {
      email: parsedData.email,
    });
    handleTimerReset();
  };
  const handleTimerReset = () => {
    setTimer(timerValue);
    setToggleOtpTimer(true);
  };

  return (
    <div className="auth-form">
      <p className="auth-header">
        {otpSent ? "Verify OTP" : "Create an Account"}
      </p>
      <div>
        {renderElement === "otp-sent" && (
          <form onSubmit={registerUser}>
            <div>
              <p className="input-title">
                Enter the OTP sent on {parsedData.email}
              </p>
              <input
                className="input-main"
                onInput={(e) => {
                  const el = e.target as HTMLInputElement;
                  if (el.value.length > 6) {
                    el.value = el.value.slice(0, 6);
                  }
                  el.value = el.value.replace(/[^0-9]/g, "");
                }}
                value={pin}
                onChange={(e: any) => setPin(e.target.value)}
                name={"pin"}
                placeholder="******"
              />
            </div>

            <div style={{ marginTop: "0.5rem" }}>
              {toggleOtpTimer === false && (
                <div>
                  <p
                    className="label"
                    style={{
                      color: "var(--primary)",
                      cursor: "pointer",
                    }}
                    onClick={resendOtp}
                  >
                    Resend Code
                  </p>
                </div>
              )}
              {toggleOtpTimer === true && (
                <div>
                  <p className="label">
                    Resend Code in {minutes}:{seconds}
                  </p>
                </div>
              )}
            </div>

            <div className="error-container">
              {error === "invalid-otp" && (
                <p className="error-text">Invalid OTP</p>
              )}
              {error === "exists" && (
                <p className="error-text">Email already exists</p>
              )}
              {error === "pin-empty" && (
                <p className="error-text">Required field!</p>
              )}
            </div>

            <button
              type="submit"
              className="large-primary-btn"
              style={{
                width: "100%",
                margin: "2rem 0",
              }}
            >
              {loading ? <Loader /> : "Confirm"}
            </button>

            <p
              className="body"
              style={{
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Already have an account?{" "}
              <span
                className="primary"
                // style={{ cursor: 'pointer' }}
                // onClick={handleSignInClick}
              >
                <Link
                  to={
                    choosenPlan
                      ? `/signin?planId=${choosenPlan}&planAmount=${choosenPlanAmount}`
                      : "/signin"
                  }
                  style={{ textDecoration: "none" }}
                  className="primary"
                >
                  Sign In Now
                </Link>
              </span>
            </p>
          </form>
        )}

        {renderElement === "account-created" && (
          <>
            <p className="register-success-heading">Account Created</p>
            <button
              className="large-primary-btn"
              style={{
                width: "100%",
              }}
              onClick={handleSignInClick}
            >
              Sign In
            </button>
          </>
        )}
        {renderElement === "register" && (
          <form onSubmit={handleSignUp}>
            {formData.map((item, index) => {
              return (
                <div key={index}>
                  <p className="input-title">{item.title}</p>
                  {item.type === "password" ? (
                    <div className="input-container">
                      <input
                        className="input-main"
                        autoComplete={item.type === "password" ? "off" : "on"}
                        type={checkPasswordType(item.name)}
                        defaultValue={item?.value}
                        onChange={handleInputChange}
                        name={item.name}
                        placeholder={item.placeholder}
                      />
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          right: "1rem",
                          color: "black",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (item.name === "password") {
                            setPVisibility(!pVisibility);
                          } else {
                            setCPVisibility(!cPVisibility);
                          }
                        }}
                        className="material-symbols-outlined"
                      >
                        {renderVisibiltyIcon(item.name)}
                      </span>
                    </div>
                  ) : (
                    <input
                      className="input-main"
                      autoComplete={item.type === "password" ? "off" : "on"}
                      type={item.type}
                      defaultValue={item?.value}
                      onChange={handleInputChange}
                      name={item.name}
                      placeholder={item.placeholder}
                    />
                  )}
                  {/* <input
                                        className='input-main'
                                        autoComplete={item.type === "password" ? "off" : "on"}
                                        type={item.type}
                                        defaultValue={item?.value}
                                        onChange={handleInputChange}
                                        name={item.name}
                                        placeholder={item.placeholder}
                                    /> */}
                  <div className="error-container">
                    {item.error && (
                      <p className="error-text required-error-text-space">
                        Required field!
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                gap: "0.5rem",
                maxWidth: "17rem",
              }}
            >
              <input
                type="checkbox"
                checked={acceptPolicy}
                onChange={(e) => setAcceptPolicy(e.target.checked)}
              />
              <p className="body">
                By signing up, you agree to our{" "}
                <span className="primary">
                  <Link
                    to={"https://www.satoplayer.com/terms-of-service"}
                    target="_blank"
                    style={{ textDecoration: "none" }}
                    className="primary"
                  >
                    Terms of Service
                  </Link>
                </span>
                ,{" "}
                <span className="primary">
                  <Link
                    to={"https://www.satoplayer.com/privacy-policy"}
                    target="_blank"
                    style={{ textDecoration: "none" }}
                    className="primary"
                  >
                    Privacy Policy
                  </Link>
                </span>
                , and{" "}
                <span className="primary">
                  <Link
                    to={"https://www.satoplayer.com/dpa"}
                    target="_blank"
                    style={{ textDecoration: "none" }}
                    className="primary"
                  >
                    DPA
                  </Link>
                </span>
              </p>
            </div>

            <div className="error-container" style={{ maxWidth: "17rem" }}>
              {incorrectPassword && (
                <p className="error-text">Password doesn't match</p>
              )}
              {error === "invalid-password" && (
                <p className="error-text">
                  Password must be at least 8 characters with uppercase, number
                  & special character.
                </p>
              )}
              {error === "user-already-exist" && (
                <p className="error-text">Email already exists</p>
              )}
            </div>

            <button
              type="submit"
              className="large-primary-btn"
              disabled={!acceptPolicy}
              style={{
                width: "100%",
              }}
            >
              {loading ? <Loader /> : "Sign Up"}
            </button>

            <p
              className="body"
              style={{
                fontSize: "1rem",
                textAlign: "center",
                marginTop: "1rem",
              }}
            >
              Already have an account?{" "}
              <span
                className="primary"
                // style={{ cursor: 'pointer' }}
                // onClick={handleSignInClick}
              >
                <Link
                  to={
                    choosenPlan
                      ? `/signin?planId=${choosenPlan}&planAmount=${choosenPlanAmount}`
                      : "/signin"
                  }
                  style={{ textDecoration: "none" }}
                  className="primary"
                >
                  Sign In Now
                </Link>
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
