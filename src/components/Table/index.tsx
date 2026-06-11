import React from "react";
import "./Table.css";
import config from "../../config";
import Toast from "../Toast";
import { videoUrlUpdate } from "../../pages/Detail";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import Modal from "../Modal";
import { timeAgo } from "../../utils/helper";
import Popover from "../Popover";
import Premium from "../PremiumIcon";
import Loader from "../Loader";
import { waitForVideoProcessing } from "../VideoPicker";
import AddSvg from "../../assets/Add.svg";
import FailedSvg from "../../assets/Failed.svg";
import CompleteSvg from "../../assets/Complete.svg";
import GenerateSvg from "../../assets/Generate.svg";

type VideoListProps = {
  data: any;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
  handleClick?: any;
  showCopy?: boolean;
  activePlan?: any;
};

const VideoList = (props: VideoListProps) => {
  const { data, setRefetch, handleClick, showCopy = true, activePlan } = props;

  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
  const [show, setShowToast] = React.useState(false);
  const [assetId, setAssetId] = React.useState("");
  const [text, setText] = React.useState("");

  const [transcriptionFailed, setTranscriptionFailed] = React.useState<
    string | null
  >(null);
  const [transcriptLoadingId, setTranscriptLoadingId] = React.useState<
    string | null
  >(null);

  const showToast = () => {
    setShowToast(true);
  };
  const hideToast = () => {
    setShowToast(false);
  };

  const handleCopy = (url: string, text: string) => {
    const construct_video_url = new URL(url, config.VIDEO_CDN_URL).toString();
    navigator.clipboard.writeText(construct_video_url);
    setText(text);
    showToast();
  };

  const handleTranscribe = async (id: string) => {
    try {
      setTranscriptLoadingId(id);
      const res = await axios.post(
        `/videos/${id}/transcripts`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("s-token")}`,
          },
        },
      );
      console.log("transcribe", res.data);
      const result = await waitForVideoProcessing(id);
      if (result.status === "completed") {
        setTranscriptLoadingId(null);
        setRefetch(Math.random());
      }
      if (result.status === "failed") {
        setTranscriptionFailed(id);
        setTranscriptLoadingId(null);

        return;
      }
    } catch (error) {
      console.log("errror transcribe", error);
      setTranscriptLoadingId(null);
    }
  };

  const handleEncode = async (id: string) => {
    try {
      const res = await axios.post(
        `/videos/${id}/transcodes`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("s-token")}`,
          },
        },
      );
      console.log("encode", res.data);
    } catch (error) {
      console.log("errror encode", error);
    }
  };

  const deleteAssets = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`/videos/${assetId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // console.log("delete", res);
      setOpenModalDelete(false);
      setText("Video Deleted");
      showToast();
      setTimeout(() => {
        setRefetch(Math.random());
      }, 800);
    } catch (error) {
      console.log("error deleting asset", error);
    }
  };

  const truncate = (text: string = "", maxLength = 50): string => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      maxLength = 30; // mobile limit
    }
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  if (!activePlan) {
    return <Loader />;
  }

  return (
    <div className="video-table">
      <div className={"video-table-header"}>
        <span className="link textPrimary">Video name</span>
        <span className="link textPrimary">Uploaded at</span>
        <span
          className="link textPrimary"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          {!activePlan?.metadata?.premium_features?.caption && (
            <Premium smIcon={true} width="16" />
          )}
          Speech-to-text
        </span>
        <span className="link textPrimary">More</span>
      </div>

      {data.map((video: any, idx: number) => (
        <div key={idx} className="video-table-row">
          <span
            className="filename table-row-text"
            style={{
              cursor: handleClick ? "pointer" : "text",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onClick={async () => {
              if (handleClick) {
                const construct_video_url = new URL(
                  video.url,
                  config.VIDEO_CDN_URL,
                ).toString();
                videoUrlUpdate.value = construct_video_url;
                await handleClick(video);
                setRefetch(Math.random());
              }
            }}
          >
            {handleClick && (
              <img
                src={AddSvg}
                alt="add"
                style={{ width: "16px", maxWidth: 380 }}
              />
            )}
            {truncate(video.name)}
          </span>
          <span className="table-row-text">{timeAgo(video.updated_at)}</span>

          <span
            style={{
              cursor:
                !activePlan?.metadata?.premium_features?.caption ||
                video.transcription_status === "completed"
                  ? "not-allowed"
                  : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
              borderRadius: "0.25rem",
            }}
            onClick={() => {
              if (
                !activePlan?.metadata?.premium_features?.caption ||
                video.transcription_status === "completed"
              ) {
                return;
              }
              handleTranscribe(video?.id);
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {transcriptLoadingId === video.id ? (
                <Loader borderColor="var(--primary)" />
              ) : video.transcription_status === "failed" ||
                transcriptionFailed === video.id ? (
                <img
                  src={FailedSvg}
                  alt="failed"
                  style={{ width: "16px", maxWidth: 380 }}
                />
              ) : video.transcription_status === "completed" ? (
                <img
                  src={CompleteSvg}
                  alt="complete"
                  style={{ width: "16px", maxWidth: 380 }}
                />
              ) : (
                <img
                  src={GenerateSvg}
                  alt="add"
                  style={{ width: "80px", maxWidth: 380 }}
                />
              )}
            </div>
          </span>

          <span className=" table-row-text">
            <div
              style={{
                position: "relative",
              }}
            >
              <Popover
                trigger={
                  <div style={{ cursor: "pointer" }}>
                    <span className="material-symbols-outlined">
                      more_horiz
                    </span>
                  </div>
                }
                content={
                  <Content
                    onClickCopy={() => {
                      handleCopy(video?.url, "Video URL copied");
                    }}
                    transcriptionUrl={video?.transcription_url}
                    onClickTranscribeCopy={() => {
                      handleCopy(
                        video?.transcription_url,
                        "Transcribe URL copied",
                      );
                    }}
                    onClickDelete={() => {
                      setOpenModalDelete(true);
                      setAssetId(video.id);
                    }}
                  />
                }
                position="top"
              />
            </div>
          </span>

          {/* {!handleClick && (
            <span>
              <span
                className="material-symbols-outlined delete-icon"
                onClick={() => {
                  setOpenModalDelete(true);
                  setAssetId(video.id);
                }}
              >
                delete_forever
              </span>
            </span>
          )} */}
        </div>
      ))}

      <Modal
        isOpen={openModalDelete}
        setOpen={setOpenModalDelete}
        title={`Delete Video?`}
        size="sm"
      >
        <p className="body">
          Deleting this video will permanently remove it from your video
          library.
        </p>
        <form onSubmit={deleteAssets}>
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
            {text}
          </p>
        </div>
      </Toast>
    </div>
  );
};

export default VideoList;

const Content = (props: any) => {
  const {
    onClickCopy,
    onClickTranscribeCopy,
    onClickDelete,
    transcriptionUrl,
  } = props;

  return (
    <>
      <div className="with-icon" onClick={onClickCopy}>
        <span className="material-symbols-outlined primary">content_copy</span>
        <p className="body">Copy Video URL</p>
      </div>

      {transcriptionUrl && (
        <div className="with-icon" onClick={onClickTranscribeCopy}>
          <span className="material-symbols-outlined primary">
            content_copy
          </span>
          <p className="body">Copy Transcribe URL</p>
        </div>
      )}

      <div className="with-icon" onClick={onClickDelete}>
        <span className="material-symbols-outlined negative">
          delete_forever
        </span>
        <p className="body">Delete</p>
      </div>
    </>
  );
};
