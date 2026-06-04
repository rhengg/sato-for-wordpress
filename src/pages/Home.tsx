import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Error from "../components/Error";
import CreatePlayer from "../components/CreatePlayer";
import axios from "../utils/axios-instance";
import Cookies from "js-cookie";
import Loader from "../components/Loader";
import {
  videoUrlUpdate,
  videoUrlExtensionUpdate,
  videoTranscript,
  videoconfigupdate,
} from "./Detail";
import { decodeBase64, encodeBase64 } from "../utils/base64";
import MediaLibrary from "./MediaLibrary";
import Modal from "../components/Modal";
import { config } from "../utils/default-config";
import VideoPlayerCard from "../components/PlayerCard";
import ImageRadioGroup from "../components/ImageRadioButton";
import playerTemplate from "../database/playerTemplate.json";
import { loadUserIp } from "../utils/helper";

/**
 * This page will render after login the system(i.e home page).
 * Artists data are listed in this page.
 * Artist data can be search, filter from this page,
 * Card component is used which renders the profile card.
 * Count Card component is used which renders music platform analytics card.
 * Dropdown component is used which renders dropdown to filter the data by gender and country.
 * Error component is used which renders no artist found or error fetching data.
 */

const Home = () => {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = React.useState("");
  const [data, setData] = React.useState<any>([]);
  const [error, setError] = React.useState(false);
  const [refetch, setRefetch] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);

  const [activePlan, setActivePlan] = React.useState<any>();
  const [subscription, setSubscription] = React.useState<any>();

  const s_pay = decodeBase64(Cookies.get("s-pay") as string);
  const user = decodeBase64(Cookies.get("s-user") as string);

  const wfCodeStorage = sessionStorage.getItem("webflow-code");
  const wfCode = JSON.parse(wfCodeStorage as string);

  const sessionStorageData = sessionStorage.getItem("choosen-plan");
  const choosenPlan = JSON.parse(sessionStorageData as string);

  React.useEffect(() => {
    if (wfCode) {
      navigate({
        pathname: "/callback/wb-plugin",
        search: `code=${wfCode?.code}`,
      });
    }
  }, [wfCode]);

  // Handle choosen plan from landing page using session storage
  const fromLandingPage = sessionStorage.getItem("from-landing-page");
  const choosenPlanFromLandingPage = JSON.parse(fromLandingPage as string);

  React.useEffect(() => {
    (async () => {
      const countryCode = await loadUserIp();
      if (choosenPlanFromLandingPage) {
        navigate({
          pathname: `/checkout/${countryCode}`,
          search: `planId=${choosenPlanFromLandingPage?.planId}`,
        });
      }
    })();
  }, [choosenPlanFromLandingPage]);

  // Handle oauth flow for canva using session storage
  const oAuthData = sessionStorage.getItem("o-auth");
  const oAuthObj = JSON.parse(oAuthData as any);

  React.useEffect(() => {
    if (oAuthObj) {
      navigate({
        pathname: oAuthObj?.url?.pathname,
        search: oAuthObj?.url?.search,
      });
    }
  }, [oAuthObj]);

  const [openModalAdd, setOpenModalAdd] = React.useState<boolean>(false);
  const [playerName, setPlayerName] = React.useState("");
  const [errorPlayer, setErrorPlayer] = React.useState("");

  const [selectedTemplate, setSelectedTemplate] = React.useState<
    "halcyon" | "moderna" | "sphinx" | "prosper"
  >("halcyon");

  const handleRedirect = async (id: string) => {
    navigate({ pathname: "/detail", search: `?video=${id}` });
  };

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      setSubscription(res?.data?.subscription);
      const plans = await axios.get(`/plans/${res.data.subscription.plan_id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // console.log("plan details", plans?.data);
      setActivePlan(plans.data?.plan);

      // console.log("success subscriptions fetch", res.data);

      if (
        (res.data?.subscription?.status as string).toLowerCase() !== "active"
      ) {
        navigate("/profile");
        // navigate({
        //   pathname: "/checkout",
        //   search: `?planId=${res.data.subscription?.plan_id}&s_id=${res.data.subscription?.provider_subscription_id}`,
        // });
      } else {
        Cookies.set("s_subs", encodeBase64(res.data.subscription?.plan_id), {
          expires: 30,
          secure: true,
          sameSite: "Strict",
        });
        if (wfCode?.code) {
          navigate({
            pathname: "/callback/wb-plugin",
            search: `code=${wfCode?.code}`,
          });
        }
      }
    } catch (error: any) {
      setLoading(false);
      console.log("error fetching subscription", error);
      if (error.response.status === 401) {
        navigate({ pathname: "/signin" });
      }
      if (error?.response?.status === 404) {
        if (wfCode?.code) {
          navigate({
            pathname: "/callback/wb-plugin",
            search: `code=${wfCode?.code}`,
          });
        } else {
          navigate("/plans");
        }
      }
    }
  };

  React.useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchPlayer = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get("/players", {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      setData(res.data);
      setLoading(false);
    } catch (error: any) {
      if (error.response.status === 401) {
        navigate({ pathname: "/signin" });
      }
      if (error?.response?.status === 402) {
        navigate({ pathname: "/plans" });
      }
      setError(true);
      setLoading(false);
      console.log("error fetching player", error);
    }
  };

  React.useEffect(() => {
    fetchPlayer();
    videoUrlUpdate.value = "";
    videoUrlExtensionUpdate.value = "";
    videoTranscript.value = "";
    if (videoconfigupdate.value.premium?.playerCTA) {
      videoconfigupdate.value.premium.playerCTA.description = "";
      videoconfigupdate.value.premium.playerCTA.heading = "";
      videoconfigupdate.value.premium.playerCTA.url = "";
      videoconfigupdate.value.premium.playerCTA.buttonText = "";
    }
  }, [refetch]);

  const createPlayer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (playerName === "") return setErrorPlayer("emtpy-player-name");
    try {
      setLoading(true);
      const data = {
        name: playerName,
        config: config[selectedTemplate],
        // "media_source": 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
        // "media_type": 'm3u8',
      };

      const res = await axios.post("/players", data, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      setLoading(false);
      setOpenModalAdd(false);
      await handleRedirect(res.data?.id);
      // setTimeout(() => {
      //   setRefetch(Math.random())
      // }, 500)
      // showToast()
    } catch (error) {
      setLoading(false);
      console.log("error creating player", error);
      setErrorPlayer("");
    }
  };

  // const searchData =
  //   data &&
  //   data.filter((item: any) => {
  //     if (searchTitle === "") {
  //       return item;
  //     } else if (item.name.toLowerCase().includes(searchTitle?.toLowerCase())) {
  //       return item;
  //     }
  //   });

  const searchData =
    data &&
    data
      .filter((item: any) => {
        if (searchTitle === "") {
          return true;
        } else if (
          item.name.toLowerCase().includes(searchTitle.toLowerCase())
        ) {
          return true;
        }
        return false;
      })
      .sort((a: any, b: any) => {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      });

  //redirects the user to detail page when interacted with card button.
  const handleCardClick = (id: string) => {
    navigate({ pathname: "/detail", search: `?video=${id}` });
  };

  // Needs to be removed in future
  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/subscriptions/invoices`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
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

  if (error) return <Error errorMessage="Error fetching data" />;

  return (
    <div className="main-page-wrapper">
      {/*
        <p className="heading">
          {`${user.name.charAt(0).toUpperCase() + user.name.slice(1)}'s Dashboard`}
        </p>
        */}
      <div className="search-create-container">
        <div className="w-100">
          <button
            className="large-primary-btn m-100"
            onClick={() => {
              setOpenModalAdd(true);
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                columnGap: "0.25rem",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontWeight: "bold" }}
              >
                add
              </span>
              Create New Player
            </div>
          </button>
        </div>

        <div className="w-100" style={{ position: "relative" }}>
          <span
            className="material-symbols-outlined placeholder"
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            search
          </span>
          <input
            className="input-main custom-input-width"
            type={"text"}
            name={"search"}
            placeholder={"Search Video Player Name..."}
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </div>

        <Modal
          isOpen={openModalAdd}
          setOpen={setOpenModalAdd}
          title={`Create a New Player`}
          size="lg"
        >
          <div style={{ marginTop: "2rem" }}>
            <form onSubmit={createPlayer}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "1rem",
                }}
              >
                <div>
                  <p className="body">Player name</p>
                  <input
                    className="input-main"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      marginTop: "0.5rem",
                    }}
                    value={playerName}
                    onChange={(e: any) => setPlayerName(e.target.value)}
                    name={"player-name"}
                    placeholder="Enter player name"
                    maxLength={60}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="large-primary-btn"
                    disabled={playerName === ""}
                    style={{
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: "0.25rem",
                      }}
                    >
                      Continue
                      <span
                        className="material-symbols-outlined"
                        style={{ fontWeight: "bold" }}
                      >
                        arrow_forward
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              <div
                style={{
                  background: "var(--surface)",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--stroke)",
                  padding: "0.5rem 1rem",
                  marginTop: "2rem",
                }}
              >
                <p className="body" style={{ margin: "1rem 0" }}>
                  Choose a player theme
                </p>

                <ImageRadioGroup
                  options={playerTemplate}
                  value={selectedTemplate}
                  onChange={setSelectedTemplate}
                  name="template-radio"
                  activePlan={activePlan}
                />
              </div>

              <div className="error-container">
                {errorPlayer === "emtpy-player-name" && (
                  <p className="error-text required-error-text-space">
                    Required field!
                  </p>
                )}
              </div>
            </form>
          </div>
        </Modal>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          margin: "2.5rem 0 1rem 0",
        }}
      >
        <div
          style={{
            width: "max-content",
          }}
        >
          <p className="subtitle-one">Video Players</p>
        </div>
        {data && data.length > 7 && (
          <button
            className="small-secondary-btn"
            onClick={() => {
              navigate("/all-players");
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
        )}
      </div>

      {searchData === null || searchData.length === 0 ? (
        <CreatePlayer setRefetch={setRefetch} totalLength={searchData.length} />
      ) : (
        <div className={searchData.length < 4 ? "home-card-grid" : "card-grid"}>
          {searchData.slice(0, 8).map((item: any, index: number) => {
            return (
              <VideoPlayerCard
                key={index}
                data={item}
                setRefetch={setRefetch}
                totalLength={searchData.length}
                handleCardClick={handleCardClick}
              />
            );
          })}
          {/*
          {searchData.length < 4 &&
            <CreatePlayer setRefetch={setRefetch}
              totalLength={searchData.length}
            />
          }
          */}
        </div>
      )}

      <div style={{ borderTop: "1px solid var(--stroke)", marginTop: "4rem" }}>
        <MediaLibrary length={10} />
      </div>
    </div>
  );
};

export default Home;
