import React from "react";
import Error from "../components/Error";
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
import { Button, Snackbar } from "@wordpress/components";
import { Text } from "@wordpress/ui";
import { DataViews, View } from "@wordpress/dataviews";
import DetailMenu from "../components/DetailMenu";
import Tooltip from "../components/Tooltip";
import { encodeBase64 } from "../utils/base64";

export interface Player {
  id: string;
  name: string;
  config: PlayerConfig;
  user_id: string;
  created_at: number;
  updated_at: number;
}

export interface PlayerConfig {
  videotitle: string;
  videodescription: string;
  playerBrandingImageUrl: string;
  playerThumbnailImageUrl: string;
  premium: PremiumConfig;
  playersettings: PlayerSettings;
  playerstyle: PlayerStyle;
  playercontrol: PlayerControl;
}

export interface PremiumConfig {
  layoutConfig: LayoutConfig;
  playerCTA: PlayerCTA;
  rapidEngage: boolean;
  transcoding: boolean;
  caption: boolean;
}

export interface LayoutConfig {
  name: string;
  controls_bg: string;
  controls_padding: string;
  controls_corner_radius: string;
}

export interface PlayerCTA {
  cta: boolean;
  url: string;
  buttonText: string;
  placement: string;
  timing: string;
  direction: string;
  heading: string;
  description: string;
  imageEnable: boolean;
  image: string;
}

export interface PlayerSettings {
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  use_as_BG_video: boolean;
}

export interface PlayerStyle {
  text_color: string;
  player_brand_color: string;
  icon_color: string;
  icon_button_color: string;
  icon_button_opacity: string;
  icon_button_hover_color: string;
  center_icon_color: string;
  center_icon_button_color: string;
  center_icon_button_opacity: string;
  center_icon_button_hover_color: string;
  progress_bar_BG_color: string;
  progress_bar_loaded_color: string;
  progress_bar_FG_color: string;
  progress_bar_circle_color: string;
  progress_bar_opacity: string;
  settings_menu_BG_color: string;
  settings_menu_opacity: string;
  settings_menu_BG_hover_color: string;
  settings_menu_text_color: string;
  tooltip_BG_color: string;
  tooltip_opacity: string;
  tooltip_corner_radius: string;
  tooltip_text_color: string;
  volume_bar_BG_color: string;
  volume_bar_opacity: string;
  volume_bar_FG_color: string;
  player_corner_radius: string;
  player_controls_margin: string;
  bottom_bar_spacing: string;
  icon_button_padding: string;
  icon_button_corner_radius: string;
  icon_button_size: string;
  center_icon_button_padding: string;
  center_icon_button_corner_radius: string;
  center_icon_button_size: string;
  progress_bar_size: string;
  progress_bar_hover_scale: string;
  volume_bar_size: string;
  branding_opacity: string;
}

export interface PlayerControl {
  branding: boolean;
  thumbnail: boolean;
  video_frame: boolean;
  playpause: boolean;
  center_playpause: boolean;
  progress_bar: boolean;
  time_stamp: boolean;
  volume: boolean;
  full_screen_icon: boolean;
  video_name: boolean;
  settings_menu: boolean;
  back_button: boolean;
  gradient: boolean;
  osd_auto_hide: boolean;
  scrubber: boolean;
}

export interface NoticeType {
  status: "info" | "warning" | "success" | "error";
  text: string;
}

