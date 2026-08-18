import React, { ChangeEvent } from "react";
import axios from "../../utils/axios-instance";
import axiosOriginal from "axios";
import "./videopicker.css";
import config from "../../config";
import { videoUrlUpdate } from "../../pages/Detail";
import { Link, useNavigate } from "react-router-dom";
import Premium from "../PremiumIcon";
import Tooltip from "../Tooltip";
import { sanitizeFileNameForS3Key } from "../../utils/helper";
import UploadErrorSvg from "../../assets/upload-error.svg";
import FilesIconsSvg from "../../assets/FilesIcons.svg";
import { NoticeType } from "../../pages/Home";
import { Snackbar } from "@wordpress/components";

export const waitForVideoProcessing = async (
  videoId: string,
  token: string,
) => {
  const maxRetries = 20;
  const delay = 3000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await axios.get(`/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const video = res.data;
      if (video.transcription_status === "completed") {
        return { status: "completed", video };
      }

      if (video.transcription_status === "failed") {
        return { status: "failed", video };
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (err) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return { status: "timeout" };
};

type VideoPickerProps = {
  token: string;
  file: any;
  setFile: React.Dispatch<React.SetStateAction<any>>;
  setVideoUrl?: React.Dispatch<React.SetStateAction<any>>;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
  setOpenModalUpload?: React.Dispatch<React.SetStateAction<boolean>>;
  handleSetUrl?: any;
  activePlan?: any;
  addSource?: (sourceId?: string, mediaItem?: any) => Promise<void>;
  sourceId?: string;
};

const VideoPicker = (props: VideoPickerProps) => {
  const {
    token,
    file,
    setFile,
    setRefetch,
    setOpenModalUpload,
    addSource,
    sourceId,
    activePlan,
  } = props;
  const navigate = useNavigate();

  const [pickerId, setPickerId] = React.useState<string>();
  const [progress, setProgress] = React.useState<number>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [limitExceedCode, setLimitExceedCode] = React.useState<number>(0);
  const [imageImported, setImageImported] = React.useState(false);
  const [sizeExceed, setSizeExceed] = React.useState(false);
  const [totalVideoCount, setTotalVideoCount] = React.useState(false);
  const [failedVideo, setFailedVideo] = React.useState<any>(null);
  const [transcriptionFailed, setTranscriptionFailed] = React.useState(false);
  const [transcript, setTranscript] = React.useState(false);
  const [uploadLoading, setUploadLoading] = React.useState(false);
  const [notice, setNotice] = React.useState<NoticeType>();

  const showNotice = (item: NoticeType) => {
    setNotice(item);
    setTimeout(() => {
      setNotice(undefined);
    }, 3000);
  };

  React.useEffect(() => {
    const video_id =
      "video_" +
      Math.floor(Math.random() * 10000) +
      "_" +
      Math.floor(Math.random() * 10000000);
    setPickerId(video_id);
  }, []);

  const handleFileChange = (e: any) => {
    const files = e.target.files[0];
    setFile(files);
    setLimitExceedCode(0);
    setImageImported(true);
  };

  const uploadFile = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setUploadLoading(true);
      const res = await axios.post(
        "/videos",
        {
          filename: sanitizeFileNameForS3Key(file?.name),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await uploadToS3(file, res.data);
      setLoading(false);
      setFile(null);
      setProgress(0);
      setTimeout(() => {
        setRefetch(Math.random() + Math.random());
        setOpenModalUpload && setOpenModalUpload(false);
      }, 1000);
    } catch (error: any) {
      setLimitExceedCode(error?.response?.status);
      setTotalVideoCount(true);
      setLoading(false);
      setProgress(0);
    } finally {
      setUploadLoading(false);
    }
  };

  const uploadToS3 = async (file: File, presignedPostData: any) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      //@ts-ignore
      Object.keys(presignedPostData.fields).forEach((key) => {
        const value = presignedPostData.fields[key];
        if (value !== undefined && value !== null && value !== "") {
          // @ts-ignore
          formData.append(key, value);
        }
      });
      formData.append("file", file);

      axiosOriginal
        //@ts-ignore
        .post(presignedPostData.upload_url, formData, {
          onUploadProgress: (progressEvent) => {
            setLoading(true);
            const percentCompleted = Math.round(
              Number(progressEvent.loaded * 100) / Number(progressEvent?.total),
            );
            setProgress(percentCompleted);
          },
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        })
        .then(async (response) => {
          const onSuccess = await axios.post(
            "/videos/on-success",
            {
              key: presignedPostData.fields.key,
              use_caption: activePlan?.amount === 0 ? false : transcript,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const construct_video_url = new URL(
            presignedPostData.fields.key,
            config.VIDEO_CDN_URL,
          ).toString();

          videoUrlUpdate.value = construct_video_url;
          const shouldProcess = transcript;

          try {
            if (shouldProcess) {
              const result = await waitForVideoProcessing(
                onSuccess.data?.id,
                token,
              );

              if (addSource) {
                if (result.status === "completed") {
                  await addSource(sourceId, result.video);
                }

                if (result.status === "failed") {
                  setTranscriptionFailed(true);
                  setFailedVideo(result.video);
                  return;
                }

                if (result.status === "timeout") {
                  setTranscriptionFailed(true);
                  return;
                }
              } else {
                if (result.status === "completed") {
                  setOpenModalUpload && setOpenModalUpload(false);
                  setRefetch(Math.random());
                }

                if (result.status === "failed") {
                  setTranscriptionFailed(true);
                  return;
                }

                if (result.status === "timeout") {
                  setTranscriptionFailed(true);
                  return;
                }
              }
            } else {
              if (addSource) {
                await addSource(sourceId);
                setRefetch(Math.random());
                setOpenModalUpload && setOpenModalUpload(false);
              }
            }
            setLoading(false);
            resolve(response);
          } catch (err) {
            resolve(response);
          }
        })
        .catch((error: any) => {
          setLoading(false);
          setLimitExceedCode(error?.response?.status);
          setSizeExceed(true);
          reject(error);
        });
    });
  };

  const truncate = (text?: string, maxLength = 30): string => {
    if (!text) return ""; // safeguard
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const isUploading = loading && (progress ?? 0) < 100;
  const isProcessing = (progress ?? 0) === 100 && transcript;

  if (limitExceedCode === 400)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img className="w-100" src={UploadErrorSvg} alt="no image found" />

        {sizeExceed && (
          <>
            <p className="body negative">
              Uploaded video is larger than 200 MB{" "}
            </p>
            <p className="error-text">Choose a smaller video or upgrade</p>
          </>
        )}
        {totalVideoCount && (
          <p className="error-text">
            You have reached the video upload limit for this plan
          </p>
        )}
        <button
          className="large-primary-btn"
          style={{
            marginTop: "2rem",
          }}
          onClick={() => {
            navigate({ pathname: "/plans" });
          }}
        >
          Upgrade Your Plan
        </button>
      </div>
    );

  return (
    <div className="video-picker-container">
      {notice && (
        <div
          style={{
            position: "fixed",
            top: "2%",
            left: "50%",
            zIndex: "9999",
            transform: "translate(0%,50%)",
          }}
        >
          <Snackbar
            politeness="polite"
            onDismiss={() => {
              setNotice(undefined);
            }}
            onRemove={() => {
              setNotice(undefined);
            }}
          >
            {notice.text}
          </Snackbar>
        </div>
      )}

      <form onSubmit={uploadFile}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "center",
            justifyContent: "center",
            height: "max-content",
            borderRadius: "0.75rem",
            border: "1px dashed var(--primary)",
            padding: "0.5rem",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              borderRadius: "0.75rem",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.5rem 0rem",
            }}
          >
            {imageImported ? (
              <>
                <img
                  src={FilesIconsSvg}
                  alt="FilesIcons Illustration"
                  style={{ width: 44 }}
                />
                <p className="body">
                  {truncate(file?.name.replace(/\s/g, "_"))}
                </p>

                {loading ? (
                  <div className="videoUpload-main">
                    <div
                      style={{
                        height: "0.5rem",
                        border: "1px solid var(--stroke)",
                        borderRadius: "0.25rem",
                        overflow: "hidden",
                        maxWidth: "16rem",
                      }}
                    >
                      <div
                        style={{
                          background: "var(--primary)",
                          width: `${progress}%`,
                          height: "100%",
                        }}
                      ></div>
                    </div>

                    <p
                      className="body textPrimary"
                      style={{ marginTop: "0.5rem" }}
                    >
                      {isUploading && `Uploading... ${progress ?? 0}%`}
                      {!transcriptionFailed && !isUploading && isProcessing && (
                        <>
                          Generating Caption{" "}
                          <span className="dot-loader"></span>
                        </>
                      )}
                      {!isUploading && !isProcessing && (
                        <>
                          Finalizing <span className="dot-loader"></span>
                        </>
                      )}
                    </p>

                    {transcriptionFailed && (
                      <>
                        <p className="error-text">
                          We could not transcribe the video.
                        </p>

                        <p
                          className="error-text"
                          style={{ color: "var(--textSecondary)" }}
                        >
                          But the video will play normally without captions.
                        </p>

                        <Link
                          to={"https://www.satoplayer.com/contact-us"}
                          style={{
                            textDecoration: "none",
                          }}
                          className="primary"
                        >
                          Get help
                        </Link>

                        <button
                          className="large-primary-btn"
                          type="button"
                          onClick={async () => {
                            try {
                              if (addSource && sourceId && failedVideo) {
                                await addSource(sourceId, failedVideo);
                              }

                              setOpenModalUpload && setOpenModalUpload(false);
                              setRefetch(Math.random());
                            } catch (err) {
                              showNotice({
                                status: "error",
                                text: "Video upload failed!",
                              });
                            }
                          }}
                        >
                          {addSource && sourceId
                            ? "Continue"
                            : "Continue Without Transcript"}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div
                    className="videoUpload-main"
                    style={{
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          padding: "0.25rem 0.5rem",
                          border: "1px solid var(--stroke)",
                          background: "var(--white)",
                          boxSizing: "border-box",
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "0.5rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                              gap: "0.5rem",
                            }}
                          >
                            {!activePlan?.metadata?.premium_features
                              ?.caption && <Premium smIcon={true} width="16" />}
                            <p className="body"> Speech-to-text</p>{" "}
                            <Tooltip
                              text={
                                "Speech-only videos supported. AI-generated transcription may not be fully accurate."
                              }
                            >
                              <span
                                className="material-symbols-outlined"
                                style={{
                                  fontSize: "16px",
                                  cursor: "pointer",
                                }}
                              >
                                info
                              </span>
                            </Tooltip>
                          </div>
                          <input
                            type="checkbox"
                            checked={transcript}
                            onChange={(e) => setTranscript(e.target.checked)}
                            style={{
                              accentColor: "var(--primary)",
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <p
                      className="label"
                      style={{
                        visibility:
                          !activePlan?.metadata?.premium_features?.caption &&
                          transcript
                            ? "visible"
                            : "hidden",
                      }}
                    >
                      <span className="primary" style={{ cursor: "pointer" }}>
                        <Link
                          to={"/plans"}
                          target="_blank"
                          style={{
                            textDecoration: "none",
                            fontWeight: "bold",
                          }}
                          className="primary"
                        >
                          Upgrade
                        </Link>
                      </span>{" "}
                      to access these premium features
                    </p>

                    <button
                      className="large-primary-btn"
                      type="submit"
                      disabled={
                        uploadLoading &&
                        !activePlan?.metadata?.premium_features?.caption &&
                        transcript
                      }
                      style={{
                        marginTop: "1rem",
                        width: "100%",
                      }}
                    >
                      {uploadLoading ? (
                        <>
                          Loading <span className="dot-loader"></span>
                        </>
                      ) : (
                        "Upload Selected File"
                      )}
                    </button>

                    <div style={{ width: "100%" }}>
                      <label
                        style={{
                          height: "100%",
                        }}
                        htmlFor={pickerId}
                      >
                        <div
                          style={{
                            padding: "0 1rem",
                          }}
                        >
                          <p className="body" style={{ textAlign: "center" }}>
                            or{" "}
                            <span
                              className="sato-link-active"
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              Choose another{" "}
                            </span>
                          </p>
                        </div>
                      </label>
                      <input
                        type="file"
                        id={pickerId}
                        style={{ display: "none" }}
                        accept="video/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="videoUpload-main">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: " 1.5rem",
                    boxSizing: "border-box",
                  }}
                >
                  <p className="subtitle-two">Add a Video</p>
                  <div style={{ padding: "0 1rem" }}>
                    <p className="label" style={{ textAlign: "center" }}>
                      Browse device or select from your library
                    </p>
                  </div>
                </div>
                <label style={{ width: "100%" }} htmlFor={pickerId}>
                  <div className="videoUpload-button">Browse Device</div>
                  <p
                    className="body textSecondary"
                    style={{ marginTop: "0.5rem", textAlign: "center" }}
                  >
                    (supports .mp4 files)
                  </p>
                </label>
                <input
                  type="file"
                  id={pickerId}
                  style={{ display: "none" }}
                  accept="video/*"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default VideoPicker;
