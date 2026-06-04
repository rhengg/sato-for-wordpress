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

  const [subscription, setSubscription] = React.useState<any>();

  const [file, setFile] = React.useState<any>();
  const [videoUrl, setVideoUrl] = React.useState<any>();

  const s_pay = decodeBase64(Cookies.get("s-pay") as string);

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
      setSubscription(res?.data?.subscription);

      // console.log("success subscriptions fetch", res.data);

      const plans = await axios.get(`/plans/${res.data.subscription.plan_id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // const planDetails = allPlans.data.find(
      //   (item: any) => item.id === res.data.subscription.plan_id
      // );
      setActivePlan(plans.data?.plan);

      if (
        (res.data?.subscription?.status as string)?.toLowerCase() !== "active"
      ) {
        navigate({ pathname: "/profile" });
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

      // const planDetails = allPlans.data.find(
      //   (item: any) => item.id === res.data.subscription.plan_id
      // );
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

  // const searchData =
  //   media &&
  //   media.filter((item: any) => {
  //     if (searchMedia === "") {
  //       return item;
  //     } else if (item.name.toLowerCase().includes(searchMedia?.toLowerCase())) {
  //       return item;
  //     }
  //   });

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
      {/* {(subscription?.status === "pending" ||
        subscription?.status === "halted") && (
        <div
          style={{
            // position: "absolute",
            boxSizing: "border-box",
            // top: 0,
            width: "100%",
            borderRadius: "0.25rem",
            border: "1px solid var(--stroke)",
            padding: "1rem",
            marginTop: "2rem",
            backgroundColor: "#f5fab3ff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <p className="body">
            Charge attempt towards your subscription has failed. To continue
            with this subscription, you must
          </p>
          <Link
            to={subscription?.short_url}
            target="_blank"
            style={{
              textDecoration: "none",
            }}
            className="primary"
          >
            update payment method
          </Link>
        </div>
      )} */}
      <div className="main-page-wrapper">
        {/*
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        <div
          style={{
            width: "max-content",
          }}
        >
          <p className="heading">Video Library</p>
          <p className="body textSecondary"
            style={{
              marginTop: '0.35rem',
              fontFamily: 'Satoshi-Regular',
            }}
          >Find all your uploaded videos in URL format here</p>
        </div>
      </div>
      */}

        <div className="search-wrapper">
          <div className="search-create-container">
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
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontWeight: "bold" }}
                  >
                    cloud_upload
                  </span>
                  Upload New Video
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
              {/* <p className="body">Upload a video from your device</p> */}

              <div
                // style={{
                //   margin: "2rem 0",
                //   display: "flex",
                //   alignItems: "center",
                //   justifyContent: "center",
                //   padding: "0 8rem",
                // }}
                className="v-picker-container"
              >
                <VideoPicker
                  file={file}
                  setFile={setFile}
                  setVideoUrl={setVideoUrl}
                  setRefetch={setRefetch}
                  setOpenModalUpload={setOpenModalUpload}
                  activePlan={activePlan}
                />
              </div>
            </Modal>
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
          <p className="subtitle-one">Uploaded Videos</p>
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
                src="./upload-video.svg"
                alt="no image found"
              />
              <img className="w-100" src={uploadVideoSvg} alt="upload video" />;
            </div>
            {/*
          <div style={{
            width: 'max-content', position: 'relative',
            cursor: 'pointer'
          }}
            onClick={() => setOpenModalUpload(true)}
          >
            <iframe src="https://cdn.lottielab.com/l/EHuALDwkipPNQ7.html" width="340" height="300" frameBorder="0"
              style={{
                pointerEvents: 'none'
              }}
            ></iframe>

            <div style={{
              position: 'absolute',
              width: '100%',
              height: '2rem',
              bottom: 0,
              background: 'white',
            }}>
            </div>
          </div>
      */}
          </>
        )}
      </div>
    </>
  );
};

export default MediaLibrary;
