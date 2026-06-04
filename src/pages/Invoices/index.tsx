import React from "react";
import "./invoices.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import Loader from "../../components/Loader";
import config from "../../config";

const Invoices = (props: any) => {
  const { length } = props;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLoading, setLoading] = React.useState(true);

  const [data, setData] = React.useState<any>([]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/subscriptions/invoices`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // console.log('invoices', res.data)
      if (length === 5) {
        setData(res.data?.slice(0, 5));
      } else {
        setData(res.data);
      }
    } catch (error) {
      console.log("error fetching media", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInvoice();
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    // return date.toLocaleDateString("en-IN");
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDownload = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (isLoading)
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
          <p className={pathname != "/invoices" ? "subtitle-one" : "heading"}>
            Your Payment Receipts
          </p>
        </div>
        {/* {pathname != "/invoices" && data && data.length > 4 && (
          <button
            className="small-secondary-btn"
            onClick={() => {
              navigate("/invoices");
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "max-content",
              }}
            >
              See All
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "1.5rem" }}
              >
                keyboard_double_arrow_right
              </span>
            </div>
          </button>
        )} */}
      </div>

      <p
        className="label textSecondary"
        style={{
          marginTop: "1rem",
        }}
      >
        All your payment receipts are listed here.
      </p>

      {data && data.length > 0 ? (
        <div className="plan-list">
          {[...data]
            .sort(
              (a: any, b: any) =>
                new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime(),
            )
            .map((inv: any, index: number) => (
              <div
                key={inv.id}
                className="plan-item"
                style={{
                  borderBottom:
                    index === data.length - 1
                      ? "none"
                      : "1px solid var(--stroke)",
                  paddingBottom: index === data.length - 1 ? "1rem" : "1rem",
                  paddingTop: index === data.length - 1 ? "1rem" : "1rem",
                }}
              >
                <div className="plan-details">
                  <span className="body">{inv.plan_name}</span>
                  {/* 
                <span className="dot">•</span>
                <span className="label">
                  Billing Cycle: {formatDate(inv.billing_start)} -{" "}
                  {formatDate(inv.billing_end)}
                </span> */}
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
                  // to={inv.short_url}
                  to={new URL(inv.short_url, config.IMAGE_CDN_URL).toString()}
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    // fontWeight: "bold",
                  }}
                  className="primary"
                >
                  View
                </Link>

                {/* <button
                className="large-primary-btn"
                onClick={() => handleDownload(inv.short_url)}
              >
                {inv.status === "paid" ? "View" : "Pay now"}
              </button> */}
              </div>
            ))}
        </div>
      ) : (
        <p className="body">No receipts found</p>
      )}
    </div>
  );
};

export default Invoices;
