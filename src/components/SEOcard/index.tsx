import React, { SyntheticEvent } from "react";
import "./seocard.css";
import IconButton from "../IconButton";
import Modal from "../Modal";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
// import { videoconfig } from '../../pages/CreatePlayer'
import { videoconfigupdate } from "../../pages/Detail";
import Toast from "../Toast";

type SEOcardProps = {
  id?: string;
  title?: string;
  description?: string;
  embedCode: string;
  removeVideo?: boolean;
  setReRender?: any;
  setDisableSaveButton?: any;
};

const Index = (props: SEOcardProps) => {
  const {
    id,
    title,
    description,
    embedCode,
    removeVideo,
    setReRender,
    setDisableSaveButton,
  } = props;
  const navigate = useNavigate();

  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalRemove, setOpenModalRemove] = React.useState<boolean>(false);
  // const [videoSeoName, setVideoSeoName] = React.useState('')
  // const [copied, setCopied] = React.useState(false)
  const [show, setShow] = React.useState(false);

  const showToast = () => {
    setShow(true);
  };

  const hideToast = () => {
    setShow(false);
  };

  // const handleCopyClipboard = async (val: string) => {
  //   setCopied(false)
  //   try {
  //     // @ts-ignore
  //     await navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
  //       if (result.state === "granted" || result.state === "prompt") {
  //         navigator.clipboard.writeText(val);
  //         console.log('Content copied to clipboard');
  //         setCopied(true)
  //       }
  //     })

  //   } catch (err) {
  //     console.error('Failed to copy: ', err);
  //     setCopied(false)
  //   }
  // }

  // const handleCopyClipboard = async (val: string) => {
  //   setCopied(false)
  //   try {
  //     const element = document.querySelector('#embed-link-copy');
  //     // @ts-ignore
  //     element?.select();
  //     // @ts-ignore
  //     element?.setSelectionRange(0, 99999);
  //     document.execCommand('copy');
  //     setCopied(true)
  //   } catch (err) {
  //     console.error('Failed to copy: ', err);
  //     setCopied(false)
  //   }
  // }

  const handleSeoData = (e: SyntheticEvent) => {
    e.preventDefault();
    setOpenModal(false);
    // console.log('Seo', { videoSeoName });
  };

  const handleRemoveVideo = async () => {
    try {
      const res = await axios.delete(`/players/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // console.log('delete', res);
      showToast();
      setTimeout(() => {
        navigate({ pathname: "/" });
      }, 800);
    } catch (error) {
      console.log("error deleting video: ", error);
    }
  };

  return (
    <>
      <div className="seo-card-container">
        <div>
          <p className="input-title">Video Name</p>
          <input
            className="input-secondary"
            style={{ width: "100%" }}
            autoComplete="off"
            type="text"
            maxLength={30}
            defaultValue={title}
            // onInput={(e: any) => (removeVideo ? videoconfigupdate.value.videotitle = e.target.value : videoconfig.value.videotitle = e.target.value)}
            onInput={(e: any) => {
              if (e.target.value === "" || !e.target.value) {
                videoconfigupdate.value.playercontrol.video_name = false;
                videoconfigupdate.value.videotitle = e.target.value;
                setReRender(Math.random());
                setDisableSaveButton(false);
                return;
              }
              videoconfigupdate.value.videotitle = e.target.value;
              videoconfigupdate.value.playercontrol.video_name = true;
              setReRender(Math.random() * 1000);
              setDisableSaveButton(false);
            }}
            name="video-title"
            placeholder="Your video title"
          />

          {/* <div
            style={{
              margin: "1rem 0",
              width: "100%",
            }}
          >
            <p className="input-title">Video description</p>
            <textarea
              defaultValue={description}
              placeholder="Your video description"
              // onInput={(e: any) => (removeVideo ? videoconfigupdate.value.videodescription : videoconfig.value.videodescription = e.target.value)}
              onInput={(e: any) => {
                videoconfigupdate.value.videodescription = e.target.value;
                setDisableSaveButton(false);
              }}
              rows={5}
              cols={5}
              style={{
                boxSizing: "border-box",
                width: "100%",
                padding: "1rem",
                border: "1px solid",
                borderColor: "#F0F0F0",
                resize: "none",
              }}
            />
          </div> */}
        </div>
      </div>

      {/*
      {
        removeVideo &&
        <div className='seo-card-row-three'>
          <button
            className='large-danger-btn remove-btn'
            onClick={() => setOpenModalRemove(true)}
          >
            Delete Player
          </button>
        </div>
      }
*/}

      <Modal
        isOpen={openModalRemove}
        setOpen={setOpenModalRemove}
        title={`Remove video`}
        size="sm"
      >
        <p className="body">Are you sure want to remove video ?</p>

        <div style={{ marginTop: "2rem" }}>
          <button
            className="large-primary-btn"
            style={{
              width: "100%",
            }}
            onClick={handleRemoveVideo}
          >
            Okay
          </button>
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
          <span className="material-symbols-outlined negative">delete</span>
          <p className="body" style={{ marginLeft: "1rem" }}>
            Video deleted
          </p>
        </div>
      </Toast>
    </>
  );
};

export default Index;
