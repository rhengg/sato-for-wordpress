import React from "react";
import { useNavigate } from "react-router-dom";
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
import MediaLibrary from "./MediaLibrary";
import Modal from "../components/Modal";
import { config } from "../utils/default-config";
import ImageRadioGroup from "../components/ImageRadioButton";
import playerTemplate from "../database/playerTemplate.json";
import { timeAgo } from "../utils/helper";
import Toast from "../components/Toast";

const Home = () => {
  const [searchTitle, setSearchTitle] = React.useState("");
  const [data, setData] = React.useState<any>([]);
  const [error, setError] = React.useState(false);
  const [refetch, setRefetch] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);

  const [activePlan, setActivePlan] = React.useState<any>();
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
  const [show, setShow] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [showCopy, setShowCopy] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [duplicateData, setDuplicateData] = React.useState<any>();
  const [deleteData, setDeleteData] = React.useState<any>();
  const [page, setPage] = React.useState(1);
  const [openModalAdd, setOpenModalAdd] = React.useState<boolean>(false);
  const [playerName, setPlayerName] = React.useState("");
  const [errorPlayer, setErrorPlayer] = React.useState("");
  const [selectedTemplate, setSelectedTemplate] = React.useState<
    "halcyon" | "moderna" | "sphinx" | "prosper"
  >("halcyon");
  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handleRedirect = (id: string) => {
    window.location.href = `${window.location.pathname}?page=sato-player-detail&video=${id}`;
  };

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      const plans = await axios.get(`/plans/${res.data.subscription.plan_id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      console.log("/subscription", res.data);
      console.log("/plans/id", plans.data);

      setActivePlan(plans.data?.plan);
      // if (
      //   (res.data?.subscription?.status as string).toLowerCase() !== "active"
      // ) {
      //   window.location.href = `${window.location.pathname}?page=sato-profile`;
      // } else {
      //   Cookies.set("s_subs", encodeBase64(res.data.subscription?.plan_id), {
      //     expires: 30,
      //     secure: true,
      //     sameSite: "Strict",
      //   });
      // }
    } catch (error: any) {
      setLoading(false);
      console.log("error fetching subscription", error);
      // if (error.response.status === 401) {
      //   window.location.href = `${window.location.pathname}?page=sato-signin`;
      // }
      // if (error?.response?.status === 404) {
      //   window.location.href = `${window.location.pathname}?page=sato-profile`;
      // }
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
      // if (error.response.status === 401) {
      //   window.location.href = `${window.location.pathname}?page=sato-signin`;
      // }
      // if (error?.response?.status === 402) {
      //   window.location.href = `${window.location.pathname}?page=sato-plans`;
      // }
      setError(true);
      setLoading(false);
      console.log("error fetching player", error);
    }
  };

  const showToast = () => {
    setShow(true);
  };

  const hideToast = () => {
    setShow(false);
  };

  const showToastDelete = () => {
    setShowDelete(true);
  };

  const hideToastDelete = () => {
    setShowDelete(false);
  };

  const showToastCopy = () => {
    setShowCopy(true);
  };

  const hideToastCopy = () => {
    setShowCopy(false);
  };

  const handleCopyClipboard = async (val: string) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopied(true);
    } catch (error) {
      console.log("Failed to copy text: ", error);
      setCopied(false);
    }
  };

  const duplicatePlayer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const newdata = {
        name: duplicateData.name.concat(
          ` copy ${Math.floor(100000 + Math.random() * 900000)}`,
        ),
        config: duplicateData.config,
      };
      await axios.post("/players", newdata, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      setOpenModal(false);
      showToast();
      setDuplicateData(null);
      setTimeout(() => {
        setRefetch(Math.random());
      }, 800);
    } catch (error) {
      console.log("error duplicating player", error);
    }
  };

  const deletePlayer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await axios.delete(`/players/${deleteData.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      setOpenModalDelete(false);
      showToastDelete();
      setDeleteData(null);
      setTimeout(() => {
        setRefetch(Math.random());
      }, 800);
    } catch (error) {
      console.log("error deleting player", error);
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
      };

      const res = await axios.post("/players", data, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      setLoading(false);
      setOpenModalAdd(false);
      handleRedirect(res.data?.id);
    } catch (error) {
      setLoading(false);
      console.log("error creating player", error);
      setErrorPlayer("");
    }
  };

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

  const truncate = (text: string = "", maxLength = 40): string => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      maxLength = 30; // mobile limit
    }
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
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
          height: "100%",
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
            style={{
              borderRadius: "0.25rem",
              paddingLeft: "2.5rem",
              width: "22rem",
            }}
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
          marginTop: "1.5rem",
          marginBottom: "0.5rem",
        }}
      >
        <div
          style={{
            width: "max-content",
          }}
        >
          <p className="subtitle-two">Video Players</p>
        </div>
      </div>

      {searchData === null || searchData.length === 0 ? (
        <CreatePlayer setRefetch={setRefetch} totalLength={searchData.length} />
      ) : (
        <div
          style={{
            width: "100%",
            paddingRight: "10px",
          }}
        >
          <div
            style={{
              display: "grid",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              alignItems: "center",
              gridTemplateColumns: "2fr 1fr 2fr 1fr",
              columnGap: "2rem",
            }}
          >
            <span className="link textPrimary">Player Name</span>
            <span className="link textPrimary">Updated at</span>
            <span className="link textPrimary">Short Code</span>
            <span className="link textPrimary">Actions</span>
          </div>

          <div style={{ width: "100%", height: "23rem", overflow: "auto" }}>
            {data
              .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
              .map((item: any, idx: number) => (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "var(--surfaceVariant)",
                    alignItems: "center",
                    marginBottom: "1rem",
                    gridTemplateColumns: "2fr 1fr 2fr 1fr",
                    columnGap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <img
                      style={{
                        width: "100px",
                        aspectRatio: "16/9",
                        objectFit: "cover",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleRedirect(item.id);
                        }
                      }}
                      onClick={() => handleRedirect(item.id)}
                      src={
                        item.config.playerThumbnailImageUrl.replace(
                          "skara-imagecontent-alpha.s3.ap-south-1.amazonaws.com/",
                          "skara-imagecontent-staging.b-cdn.net/",
                        ) ||
                        "https://sato-image-content.b-cdn.net/48d677f8-734a-496e-a2ec-ad6ef88411cc/6f75caa6-42d8-4bbf-9d0b-c9efba3083be/thumbnail.png"
                      }
                      alt={"no image found"}
                      className="card-thumbnail"
                    />
                    <span
                      className="filename table-row-text"
                      onClick={() => handleRedirect(item.id)}
                    >
                      {truncate(item.name)}
                    </span>
                  </div>
                  <span className="table-row-text">
                    {timeAgo(item.updated_at)}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.125rem",
                      justifyContent: "center",
                      background: "#FFDEB960",
                      width: "16rem",
                      padding: "0.5rem",
                      borderRadius: "0.25rem",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleCopyClipboard(`[sato_player id="${item.id}"]`);
                    }}
                  >
                    <span className="table-row-text">
                      {`[sato_player id="${item.id}"]`}
                    </span>
                    <span className="material-symbols-outlined">
                      content_copy
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      justifyContent: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.25rem",
                        padding: "0.25rem",
                        borderRadius: "0.25rem",
                        border: "1px solid var(--stroke)",
                        color: "white",
                        background: "var(--primary)",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setOpenModal(true);
                        setDuplicateData(item);
                      }}
                    >
                      <span
                        className="table-row-text"
                        style={{ color: "white" }}
                      >
                        Duplicate
                      </span>
                    </div>
                    <div
                      style={{
                        padding: "0.25rem",
                        borderRadius: "0.25rem",
                        border: "1px solid var(--stroke)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        className="material-symbols-outlined delete-icon"
                        onClick={() => {
                          setOpenModalDelete(true);
                          setDeleteData(item);
                        }}
                      >
                        delete_forever
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <button
              style={{ cursor: "pointer", display: "flex" }}
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "20px",
                }}
              >
                chevron_left
              </span>
            </button>

            <span>
              {" "}
              {page} of {totalPages}{" "}
            </span>

            <button
              style={{ cursor: "pointer", display: "flex" }}
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "20px",
                }}
              >
                chevron_right
              </span>
            </button>
          </div>

          <Modal
            isOpen={openModal}
            setOpen={setOpenModal}
            title={`Duplicate player`}
            size="sm"
          >
            <p className="body">Are you sure want to duplicate this player?</p>
            <form onSubmit={duplicatePlayer}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpenModal(false);
                  }}
                  className="large-secondary-btn"
                  style={{
                    width: "100%",
                    margin: "2rem 0 0 0",
                  }}
                >
                  No
                </button>

                <button
                  type="submit"
                  className="large-primary-btn"
                  style={{
                    width: "100%",
                    margin: "2rem 0 0 0",
                  }}
                >
                  Yes
                </button>
              </div>
            </form>
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
                Player Copied
              </p>
            </div>
          </Toast>
          <Modal
            isOpen={openModalDelete}
            setOpen={setOpenModalDelete}
            title={`Delete this video player?`}
            size="sm"
          >
            <p className="body">
              Deleting this will affect video playback on your website where it
              might be embedded
            </p>
            <form onSubmit={deletePlayer}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpenModalDelete(false);
                  }}
                  className="large-primary-btn"
                  style={{
                    width: "100%",
                    margin: "2rem 0 0 0",
                  }}
                >
                  No
                </button>

                <button
                  type="submit"
                  className="large-danger-btn"
                  style={{
                    width: "100%",
                    margin: "2rem 0 0 0",
                  }}
                >
                  Yes
                </button>
              </div>
            </form>
          </Modal>
          <Toast show={showDelete} hideToast={hideToastDelete}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <span className="material-symbols-outlined positive">done</span>
              <p className="body" style={{ marginLeft: "1rem" }}>
                Player Deleted
              </p>
            </div>
          </Toast>
          <Toast show={showCopy} hideToast={hideToastCopy}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <span className="material-symbols-outlined positive">done</span>
              <p className="body" style={{ marginLeft: "1rem" }}>
                Short Code Copied
              </p>
            </div>
          </Toast>
        </div>
      )}

      <div style={{ borderTop: "1px solid var(--stroke)", marginTop: "1rem" }}>
        <MediaLibrary length={10} />
      </div>
    </div>
  );
};

export default Home;
