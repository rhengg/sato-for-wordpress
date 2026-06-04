import React from "react";
import axios from "../../utils/axios-instance";
import config from "../../config";

const Oauth = () => {
  const params = new URLSearchParams(location.search);
  const [appDetails, setAppDetails] = React.useState<any>();

  const handleOauth = async () => {
    try {
      const res = await axios.get(`/oauth/authorize?${location.search}`);
      console.log("res", res.data);
      setAppDetails(res.data);
      sessionStorage.removeItem("o-auth");
    } catch (error) {
      console.log("ee", error);
    }
  };

  params.append("approved", "true");
  const approveUrl = `${config.BASE_URL}/oauth/authorize?${params.toString()}`;

  React.useEffect(() => {
    handleOauth();
  }, []);

  return (
    <div className="main-page-wrapper">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <p className="heading">
          {appDetails?.client_name} wants to access your data
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <button
          className="large-primary-btn"
          onClick={() => (window.location.href = approveUrl)}
        >
          Approve
        </button>
      </div>
    </div>
  );
};

export default Oauth;
