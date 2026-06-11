import React from "react";
import "./medialibrary.css";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import VideoPicker from "../../components/VideoPicker";
import { decodeBase64, encodeBase64 } from "../../utils/base64";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import VideoQuota from "../../components/VideoQuota";
import Table from "../../components/Table";
import Loader from "../../components/Loader";
import uploadVideoSvg from "../../assets/upload-video.svg";

const MediaLibrary = (props: any) => {
  const { length } = props;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openModalUpload, setOpenModalUpload] = React.useState<boolean>(false);

  const [media, setMedia] = React.useState([]);
  const [searchMedia, setSearchMedia] = React.useState("");
  const [refetch, setRefetch] = React.useState(0);
  const [activePlan, setActivePlan] = React.useState<any>();
  const [totalVideoCount, setTotalVideoCount] = React.useState<any>();
  const [isLoading, setLoading] = React.useState(false);
  const [file, setFile] = React.useState<any>();
  const wfCodeStorage = sessionStorage.getItem("webflow-code");
  const wfCode = JSON.parse(wfCodeStorage as string);
  const choosenPlan = Cookies.get("choosen-plan");

  const fetchSubscription = async () => {
    try {
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
      setActivePlan(plans.data?.plan);
      if (
        (res.data?.subscription?.status as string)?.toLowerCase() !== "active"
      ) {
        navigate({ pathname: "/profile" });
      } else {
        Cookies.set("s_subs", encodeBase64(res.data.subscription?.plan_id), {
          expires: 30,
          secure: true,
          sameSite: "Strict",
        });
      }
    } catch (error: any) {
      console.log("error in subscription", error);
      if (error.response.status === 401) {
        navigate({ pathname: "/signin" });
      }
      if (error?.response?.status === 404) {
        if (wfCode?.code) {
          navigate({
            pathname: "/callback/wb-plugin",
            search: `code=${wfCode?.code}`,
          });
        } else if (choosenPlan) {
          console.log("chh", choosenPlan);
        } else {
          navigate("/plans");
        }
      }
    }
  };

  React.useEffect(() => {
    if (!length) {
      fetchSubscription();
    }
  }, []);

  const checkActivePlan = async () => {
    try {
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
      setActivePlan(plans.data?.plan);
    } catch (e) {
      console.log("error", e);
    }
  };

  React.useEffect(() => {
    if (length) {
      checkActivePlan();
    }
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/videos", {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });

      setTotalVideoCount(res?.data?.length);
      if (length === 10) {
        setMedia(res.data.slice(0, 10));
      } else {
        setMedia(res.data);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log("error fetching media", error);
      if (error.response.status === 401) {
        navigate({ pathname: "/signin" });
      }
      if (error?.response?.status === 402) {
        navigate({ pathname: "/plans" });
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMedia();
  }, [refetch]);

  const searchData =
    media &&
    media
      .filter((item: any) => {
        if (searchMedia === "") {
          return true;
        } else if (
          item.name.toLowerCase().includes(searchMedia.toLowerCase())
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

  if (isLoading && !length && !activePlan)
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
    <>
      <div style={{ padding: "1rem 0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            columnGap: "1rem",
            alignItems: "center",
            marginBottom: "1.0rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              justifyContent: "flex-start",
            }}
          >
            <div className="w-100">
              <button
                className="large-primary-btn m-100"
                onClick={() => setOpenModalUpload(true)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    columnGap: "0.25rem",
                    width: "max-content",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontWeight: "bold" }}
                  >
                    cloud_upload
                  </span>
                  <span>Upload New Video</span>
                </div>
              </button>
            </div>
            <div>
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
                  placeholder={"Search Video..."}
                  value={searchMedia}
                  onChange={(e) => setSearchMedia(e.target.value)}
                />
              </div>
              <Modal
                isOpen={openModalUpload}
                setOpen={setOpenModalUpload}
                title={``}
                size="md"
                // closeButton={false}
              >
                <div className="v-picker-container">
                  <VideoPicker
                    file={file}
                    setFile={setFile}
                    setVideoUrl={(e) => {
                      console.log(e);
                      // setVideoUrl(e);
                    }}
                    setRefetch={setRefetch}
                    setOpenModalUpload={setOpenModalUpload}
                    activePlan={activePlan}
                  />
                </div>
              </Modal>
            </div>
          </div>
          {activePlan?.amount >= 0 && (
            <div className="w-100">
              <VideoQuota
                used={totalVideoCount}
                total={activePlan?.total_video_upload_limit}
                maxSize={activePlan?.per_video_upload_limit}
                onUpgradeClick={() => navigate("/plans")}
              />
            </div>
          )}
        </div>

        <div className="desktop-text-render">
          <p className="subtitle-two">Uploaded Videos</p>
          {pathname != "/video-library" && media?.length > 9 && (
            <button
              className="small-secondary-btn"
              onClick={() => {
                navigate("/video-library");
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

        {searchData && searchData.length > 0 ? (
          <Table
            data={searchData}
            setRefetch={setRefetch}
            activePlan={activePlan}
          />
        ) : (
          <>
            <div
              style={{ cursor: "pointer", width: "max-content" }}
              onClick={() => setOpenModalUpload(true)}
              tabIndex={0}
            >
              <img
                className="w-100"
                src={uploadVideoSvg}
                alt="no image found"
              />
              <img className="w-100" src={uploadVideoSvg} alt="upload video" />;
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MediaLibrary;
