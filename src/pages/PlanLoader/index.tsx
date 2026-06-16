import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import config from "../../config";

function PlansLoader() {
  const navigate = useNavigate();
  const FALLBACK_COUNTRY = "US";

  React.useEffect(() => {
    axios
      .get(config.IP_API)
      .then((response) => {
        const code =
          response?.data?.countryCode?.toUpperCase() || FALLBACK_COUNTRY;
        navigate(`/plans/${code}`);
      })
      .catch((error) => {
        console.error("Error fetching country:", error);

        // fallback redirect
        navigate(`/plans/${FALLBACK_COUNTRY}`);
      });
  }, [navigate]);

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
}

export default PlansLoader;
