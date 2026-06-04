import React from "react";
import "./create-player.css";
import { useNavigate } from "react-router-dom";
import { config } from "../../utils/default-config";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import Loader from "../Loader";
import Toast from "../Toast";
import Modal from "../Modal";
import ImageRadioGroup from "../ImageRadioButton";
import playerTemplate from "../../database/playerTemplate.json";

type CreatePlayerProps = {
  width?: string;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
  totalLength?: any;
};

const Index = (props: CreatePlayerProps) => {
  const { width, setRefetch, totalLength } = props;
  const navigate = useNavigate();
  const [isLoading, setLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [openModalAdd, setOpenModalAdd] = React.useState<boolean>(false);
  const [playerName, setPlayerName] = React.useState("");
  const [error, setError] = React.useState("");

  const [selectedTemplate, setSelectedTemplate] = React.useState<
    "halcyon" | "moderna" | "sphinx" | "prosper"
  >("halcyon");

  const [activePlan, setActivePlan] = React.useState<any>();

  const handleRedirect = async (id: string) => {
    navigate({ pathname: "/detail", search: `?video=${id}` });
  };

  const showToast = () => {
    setShow(true);
  };

  const hideToast = () => {
    setShow(false);
  };

  const createPlayer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (playerName === "") return setError("emtpy-player-name");
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
      setError("");
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
    }
  };

  React.useEffect(() => {
    fetchSubscription();
  }, []);

  return (
    <>
      <div
        style={{ cursor: "pointer", width: "max-content" }}
        onClick={() => {
          setOpenModalAdd(true);
        }}
        tabIndex={0}
      >
        <img className="w-100" src="./create-player.svg" alt="no image found" />
      </div>
      {/*
      <div className={totalLength < 3 ? 'create-player-container' : "create-player-container-for-grid"}
        tabIndex={0}
        onClick={() => { setOpenModalAdd(true) }}
      >
        <div className='content-wrapper'>
          <div className='create-player-btn-container'>
            {
              isLoading ?
                <Loader />
                :
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <span className="material-symbols-outlined primary"
                    style={{ fontSize: '48px', }}
                  >
                    add
                  </span>
                  <p className='body primary'>Create New Splayer</p>
                </div>
            }
          </div>

        </div>
      </div>
*/}

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
              {error === "emtpy-player-name" && (
                <p className="error-text required-error-text-space">
                  Required field!
                </p>
              )}
            </div>
          </form>
        </div>
      </Modal>

      <Toast show={show} hideToast={hideToast}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <span className="material-symbols-outlined positive">done</span>
          <p className="body" style={{ marginLeft: "1rem" }}>
            Player Created
          </p>
        </div>
      </Toast>
    </>
  );
};

export default Index;
