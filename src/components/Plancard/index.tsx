import React from "react";
import "./plancard.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "../../utils/axios-instance";
import { decodeBase64, encodeBase64 } from "../../utils/base64";
import Loader from "../Loader";
import { loadUserIp } from "../../utils/helper";

type PlancardProps = {
  id: string;
  description: string;
  planName: string;
  metadata?: any;
  usage?: any;
  amout: string;
  currency: string;
  maxStorage?: number;
  maxPlays?: number;
  videoUploadLimitSize: number;
  totalVideoUploadLimit: number;
  period: string;
  disable?: boolean;
};

const Index = (props: PlancardProps) => {
  const {
    id,
    description,
    planName,
    metadata,
    usage,
    amout,
    currency,
    maxPlays,
    maxStorage,
    videoUploadLimitSize,
    totalVideoUploadLimit,
    period,
    disable,
  } = props;

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState("");
  const s_subs = decodeBase64(Cookies.get("s_subs") as string);
  const [isloading, setLoading] = React.useState(false);
  const [countryCodeState, setCountryCodeState] = React.useState("");

  React.useEffect(() => {
    (async () => {
      const countryCode = await loadUserIp();
      setCountryCodeState(countryCode);
    })();
  }, []);

  const handleClickSubscribe = async () => {
    setLoading(true);
    try {
      const countryCode = await loadUserIp();
      const res = await axios.get("/subscriptions", {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      navigate({
        pathname: `/checkout/${countryCode === "IN" ? "IN" : countryCode}`,
        search: `?planId=${id}`,
      });
    } catch (error: any) {
      setLoading(false);
      if (error.response.status === 401) {
        navigate({
          pathname: "/register",
          search: `?planId=${id}&planAmount=${Number(amout) / 100}`,
        });
      }
      if (error.response.status === 404) {
        navigate({
          pathname: `/checkout/${countryCodeState === "IN" ? "IN" : countryCodeState}`,
          search: `?planId=${id}`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="plancard-container"
      style={{
        position: "relative",
        height: "54rem",
        // backgroundColor:
        //   Number(amout) === 0 ? "var(--white)" : "var(--surface)",
        border: "1px solid",
        borderColor:
          planName.toLowerCase() === "pro" ? "var(--primary)" : "var(--stroke)",
      }}
    >
      <div style={{ padding: "2rem" }}>
        <p className="heading">{planName}</p>
        <p
          className="body"
          style={{
            marginTop: "0.5rem",
            color: "var(--textSecondary)",
            fontFamily: "Satoshi-Regular",
          }}
        >
          {description}
        </p>

        {planName.toLowerCase() === "pro" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: "2rem",
              right: "2rem",
            }}
          >
            <img
              src={"/Popular.svg"}
              alt="404 Illustration"
              style={{ width: "90px", maxWidth: 380 }}
            ></img>
          </div>
        )}

        {Number(amout) === 0 ? (
          <p className="subtitle-two" style={{ marginTop: "2rem" }}>
            Free{" "}
          </p>
        ) : period === "monthly" ? (
          <p className="subtitle-two" style={{ marginTop: "2rem" }}>
            {currency + " " + Number(amout) / 100}/month
          </p>
        ) : (
          <p className="subtitle-two" style={{ marginTop: "2rem" }}>
            {currency + " " + (Number(amout || 0) / 100 / 12).toFixed(2)}/month
          </p>
        )}
        {/* {Number(amout) !== 0 && <p className="label">billed {period}</p>} */}
        <p
          className="label"
          style={{
            visibility: Number(amout) !== 0 ? "visible" : "hidden",
          }}
        >
          billed {period}
        </p>

        <div style={{ width: "100%", marginTop: "2rem" }}>
          {planName === "0" ? (
            <button
              className={"large-primary-btn"}
              style={{
                width: "100%",
              }}
              disabled
            >
              Coming Soon
            </button>
          ) : (
            <button
              className={
                Number(amout) === 0
                  ? "large-secondary-btn"
                  : "large-primary-btn"
              }
              style={{
                width: "100%",
              }}
              onClick={handleClickSubscribe}
              // disabled={id === s_subs}
            >
              {isloading ? (
                <Loader
                  borderColor={
                    Number(amout) === 0
                      ? "var(--textSecondary)"
                      : "var(--white)"
                  }
                />
              ) : id === s_subs ? (
                // "Current Plan"
                "Subscribe"
              ) : (
                "Subscribe"
              )}
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          padding: "2rem",
          borderTop: "1px solid",
          borderTopColor:
            planName.toLowerCase() === "pro"
              ? "var(--primary)"
              : "var(--stroke)",
        }}
      >
        <div>
          <p className="body placeholder">Key highlights</p>
        </div>
        <div>
          {/* <li>
              {totalVideoUploadLimit === 0 ? (
                <p
                  className="body placeholder"
                  style={{ fontFamily: "Satoshi-Regular" }}
                >
                  Storage: Unlimited
                </p>
              ) : (
                <>
                  <p
                    className="body placeholder"
                    style={{ fontFamily: "Satoshi-Regular" }}
                  >
                    Storage: {totalVideoUploadLimit} videos
                  </p>
                </>
              )}
            </li> */}

          <div className="plancard-feature">
            <div>
              <span className="material-symbols-outlined primary">
                verified
              </span>
            </div>
            <div>
              {totalVideoUploadLimit === 0 ? (
                <p className="body" style={{ fontFamily: "Satoshi-Regular" }}>
                  Storage: Unlimited
                </p>
              ) : (
                <>
                  <p className="body" style={{ fontFamily: "Satoshi-Regular" }}>
                    Storage: {totalVideoUploadLimit} videos
                    {/* {planName === "Pro" ? totalVideoUploadLimit : 10} */}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* <li>
              {videoUploadLimitSize === 0 ? (
                <p
                  className="body placeholder"
                  style={{ fontFamily: "Satoshi-Regular" }}
                >
                  Size: Unlimited
                </p>
              ) : (
                <p
                  className="body placeholder"
                  style={{ fontFamily: "Satoshi-Regular" }}
                >
                  Size: {videoUploadLimitSize}MB/video
                </p>
              )}
            </li> */}

          <div className="plancard-feature">
            <div>
              <span className="material-symbols-outlined primary">
                verified
              </span>
            </div>
            <div>
              {videoUploadLimitSize === 0 ? (
                <p className="body" style={{ fontFamily: "Satoshi-Regular" }}>
                  Size: Unlimited
                </p>
              ) : (
                <p className="body" style={{ fontFamily: "Satoshi-Regular" }}>
                  Size: {videoUploadLimitSize}MB/video
                </p>
              )}
            </div>
          </div>

          <div className="plancard-feature">
            <div>
              <span className="material-symbols-outlined primary">
                verified
              </span>
            </div>
            <div>
              <p className="body"> Bandwidth: Unlimited</p>
            </div>
          </div>

          <div className="plancard-feature">
            <div>
              <span className="material-symbols-outlined primary">
                verified
              </span>
            </div>
            <div>
              <p className="body"> Video Duration: Unlimited</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <p className="body placeholder">What else you get</p>
        </div>

        {planName.toLowerCase() === "starter" && (
          <>
            <div className="plancard-feature">
              <div>
                <span className="material-symbols-outlined primary">
                  verified
                </span>
              </div>
              <div>
                <p className="body">Free video storage</p>
              </div>
            </div>

            <div className="plancard-feature">
              <div>
                <span className="material-symbols-outlined primary">
                  verified
                </span>
              </div>
              <div>
                <p className="body">Free video hosting</p>
              </div>
            </div>

            <div className="plancard-feature">
              <div>
                <span className="material-symbols-outlined primary">
                  verified
                </span>
              </div>
              <div>
                <p className="body">Unlimited custom video players</p>
              </div>
            </div>

            <div className="plancard-feature">
              <div>
                <span className="material-symbols-outlined primary">
                  verified
                </span>
              </div>
              <div>
                <p className="body">Custom logo</p>
              </div>
            </div>

            <div className="plancard-feature">
              <div>
                <span className="material-symbols-outlined primary">
                  verified
                </span>
              </div>
              <div>
                <p className="body">Unlimited player embeds</p>
              </div>
            </div>

            <div className="plancard-feature">
              <div>
                <span className="material-symbols-outlined primary">
                  verified
                </span>
              </div>
              <div>
                <p className="body">Advanced 24/7 support</p>
              </div>
            </div>

            <div className="plancard-feature">
              <div>
                <span className="material-symbols-outlined primary">
                  verified
                </span>
              </div>
              <div>
                <p className="body">Storage cleanup</p>
              </div>
            </div>
          </>
        )}

        {planName.toLowerCase() === "pro" && (
          <>
            <div className="plancard-feature">
              <div>
                <span className="material-symbols-outlined primary">
                  verified
                </span>
              </div>
              <div>
                <p className="body">Everything in Starter</p>
              </div>
            </div>

            <div className="plancard-feature">
              <div>
                <span className="material-symbols-outlined primary">
                  verified
                </span>
              </div>
              <div>
                <p className="body">Video player themes</p>
              </div>
            </div>

            <div className="plancard-feature">
              <div>
                <span className="material-symbols-outlined primary">
                  verified
                </span>
              </div>
              <div>
                <p className="body">Speech-to-text caption</p>
              </div>
            </div>
          </>
        )}

        {planName.toLowerCase() === "advanced" && (
          <>
            <div className="plancard-feature">
              <div>
                <span className="material-symbols-outlined primary">
                  verified
                </span>
              </div>
              <div>
                <p className="body">Everything in Starter and Pro</p>
              </div>
            </div>

            <div className="plancard-feature">
              <div>
                <span className="material-symbols-outlined primary">
                  verified
                </span>
              </div>
              <div>
                <p className="body">In-video CTA (call-to-action)</p>
              </div>
            </div>

            <div className="plancard-feature">
              <div>
                <span className="material-symbols-outlined primary">
                  verified
                </span>
              </div>
              <div>
                <p className="body">Video transcoding</p>
              </div>
            </div>

            <div className="plancard-feature">
              <div>
                <span className="material-symbols-outlined primary">
                  verified
                </span>
              </div>
              <div>
                <p className="body">Upload multiple captions</p>
              </div>
            </div>

            <div className="plancard-feature">
              <div>
                <span className="material-symbols-outlined primary">
                  verified
                </span>
              </div>
              <div>
                <p className="body">Super progress bar</p>
              </div>
            </div>
          </>
        )}

        <div style={{ position: "absolute", bottom: "2rem" }}>
          <Link
            to={
              countryCodeState === "IN"
                ? "https://www.satoplayer.com/pricing-in#full-features"
                : "https://www.satoplayer.com/pricing#full-features"
            }
            target="_blank"
            style={{
              textDecoration: "none",
            }}
            className="primary"
          >
            See full features
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