const Home = ({ token }: { token: string }) => {
  const [data, setData] = React.useState<Player[]>([]);
  const [error, setError] = React.useState(false);
  const [refetch, setRefetch] = React.useState(0);
  const [isLoading, setLoading] = React.useState(true);
  const [activePlan, setActivePlan] = React.useState<any>();
  const [openModalAdd, setOpenModalAdd] = React.useState<boolean>(false);
  const [playerName, setPlayerName] = React.useState("");
  const [selectedTemplate, setSelectedTemplate] = React.useState<
    "halcyon" | "moderna" | "sphinx" | "prosper"
  >("halcyon");
  const [notice, setNotice] = React.useState<NoticeType>();
  const [actionLoading, setActionLoading] = React.useState<string>();

  const [view, setView] = React.useState<View>({
    fields: ["videotitle", "shortcode", "updated_at"],
    filters: [],
    groupBy: undefined,
    layout: {},
    mediaField: "image",
    page: 1,
    perPage: 5,
    search: "",
    showMedia: true,
    titleField: "name",
    type: "table",
  });

  const applyFilters = (
    data: Player[],
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
          case "name":
            fieldValue = item.name ?? "";
            break;

          case "videotitle":
            fieldValue = item.config.videotitle ?? "";
            break;

          case "updated_at":
            fieldValue = timeAgo(Number(item.updated_at));
            break;

          default:
            fieldValue = String(item[field as keyof Player] ?? "");
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
    const search = view.search?.toLowerCase() ?? "";
    const sort = view.sort;
    const page = view.page ?? 1;
    const perPage = view.perPage ?? 5;
    let result = applyFilters(data, view.filters);

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
          case "name":
            aValue = a.name ?? "";
            bValue = b.name ?? "";
            break;

          case "videotitle":
            aValue = a.config.videotitle ?? "";
            bValue = b.config.videotitle ?? "";
            break;

          case "updated_at":
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
  }, [data, view.search, view.filters, view.sort, view.perPage, view.page]);

  const handleRedirect = (id: string) => {
    window.location.href = `${window.location.pathname}?page=sato-player-detail&video=${id}`;
  };

  const fetchSubscription = async () => {
    try {
      setLoading(true);
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
        (res.data?.subscription?.status as string).toLowerCase() !== "active"
      ) {
        window.location.href = `${window.location.pathname}?page=sato-profile`;
      } else {
        Cookies.set("s_subs", encodeBase64(res.data.subscription?.plan_id), {
          expires: 30,
          secure: true,
          sameSite: "Strict",
        });
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        window.location.href = `${window.location.pathname}?page=sato-signin`;
      }
      if (error?.response?.status === 404) {
        window.location.href = `${window.location.pathname}?page=sato-profile`;
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayer = async () => {
    setError(false);
    try {
      const res = await axios.get("/players", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    } catch (error: any) {
      if (error.response.status === 401) {
        window.location.href = `${window.location.pathname}?page=sato-signin`;
      }
      if (error.response.status === 402) {
        window.location.href = `${window.location.pathname}?page=sato-profile`;
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const showNotice = (item: NoticeType) => {
    setNotice(item);
    setTimeout(() => {
      setNotice(undefined);
    }, 3000);
  };

  const duplicatePlayer = async (item: Player) => {
    try {
      setActionLoading("duplicate-player");
      const newdata = {
        name: item.name.concat(
          ` copy ${Math.floor(100000 + Math.random() * 900000)}`,
        ),
        config: item.config,
      };
      await axios.post("/players", newdata, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showNotice({ status: "success", text: "Video player duplicated!" });
      setRefetch(Math.random());
    } catch (error) {
      showNotice({ status: "error", text: "Error duplicating video player!" });
    } finally {
      setActionLoading(undefined);
    }
  };

  const deletePlayer = async (item: Player) => {
    try {
      setActionLoading("delete-player");
      await axios.delete(`/players/${item.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showNotice({ status: "success", text: "Video player deleted!" });
      setRefetch(Math.random());
    } catch (error) {
      showNotice({ status: "error", text: "Error deleting video player!" });
    } finally {
      setActionLoading(undefined);
    }
  };

  const createPlayer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (playerName === "")
      return showNotice({ status: "error", text: "Player name is required" });
    try {
      setLoading(true);
      const data = {
        name: playerName,
        config: config[selectedTemplate],
      };
      await axios.post("/players", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showNotice({ status: "success", text: "Video player created!" });
      setOpenModalAdd(false);
      setRefetch(Math.random());
    } catch (error) {
      showNotice({ status: "error", text: "Error creating video player!" });
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      await axios.get(`/subscriptions/invoices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log("error loading invoice", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSubscription();
    fetchInvoice();
  }, []);

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
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <DetailMenu />
      </div>
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
      <div className="search-create-container">
        <div className="w-100">
          <Button
            __next40pxDefaultSize={true}
            variant="primary"
            icon={"plus"}
            onClick={() => {
              setOpenModalAdd(true);
            }}
          >
            Create New Player
          </Button>
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
          <p className="subtitle-three">Video Players</p>
        </div>
      </div>

      <div
        className="--wp-dataviews-color-background"
        style={{
          height: "100%",
        }}
      >
        <DataViews
          actions={[
            {
              id: "copy_code",
              isPrimary: false,
              label: "Copy Short Code",
              modalFocusOnMount: "firstContentElement",
              supportsBulk: false,
              callback(items, context) {
                try {
                  navigator.clipboard.writeText(
                    `[sato_player id="${items[0].id}"]`,
                  );
                  showNotice({ status: "success", text: "Code copied!" });
                } catch (error) {
                  showNotice({ status: "error", text: "Error copying code!" });
                }
              },
            },
            {
              RenderModal: ({ items, closeModal, onActionPerformed }) => (
                <>
                  <Text variant="body-lg">
                    Are you sure want to duplicate this player?
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
                      autoFocus
                      variant="primary"
                      __next40pxDefaultSize
                      onClick={() => duplicatePlayer(items[0])}
                      isBusy={
                        actionLoading === "duplicate-player" ? true : false
                      }
                    >
                      Duplicate
                    </Button>
                    <Button
                      variant="secondary"
                      __next40pxDefaultSize
                      onClick={closeModal}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ),
              id: "duplicate",
              isPrimary: false,
              label: "Duplicate item",
              modalFocusOnMount: "firstContentElement",
              modalHeader: () => {
                return "Duplicate player?";
              },
              supportsBulk: false,
            },
            {
              RenderModal: ({ items, closeModal, onActionPerformed }) => (
                <>
                  <Text variant="body-lg">
                    Deleting this will affect video playback on your website
                    where it might be embedded
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
                      onClick={() => deletePlayer(items[0])}
                      isBusy={actionLoading === "delete-player" ? true : false}
                    >
                      Delete permanently
                    </Button>

                    <Button
                      autoFocus
                      variant="tertiary"
                      __next40pxDefaultSize
                      onClick={closeModal}
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
                return "Delete video player permanently?";
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
              id: "image",
              label: "Image",
              render: (data) => {
                return (
                  <img
                    style={{
                      width: "100px",
                      aspectRatio: "16/9",
                      objectFit: "cover",
                      borderRadius: "0.25rem",
                      cursor: "pointer",
                    }}
                    src={
                      data.item.config.playerThumbnailImageUrl.replace(
                        "skara-imagecontent-alpha.s3.ap-south-1.amazonaws.com/",
                        "skara-imagecontent-staging.b-cdn.net/",
                      ) ||
                      "https://sato-image-content.b-cdn.net/48d677f8-734a-496e-a2ec-ad6ef88411cc/6f75caa6-42d8-4bbf-9d0b-c9efba3083be/thumbnail.png"
                    }
                    alt={"no image found"}
                    className="card-thumbnail"
                  />
                );
              },
              type: "media",
            },
            {
              enableGlobalSearch: true,
              filterBy: {
                operators: ["contains", "notContains", "startsWith"],
              },
              render: ({ item }) => (
                <Text className="sato-dataview-cell" variant="body-md">
                  {item.name}
                </Text>
              ),
              id: "name",
              label: "Player Name",
              type: "text",
              getValue: ({ item }) => item.name,
            },
            {
              id: "updated_at",
              label: "Updated at",
              type: "text",
              filterBy: {
                operators: ["contains", "notContains", "startsWith"],
              },
              getValue: ({ item }) => {
                return timeAgo(Number(item.updated_at));
              },
            },

            {
              id: "videotitle",
              label: "Video Title",
              type: "text",
              filterBy: {
                operators: ["contains", "notContains", "startsWith"],
              },
              getValue: ({ item }) => {
                return item.config.videotitle || "--";
              },
            },
            {
              id: "shortcode",
              label: "Short Code",
              type: "text",
              filterBy: false,
              getValue: ({ item }) => {
                return `[sato_player id="${item.id}"]`;
              },
              render: (data) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginInlineEnd: "1rem",
                    }}
                  >
                    <div
                      style={{
                        border: "1px solid var(--stroke)",
                        borderRadius: "4px",
                        background: "var(--surface)",
                        padding: "10px",
                        fontFamily: "monospace",
                        whiteSpace: "nowrap",
                        width: "23rem",
                      }}
                    >
                      <Text variant="body-md">{`[sato_player id="${data.item.id}"]`}</Text>
                    </div>

                    <Tooltip text="Copy Short Code">
                      <span
                        className="material-symbols-outlined sato-action-icon"
                        onClick={() => {
                          try {
                            navigator.clipboard.writeText(
                              `[sato_player id="${data.item.id}"]`,
                            );
                            showNotice({
                              status: "success",
                              text: "Code copied!",
                            });
                          } catch (error) {
                            showNotice({
                              status: "error",
                              text: "Error copying code!",
                            });
                          }
                        }}
                      >
                        content_copy
                      </span>
                    </Tooltip>
                  </div>
                );
              },
            },
          ]}
          getItemId={(item) => String(item.id)}
          isItemClickable={() => true}
          onChangeView={(item) => {
            setView(item);
          }}
          onClickItem={(item) => {
            handleRedirect(item.id);
          }}
          isLoading={data ? false : true}
          paginationInfo={{
            totalItems: data.length,
            totalPages: Math.ceil(data.length / 5),
          }}
          searchLabel="Player Name"
          search={true}
          view={view}
        />
      </div>

      <div style={{ borderTop: "1px solid var(--stroke)", marginTop: "1rem" }}>
        <MediaLibrary length={10} showNotice={showNotice} token={token} />
      </div>
    </div>
  );
};

export default Home;
