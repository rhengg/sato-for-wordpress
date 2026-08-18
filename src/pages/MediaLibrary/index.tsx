import React from "react";
import "./medialibrary.css";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import VideoPicker, {
  waitForVideoProcessing,
} from "../../components/VideoPicker";
import { encodeBase64 } from "../../utils/base64";
import Modal from "../../components/Modal";
import VideoQuota from "../../components/VideoQuota";
import Loader from "../../components/Loader";
import { Button, Notice } from "@wordpress/components";
import { Text } from "@wordpress/ui";
import { DataViews, View } from "@wordpress/dataviews";
import { readableSizeFromMB, timeAgo } from "../../utils/helper";
import config from "../../config";
import EmptyPlayersState from "../../components/EmptyCard";
import WaveLoader from "../../components/Loader/WaveLoader";

const MediaLibrary = (props: any) => {
  const { length, showNotice, token } = props;
  const [openModalUpload, setOpenModalUpload] = React.useState<boolean>(false);
  const [media, setMedia] = React.useState<any[]>();
  const [refetch, setRefetch] = React.useState(0);
  const [activePlan, setActivePlan] = React.useState<any>();
  const [usageData, setUsageData] = React.useState<any>();
  const [usageLoading, setUsageLoading] = React.useState(true);
  const [isLoading, setLoading] = React.useState(false);
  const [file, setFile] = React.useState<any>();
  const [transcriptionFailed, setTranscriptionFailed] = React.useState<
    string | null
  >(null);
  const [transcriptLoadingId, setTranscriptLoadingId] = React.useState<
    string | null
  >(null);
  const [showPremiumNotice, setShowPremiumNotice] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState<string>();
  const [countryCode, setCountryCode] = React.useState("US");
  const [view, setView] = React.useState<View>({
    fields: ["storage", "uploaded_at", "speech-to-text"],
    filters: [],
    groupBy: undefined,
    layout: {},
    page: 1,
    perPage: 5,
    search: "",
    showMedia: false,
    titleField: "videoname",
    type: "table",
  });

  const applyFilters = (
    data: any[],
    filters?: {
      field?: string;
      operator: string;
      value?: string;
    }[],
  ) => {
    if (!filters?.length) return data;

    return data.filter((item) =>
      filters.every((filter) => {
        const field = filter.field ?? "name";

        let fieldValue = "";

        switch (field) {
          case "videoname":
            fieldValue = item.name ?? "";
            break;

          case "speech-to-text":
            fieldValue = item.transcription_status ?? "Generate";
            break;

          case "uploaded_at":
            fieldValue = timeAgo(Number(item.updated_at));
            break;

          default:
            fieldValue = String(item[field as keyof any] ?? "");
        }

        fieldValue = fieldValue.toLowerCase();

        const filterValue = String(filter.value ?? "").toLowerCase();

        switch (filter.operator) {
          case "contains":
            return fieldValue.includes(filterValue);

          case "notContains":
            return !fieldValue.includes(filterValue);

          case "startsWith":
            return fieldValue.startsWith(filterValue);

          default:
            return true;
        }
      }),
    );
  };

  const modifiedData = React.useMemo(() => {
    if (!media) {
      return undefined;
    }
    const search = view.search?.toLowerCase() ?? "";
    const sort = view.sort;
    const page = view.page ?? 1;
    const perPage = view.perPage ?? 5;
    let result = applyFilters(media, view.filters);

    if (search) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(search),
      );
    }
    if (sort?.field) {
      result = [...result].sort((a, b) => {
        let aValue: string | number = "";
        let bValue: string | number = "";

        switch (sort.field) {
          case "videoname":
            aValue = a.name ?? "";
            bValue = b.name ?? "";
            break;

          case "speech-to-text":
            aValue = a.transcription_status ?? "";
            bValue = b.transcription_status ?? "";
            break;

          case "uploaded_at":
            aValue = Number(a.updated_at);
            bValue = Number(b.updated_at);
            break;

          default:
            return 0;
        }

        const comparison =
          typeof aValue === "number"
            ? aValue - (bValue as number)
            : String(aValue).localeCompare(String(bValue));

        return sort.direction === "desc" ? -comparison : comparison;
      });
    }

    const start = (page - 1) * perPage;
    const end = start + perPage;
    return result.slice(start, end);
  }, [media, view.search, view.filters, view.sort, view.perPage, view.page]);

  const fetchUsage = async () => {
    try {
      const res = await axios.get("/usages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsageData(res.data);
    } catch (e) {
      setUsageLoading(false);
      console.log("error usage", e);
    } finally {
      setUsageLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const res = await axios.get(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const plans = await axios.get(`/plans/${res.data.subscription.plan_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActivePlan(plans.data?.plan);
      if (
        (res.data?.subscription?.status as string)?.toLowerCase() !== "active"
      ) {
        window.location.href = `${window.location.pathname}?page=sato-profile`;
      }
    } catch (error: any) {
      console.log("error in subscription", error);
      if (error.response.status === 401) {
        window.location.href = `${window.location.pathname}?page=sato-signin`;
      }
      if (error?.response?.status === 404) {
        window.location.href = `${window.location.pathname}?page=sato-profile`;
      }
    }
  };

  const handleTranscribe = async (id: string) => {
    try {
      setTranscriptLoadingId(id);
      const res = await axios.post(
        `/videos/${id}/transcripts`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await waitForVideoProcessing(id, token);
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

  React.useEffect(() => {
    if (!length) {
      fetchSubscription();
    }
  }, []);

  const checkActivePlan = async () => {
    try {
      const res = await axios.get(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const plans = await axios.get(`/plans/${res.data.subscription.plan_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
        },
      });
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
        window.location.href = `${window.location.pathname}?page=sato-signin`;
      }
      if (error?.response?.status === 402) {
        window.location.href = `${window.location.pathname}?page=sato-profile`;
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMedia();
    fetchUsage();
  }, [refetch]);

  const deleteAssets = async (item: any) => {
    try {
      setActionLoading("delete-video");
      await axios.delete(`/videos/${item.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showNotice({ status: "success", text: "Video deleted!" });
      setRefetch(Math.random());
    } catch (error) {
      console.log("error deleting asset", error);
      showNotice({
        status: "error",
        text: "Error while deleting video",
      });
    } finally {
      setActionLoading(undefined);
    }
  };

  React.useEffect(() => {
    axios
      .get(config.IP_API)
      .then((response) => {
        const code = response?.data?.countryCode?.toUpperCase();
        if (code) {
          setCountryCode(code);
        }
      })
      .catch((error) => {
        console.error("Error fetching country:", error);
      });
  }, []);

  if (isLoading && !length && !activePlan && usageLoading)
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.0rem",
            gap: "1rem",
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
              <Button
                __next40pxDefaultSize={true}
                variant="primary"
                onClick={() => setOpenModalUpload(true)}
                icon={"cloud-upload"}
              >
                Upload New Video
              </Button>
            </div>
            <div>
              <Modal
                isOpen={openModalUpload}
                setOpen={setOpenModalUpload}
                title={``}
                size="md"
              >
                <div className="v-picker-container">
                  <VideoPicker
                    token={token}
                    file={file}
                    setFile={setFile}
                    setVideoUrl={(e) => {
                      console.log(e);
                    }}
                    setRefetch={setRefetch}
                    setOpenModalUpload={setOpenModalUpload}
                    activePlan={activePlan}
                  />
                </div>
              </Modal>
            </div>
          </div>

          {usageData && (
            <div
              className="w-100"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <VideoQuota
                usedStorage={usageData?.storage}
                totalStorage={usageData?.storage_limit}
                name="Storage"
                onChangePlanClick={() => {
                  window.open(
                    `https://app.satoplayer.com/plans/${countryCode}`,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              />

              <VideoQuota
                usedStorage={usageData?.bandwidth}
                totalStorage={usageData?.bandwidth_limit}
                name="Bandwidth"
                onChangePlanClick={() => {
                  window.open(
                    `https://app.satoplayer.com/plans/${countryCode}`,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              />
            </div>
          )}
        </div>

        <div className="desktop-text-render">
          <p
            className="subtitle-three"
            style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}
          >
            Uploaded Videos
          </p>
          {length && media && media.length > 9 && (
            <Button
              variant="secondary"
              onClick={() => {
                window.location.href = `${window.location.pathname}?page=sato-video-library`;
              }}
            >
              See All
            </Button>
          )}
        </div>
        {showPremiumNotice && (
          <div style={{ margin: "0.5rem 0" }}>
            <Notice
              status="warning"
              isDismissible
              onDismiss={() => setShowPremiumNotice(false)}
              onRemove={() => setShowPremiumNotice(false)}
              politeness="assertive"
              spokenMessage="Speech-to-text is available only on Premium plans."
            >
              Speech-to-text is available only on Premium plans.
            </Notice>
          </div>
        )}

        {!media && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <WaveLoader />
          </div>
        )}

        {media && modifiedData && (
          <div
            className="--wp-dataviews-color-background"
            style={{
              height: "100%",
            }}
          >
            <DataViews
              actions={[
                {
                  id: "copy_url",
                  isPrimary: false,
                  label: "Copy Video URL",
                  modalFocusOnMount: "firstContentElement",
                  supportsBulk: false,
                  callback(items, context) {
                    try {
                      const construct_video_url = new URL(
                        items[0].url,
                        config.VIDEO_CDN_URL,
                      ).toString();
                      navigator.clipboard.writeText(construct_video_url);
                      showNotice({
                        status: "success",
                        text: "Video URL copied!",
                      });
                    } catch (error) {
                      showNotice({
                        status: "error",
                        text: "Error copying Video URL!",
                      });
                    }
                  },
                },
                {
                  RenderModal: ({ items, closeModal, onActionPerformed }) => (
                    <>
                      <Text variant="body-lg">
                        Deleting this video will permanently remove it from your
                        video library.
                      </Text>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          marginTop: "1rem",
                        }}
                      >
                        <Button
                          variant="primary"
                          isDestructive={true}
                          __next40pxDefaultSize
                          onClick={() => deleteAssets(items[0])}
                          isBusy={
                            actionLoading === "delete-video" ? true : false
                          }
                        >
                          Delete permanently
                        </Button>
                        <Button
                          onClick={closeModal}
                          autoFocus
                          __next40pxDefaultSize
                          variant="tertiary"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ),
                  id: "delete",
                  isPrimary: false,
                  label: "Delete item",
                  modalFocusOnMount: "firstContentElement",
                  modalHeader: () => {
                    return "Delete video permanently?";
                  },
                  supportsBulk: false,
                },
              ]}
              config={{
                perPageSizes: [5, 10],
              }}
              data={modifiedData}
              defaultLayouts={{
                table: true,
              }}
              fields={[
                {
                  enableGlobalSearch: true,
                  filterBy: {
                    operators: ["contains", "notContains", "startsWith"],
                  },
                  isValid: {
                    required: true,
                  },
                  id: "videoname",
                  label: "Video Name",
                  type: "text",
                  getValue: ({ item }) => item.name,
                },
                {
                  id: "storage",
                  label: "Storage",
                  type: "text",
                  filterBy: {
                    operators: ["contains", "notContains", "startsWith"],
                  },
                  getValue: ({ item }) => {
                    return typeof item.size_bytes === "number"
                      ? readableSizeFromMB(item.size_bytes / 1024 / 1024)
                      : "--";
                  },
                },
                {
                  id: "uploaded_at",
                  label: "Uploaded at",
                  type: "text",
                  filterBy: {
                    operators: ["contains", "notContains", "startsWith"],
                  },
                  getValue: ({ item }) => {
                    return timeAgo(Number(item.updated_at));
                  },
                },
                {
                  id: "speech-to-text",
                  label: "Speech-to-text",
                  type: "text",
                  filterBy: {
                    operators: ["contains", "notContains", "startsWith"],
                  },
                  getValue: ({ item }) => {
                    return item.transcription_status || "Generate";
                  },
                  render: ({ item }) => (
                    <Button
                      variant="tertiary"
                      style={{
                        color:
                          item.transcription_status === "failed" ||
                          transcriptionFailed === item.id
                            ? "var(--negative)"
                            : item.transcription_status === "completed"
                              ? "var(--positive)"
                              : "revert-layer",
                      }}
                      onClick={(e: any) => {
                        e.stopPropagation();
                        if (
                          !activePlan?.metadata?.premium_features?.caption ||
                          item.transcription_status === "completed"
                        ) {
                          console.log("premium click");
                          setShowPremiumNotice(true);

                          setTimeout(() => {
                            setShowPremiumNotice(false);
                          }, 5000);
                          return;
                        }
                        handleTranscribe(item?.id);
                      }}
                    >
                      {transcriptLoadingId === item.id ? (
                        <Loader borderColor="var(--primary)" />
                      ) : item.transcription_status === "failed" ||
                        transcriptionFailed === item.id ? (
                        <Text color="var(--negative)">Failed</Text>
                      ) : item.transcription_status === "completed" ? (
                        <Text color="var(--positive)">Generated</Text>
                      ) : (
                        <Text>Generate</Text>
                      )}
                    </Button>
                  ),
                },
              ]}
              getItemId={(item) => String(item.id)}
              isItemClickable={() => false}
              onChangeView={(item) => {
                setView(item);
              }}
              isLoading={media ? false : true}
              paginationInfo={{
                totalItems: media.length,
                totalPages: Math.ceil(media.length / 5),
              }}
              searchLabel="Video Name"
              search={true}
              view={view}
              empty={
                <div style={{ margin: "0.5rem 0" }}>
                  <EmptyPlayersState
                    heading="No videos found."
                    description="Upload video files here to process them for streaming and organize them into your media library."
                    buttonText="Upload New Video"
                    imageSrc="video_file"
                    buttonIcon="cloud-upload"
                    onButtonClick={() => setOpenModalUpload(true)}
                  />
                </div>
              }
            />
          </div>
        )}
      </div>
    </>
  );
};

export default MediaLibrary;
