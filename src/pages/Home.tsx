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

import { Button } from "@wordpress/components";
import { DataViews, View } from "@wordpress/dataviews";

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

const Home = () => {
  const [searchTitle, setSearchTitle] = React.useState("");
  const [data, setData] = React.useState<Player[]>([]);
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

  const [view, setView] = React.useState<View>({
    fields: ["videotitle", "updated_at", "shortcode"],
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
          <Button
            __next40pxDefaultSize={true}
            variant="primary"
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

      <div
        className="--wp-dataviews-color-background"
        style={{
          height: "100%",
        }}
      >
        <DataViews
          actions={[
            {
              RenderModal: () => <div>Delete Modal</div>,
              id: "delete",
              isPrimary: false,
              label: "Delete item",
              modalFocusOnMount: "firstContentElement",
              modalHeader: () => {
                return "Delete???";
              },
              supportsBulk: false,
            },
            {
              RenderModal: () => <div>Duplicate Modal</div>,
              id: "duplicate",
              isPrimary: false,
              label: "Duplicate item",
              modalFocusOnMount: "firstContentElement",
              modalHeader: () => {
                return "Duplicate???";
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
              isValid: {
                required: true,
              },
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
            },
          ]}
          getItemId={(item) => String(item.id)}
          isItemClickable={() => true}
          onChangeView={(item) => {
            console.log("hehehe", item);
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
        <MediaLibrary length={10} />
      </div>
    </div>
  );
};

export default Home;
