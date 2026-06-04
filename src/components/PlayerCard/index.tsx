import React from "react";
import "./PlayerCard.css";
import { timeAgo } from "../../utils/helper";
import Popover from "../Popover";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import Toast from "../Toast";
import Modal from "../Modal";

type VideoPlayerCardProps = {
  handleCardClick: (id: string) => void;
  data?: any;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
  totalLength?: any;
};

const VideoPlayerCard: React.FC<VideoPlayerCardProps> = (
  props: VideoPlayerCardProps
) => {
  const { handleCardClick, data, setRefetch, totalLength } = props;
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
  const [show, setShow] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);

  const [showDuplicateTooltip, setShowDuplicateTooltip] = React.useState("0");
  const [showDeleteTooltip, setShowDeleteTooltip] = React.useState("0");

  const showToast = () => {
    setShow(true);
  };

  const hideToast = () => {
    // console.log("hideToast");

    setShow(false);
  };

  const showToastDelete = () => {
    setShowDelete(true);
  };

  const hideToastDelete = () => {
    setShowDelete(false);
  };

  const duplicatePlayer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const newdata = {
        name: data.name.concat(
          ` copy ${Math.floor(100000 + Math.random() * 900000)}`
        ),
        config: data.config,
        // "media_source": data.source.url,
        // "media_type": data.source.media_type
      };
      const res = await axios.post("/players", newdata, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      setOpenModal(false);
      showToast();
      setTimeout(() => {
        setRefetch(Math.random());
      }, 800);
      // console.log("duplicate player", res);
    } catch (error) {
      console.log("error", error);
    }
  };

  const deletePlayer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`/players/${data.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // console.log("delete", res);
      setOpenModalDelete(false);
      showToastDelete();
      setTimeout(() => {
        setRefetch(Math.random());
      }, 800);
    } catch (error) {
      console.log("error deleting player", error);
    }
  };

  const truncate = (text: string = "", maxLength = 40): string => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      maxLength = 30; // mobile limit
    }
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className={totalLength < 4 ? "card" : "card-for-grid"}>
      <img
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleCardClick(data.id as string);
          }
        }}
        onClick={() => handleCardClick(data.id as string)}
        tabIndex={0}
        src={
          data.config.playerThumbnailImageUrl.replace(
            "skara-imagecontent-alpha.s3.ap-south-1.amazonaws.com/",
            "skara-imagecontent-staging.b-cdn.net/"
          ) ||
          "https://sato-image-content.b-cdn.net/48d677f8-734a-496e-a2ec-ad6ef88411cc/6f75caa6-42d8-4bbf-9d0b-c9efba3083be/thumbnail.png"
        }
        alt={"no image found"}
        className="card-thumbnail"
      />
      <div className="card-content">
        <p className="body single-line-ellipsis">{truncate(data.name)}</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "0.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <span
              className="material-symbols-outlined textSecondary"
              style={{ fontSize: "1.2rem" }}
            >
              update
            </span>
            <p className="label">last edit {timeAgo(data.updated_at)}</p>
          </div>

          <div
            style={{
              position: "relative",
            }}
          >
            <Popover
              trigger={
                <div style={{ cursor: "pointer" }}>
                  <span className="material-symbols-outlined">more_horiz</span>
                </div>
              }
              content={
                <Content
                  setOpenModal={setOpenModal}
                  setOpenModalDelete={setOpenModalDelete}
                />
              }
              position="top"
            />
          </div>
          <Modal
            isOpen={openModal}
            setOpen={setOpenModal}
            title={`Duplicate player`}
            size="sm"
          >
            <p className="body">Are you sure want to duplicate this player?</p>
            <form onSubmit={duplicatePlayer}>
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
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerCard;

const Content = (props: any) => {
  const { setOpenModal, setOpenModalDelete } = props;

  const handleClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div
        className="with-icon"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <span className="material-symbols-outlined placeholder ">
          content_copy
        </span>
        <p className="body">Duplicate</p>
      </div>

      <div
        className="with-icon"
        onClick={() => {
          setOpenModalDelete(true);
        }}
      >
        <span className="material-symbols-outlined negative">
          delete_forever
        </span>
        <p
          className="body"
          style={{
            color: "var(--negative)",
          }}
        >
          Delete
        </p>
      </div>
    </>
  );
};
