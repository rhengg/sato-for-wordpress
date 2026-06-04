import React from "react";
import Plancard from "../../components/Plancard";
import "./plans.css";
import axios from "../../utils/axios-instance";
import Loader from "../../components/Loader";
import CustomPlancard from "../../components/CustomPlancard";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const Plans = () => {
  const { country } = useParams(); // IN, US, etc
  const [plans, setPlans] = React.useState<any[]>([]);
  const [isLoading, setLoading] = React.useState(true);
  const [toggle, setToggle] = React.useState(true);
  const [subcribedPlan, setSubcribedPlan] = React.useState<any>();

  const fetchPlans = async () => {
    try {
      const token = Cookies.get("s-token");
      const currency = country === "IN" ? "INR" : "USD";

      const filterAndSort = (data: any[]) =>
        data
          .filter((i: any) => i.plan.currency === currency)
          .sort((a: any, b: any) => a.plan.amount - b.plan.amount);

      let endpoint = "/plans";
      let headers: any = {};
      let subscribedPlanData: any = null;
      let subscribedPlanId: string | null = null;

      if (token) {
        headers = { Authorization: `Bearer ${token}` };

        try {
          const subRes = await axios.get("/subscriptions", { headers });

          if (subRes?.data?.subscription?.plan_id) {
            subscribedPlanId = subRes.data.subscription.plan_id;
            endpoint = "/subscriptions/eligible-plans";

            const subscribedPlanRes = await axios.get(
              `/plans/${subscribedPlanId}`,
              { headers },
            );

            subscribedPlanData = subscribedPlanRes?.data;
          }
        } catch (err) {
          console.log("subscription fetch failed", err);
          endpoint = "/plans";
        }
      }

      const { data } = await axios.get(endpoint, { headers });

      let finalPlans = filterAndSort(data);

      // Inject subscribed plan if it's NOT already in the list
      if (
        subscribedPlanData &&
        !finalPlans.some((p: any) => p.id === subscribedPlanId)
      ) {
        finalPlans = [...finalPlans, subscribedPlanData];
      }

      // Sort again after adding (important)
      finalPlans = filterAndSort(finalPlans);

      // Mark subscribed plan
      finalPlans = finalPlans.map((plan: any) => ({
        ...plan,
        isSubscribed: plan.id === subscribedPlanId,
      }));

      // Set states
      setPlans(finalPlans);
      setSubcribedPlan(subscribedPlanData);
    } catch (error) {
      console.log("error fetching plans", error);
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
    <div className="main-page-wrapper mobile-page-wrapper">
      <div className="plan-header-container">
        <div
          className="plan-description-wrapper"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <p className="heading">Choose the plan that fits your needs</p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* <p className="body primary"> {"\uD83C\uDF0E"} For Everyone Else</p> */}
          <p className={!toggle ? "body primary" : "body"}>Monthly</p>
          <label className="toggle-container">
            <input
              name={"toogle-currency"}
              className="toggle-button"
              type="checkbox"
              defaultChecked={toggle}
              checked={toggle}
              onChange={(e) => {
                setToggle(e.target.checked);
              }}
            />
            <span className="toggle-circle"></span>
          </label>
          {/* <p className="body primary">
          {"\uD83C\uDDEE\uD83C\uDDF3"} For Indian Customers
        </p> */}
          <p className={toggle ? "body primary" : "body"}>
            Yearly{" "}
            <span style={{ color: "var(--textPrimary)" }}>
              (Save up to 20%)
            </span>
          </p>
        </div>
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
        {plans
          // .slice(0, 1)
          .filter((i: any) => i.plan.amount === 0)
          .map(({ plan }: any, index: number) => {
            return (
              <Plancard
                id={plan.id}
                key={index}
                description={plan.description}
                planName={plan.name}
                metadata={plan.metadata}
                maxPlays={plan.max_plays}
                maxStorage={plan.max_storage}
                amout={plan.amount}
                currency={plan.currency}
                videoUploadLimitSize={plan.per_video_upload_limit}
                totalVideoUploadLimit={plan.total_video_upload_limit}
                period={plan.period}
              />
            );
          })}

        {plans
          // .slice(1)
          .filter((i: any) => i.plan.amount > 0)
          .filter((i: any) =>
            toggle ? i.plan.period === "yearly" : i.plan.period === "monthly",
          )
          .map(({ plan }: any, index: number) => {
            return (
              <Plancard
                id={plan.id}
                key={index}
                description={plan.description}
                planName={plan.name}
                metadata={plan.metadata}
                maxPlays={plan.max_plays}
                maxStorage={plan.max_storage}
                amout={plan.amount}
                currency={plan.currency}
                videoUploadLimitSize={plan.per_video_upload_limit}
                totalVideoUploadLimit={plan.total_video_upload_limit}
                period={plan.period}
              />
            );
          })}

        {/*
        <Plancard
          id={'demo id'}
          description={'Best for businesses with a massive video library and video player requirement'}
          planName={'Pro'}
          amout={'800'}
          currency={'USD'}
          videoUploadLimitSize={0}
          totalVideoUploadLimit={0}
          period={'monthly'}
          disable
        />
*/}

        <CustomPlancard />
      </div>

      {/* <div style={{ marginTop: "2rem" }}>
        <div className="pricing-module">
          <p className="body">
            Splay is free for all beta users till 31 January 2025. We will
            notify you once pricing plans are updated.
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default Plans;
