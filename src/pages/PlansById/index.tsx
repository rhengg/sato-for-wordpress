import React from "react";
import Plancard from "../../components/Plancard";
import "./plans.css";
import axios from "../../utils/axios-instance";
import Loader from "../../components/Loader";
import CustomPlancard from "../../components/CustomPlancard";

const PlansById = () => {
  const params = new URLSearchParams(window.location.search);
  const planById = params.get("planId");

  const [plans, setPlans] = React.useState<any>();
  const [isLoading, setLoading] = React.useState(false);

  const [toggle, setToggle] = React.useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/plans/${planById}`);
      // console.log("fetching plans", res);
      setPlans(res.data?.plan);
    } catch (error) {
      console.log("error fetching plans", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPlans();
  }, []);

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
        <p className="heading">Choose the plan that fits your needs</p>
        <p
          className="subtitle-one"
          style={{
            fontFamily: "Satoshi-Regular",
            color: "var(--textSecondary)",
          }}
        >
          Whether you're just starting out or going pro — we’ve got you covered
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "start",
          justifyContent: "center",
          gap: "2rem",
          marginTop: "3rem",
          padding: "0 1rem",
        }}
      >
        {plans && (
          <Plancard
            id={plans?.id}
            description={plans?.description}
            planName={plans?.name}
            metadata={plans.metadata}
            maxPlays={plans.max_plays}
            maxStorage={plans.max_storage}
            amout={plans.amount}
            currency={plans.currency}
            videoUploadLimitSize={plans.per_video_upload_limit}
            totalVideoUploadLimit={plans.total_video_upload_limit}
            period={plans.period}
          />
        )}
      </div>
    </div>
  );
};

export default PlansById;
