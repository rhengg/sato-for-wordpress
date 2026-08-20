import React from "react";
import Toggle from "../../components/Toggle";
import ColorPicker from "../../components/ColorPicker";
import axios from "../../utils/axios-instance";
import { signal } from "@preact/signals";
import SEOcard from "../../components/SEOcard";
import SizePicker from "../../components/SizePicker";
import ImagePicker from "../../components/ImagePicker";
import config from "../../config";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import VideoPicker, {
  waitForVideoProcessing,
} from "../../components/VideoPicker";
import Accordion from "../../components/Accordion";
import { config as playerconfig } from "../../utils/default-config";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../components/Table";
import SatoLogo from "../../components/SatoLogo";
import ImageRadioGroup from "../../components/ImageRadioButton";
import Dropdown from "../../components/Dropdown";
import { fetchImage } from "../../utils/helper";
import Premium from "../../components/PremiumIcon";
import CompleteSvg from "../../assets/Complete.svg";
import { Button, Snackbar } from "@wordpress/components";
import { Input } from "@wordpress/ui";
import { NoticeType } from "../Home";
import LivePlayer from "../../components/LivePlayer";
import EmptyPlayersState from "../../components/EmptyCard";

export type VideoConfigType = {
  videotitle: string;
  videodescription: string;
  playerBrandingImageUrl: string;
  playerThumbnailImageUrl: string;

  playersettings: {
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
    use_as_BG_video: boolean;
  };

  playerstyle: {
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
    progress_bar_FG_color: string;
    progress_bar_loaded_color: string;
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
  };

  playercontrol: {
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
  };

  premium?: {
    layoutConfig?: {
      name?: string | "halcyon" | "moderna" | "sphinx" | "prosper";
      controls_bg?: string | undefined;
      controls_padding?: string;
      controls_corner_radius?: string;
    };
    playerCTA?: {
      cta?: boolean;
      url?: string;
      buttonText?: string;
      placement?: string;
      timing?: string;
      direction?: string;
      heading?: string;
      description?: string;
      imageEnable?: boolean;
      image?: string;
    };
    rapidEngage?: boolean;
    caption?: boolean;
  };
  captionSettings?: {
    captionFromBottom?: string;
    captionFontSize?: string;
  };
};

export const videoUrlUpdate = signal("");
const playerNameUpdate = signal("");
export const videoUrlExtensionUpdate = signal("");
export const videoTranscript = signal("");

export const videoconfigupdate = signal<VideoConfigType>({
  videotitle: "",
  videodescription: "",
  playerBrandingImageUrl: "",
  playerThumbnailImageUrl: "",
  playersettings: {
    autoplay: false,
    muted: false,
    loop: false,
    use_as_BG_video: false,
  },
  playerstyle: {
    text_color: "#000000",
    player_brand_color: "#000000",
    icon_color: "#FFFFFF",
    icon_button_color: "#4fc922",
    icon_button_opacity: "100",
    icon_button_hover_color: "#4f9934",
    center_icon_color: "#FFFFFF",
    center_icon_button_color: "#4fc922",
    center_icon_button_opacity: "100",
    center_icon_button_hover_color: "#4f9934",
    progress_bar_BG_color: "#4fc922",
    progress_bar_FG_color: "#f00a0a",
    progress_bar_loaded_color: "#f5cbcb",
    progress_bar_circle_color: "#f00a0a",
    progress_bar_opacity: "100",
    settings_menu_BG_color: "#4fc922",
    settings_menu_opacity: "100",
    settings_menu_BG_hover_color: "#4f9934",
    settings_menu_text_color: "#000000",
    tooltip_BG_color: "#4fc922",
    tooltip_opacity: "100",
    tooltip_corner_radius: "0",
    tooltip_text_color: "#000000",
    volume_bar_BG_color: "#4fc922",
    volume_bar_opacity: "100",
    volume_bar_FG_color: "#f00a0a",
    player_corner_radius: "0",
    player_controls_margin: "30",
    bottom_bar_spacing: "12",
    icon_button_padding: "0",
    icon_button_corner_radius: "50",
    icon_button_size: "30",
    center_icon_button_padding: "0",
    center_icon_button_corner_radius: "50",
    center_icon_button_size: "70",
    progress_bar_size: "4",
    progress_bar_hover_scale: "2",
    volume_bar_size: "4",
    branding_opacity: "100",
  },
  playercontrol: {
    branding: true,
    thumbnail: true,
    video_frame: false,
    playpause: true,
    center_playpause: true,
    progress_bar: true,
    time_stamp: true,
    volume: true,
    full_screen_icon: true,
    video_name: true,
    settings_menu: true,
    back_button: false,
    gradient: true,
    osd_auto_hide: true,
    scrubber: true,
  },
  premium: {
    layoutConfig: {
      name: "halcyon",
      controls_bg: "#59585B",
      controls_padding: "16",
      controls_corner_radius: "24",
    },
    playerCTA: {
      cta: false,
      url: "",
      buttonText: "",
      placement: "bottom-left",
      timing: "post",
      direction: "vertical",
      heading: "",
      description: "",
      imageEnable: false,
      image: "",
    },
    rapidEngage: false,
    caption: false,
  },
  captionSettings: {
    captionFromBottom: "70",
    captionFontSize: "24",
  },
});

const Index = ({ token }: { token: string }) => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const videoId = params.get("video");
  const embedUrl = `${config.BASE_URL}/players/embed/${videoId}`;
  const [error, setError] = React.useState("");
  const [activePlan, setActivePlan] = React.useState<any>();
  const [disableSaveButon, setDisableSaveButton] = React.useState(true);
  const [selectedExtension, setSelectedExtension] =
    React.useState<string>("mp4");
  const [refetch, setRefetch] = React.useState(0);
  const [livePlayerKey, setLivePlayerKey] = React.useState(0);
  const [isLoadingPlayerData, setLoadingPlayerData] = React.useState(true);
  const [loadingSource, setLoadingSource] = React.useState(true);
  const [sourceId, setSourceId] = React.useState<any>("");
  const [openModalUpload, setOpenModalUpload] = React.useState<boolean>(false);
  const [media, setMedia] = React.useState([]);
  const [file, setFile] = React.useState<any>();
  const [openModalEditName, setOpenModalEditName] =
    React.useState<boolean>(false);
  const [openModalReset, setOpenModalReset] = React.useState<boolean>(false);
  const [openModalChooseTemplate, setOpenModalChooseTemplate] =
    React.useState<boolean>(false);
  const [transcriptModal, setTranscriptModal] = React.useState(false);
  const [transcriptionFailed, setTranscriptionFailed] = React.useState(false);
  const [transcriptLoading, setTranscriptLoading] = React.useState(false);
  const [transcriptComplete, setTranscriptComplete] = React.useState(false);
  const [sources, setSources] = React.useState([]);
  const [premiumModal, setPremiumModal] = React.useState<{
    open: boolean;
    title: string;
  }>({
    open: false,
    title: "",
  });
  const [openModalTemplateConfirm, setOpenModalTemplateConfirm] =
    React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<
    "halcyon" | "moderna" | "sphinx" | "prosper"
  >("halcyon");
  const [notice, setNotice] = React.useState<NoticeType>();
  const [active, setActive] = React.useState<string[]>(["video-playback"]);
  const [toggleKey, setToggleKey] = React.useState<Record<string, number>>({});

  const reloadToggle = (name: string) => {
    setToggleKey((prev) => ({
      ...prev,
      [name]: (prev[name] || 0) + 1,
    }));
  };

  const showNotice = (item: NoticeType) => {
    setNotice(item);
    setTimeout(() => {
      setNotice(undefined);
    }, 3000);
  };

  const handleTranscribe = async (id: string) => {
    try {
      setTranscriptLoading(true);
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
        await addSource(sourceId, result.video);
        setTranscriptComplete(true);
        showNotice({ status: "success", text: "Video transcripted!" });
        setTranscriptLoading(false);
        setRefetch(Math.random());
      }
      if (result.status === "failed") {
        setTranscriptionFailed(true);
        setTranscriptLoading(false);
        showNotice({ status: "error", text: "Video transcription fail!" });
        return;
      }
    } catch (error) {
      setError("error-transcribing-video");
    } finally {
      setTranscriptLoading(false);
    }
  };

  React.useEffect(() => {
    videoUrlExtensionUpdate.value = selectedExtension as string;
  }, [selectedExtension]);

  const fetchPlayer = async (plan: any) => {
    setLoadingPlayerData(true);
    try {
      const res = await axios.get("/players", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const playerById = res.data.filter((item: any) => item.id === videoId);
      playerNameUpdate.value = playerById[0]?.name;

      const isPremium = plan?.amount > 0 || plan?.name === "Collab";
      const premiumConfig = isPremium
        ? {
            layoutConfig: {
              name:
                playerById[0]?.config?.premium?.layoutConfig?.name || "halcyon",

              controls_bg:
                playerById[0]?.config?.premium?.layoutConfig?.controls_bg ||
                "#59585B",

              controls_padding:
                playerById[0]?.config?.premium?.layoutConfig
                  ?.controls_padding || "16",

              controls_corner_radius:
                playerById[0]?.config?.premium?.layoutConfig
                  ?.controls_corner_radius || "24",
            },
            ...(plan.metadata.premium_features.playerCTA.cta && {
              playerCTA: {
                cta: playerById[0]?.config?.premium?.playerCTA?.cta,
                url: playerById[0]?.config?.premium?.playerCTA?.url || "",
                buttonText:
                  playerById[0]?.config?.premium?.playerCTA?.buttonText || "",
                placement:
                  playerById[0]?.config?.premium?.playerCTA?.placement || "",
                timing: playerById[0]?.config?.premium?.playerCTA?.timing || "",
                direction:
                  playerById[0]?.config?.premium?.playerCTA?.direction || "",
                heading:
                  playerById[0]?.config?.premium?.playerCTA?.heading || "",
                description:
                  playerById[0]?.config?.premium?.playerCTA?.description || "",
                imageEnable:
                  playerById[0]?.config?.premium?.playerCTA?.imageEnable ||
                  false,
                image: playerById[0]?.config?.premium?.playerCTA?.image || "",
              },
            }),
            ...(plan.metadata.premium_features.rapidEngage && {
              rapidEngage: playerById[0]?.config?.premium?.rapidEngage,
            }),
            ...(plan.metadata.premium_features.caption && {
              caption: playerById[0]?.config?.premium?.caption,
            }),
          }
        : undefined;

      videoconfigupdate.value = {
        videotitle: playerById[0]?.config?.videotitle,
        videodescription: playerById[0]?.config?.videodescription,
        playerBrandingImageUrl: playerById[0]?.config?.playerBrandingImageUrl,
        playerThumbnailImageUrl: playerById[0]?.config?.playerThumbnailImageUrl,

        playersettings: {
          autoplay: playerById[0]?.config?.playersettings?.autoplay,
          muted: playerById[0]?.config?.playersettings?.muted,
          loop: playerById[0]?.config?.playersettings?.loop,
          use_as_BG_video:
            playerById[0]?.config?.playersettings?.use_as_BG_video,
        },
        playerstyle: {
          text_color: playerById[0]?.config?.playerstyle?.text_color,
          player_brand_color:
            playerById[0]?.config?.playerstyle?.player_brand_color,
          icon_color: playerById[0]?.config?.playerstyle?.icon_color,
          icon_button_color:
            playerById[0]?.config?.playerstyle?.icon_button_color,
          icon_button_opacity:
            playerById[0]?.config?.playerstyle?.icon_button_opacity,
          icon_button_hover_color:
            playerById[0]?.config?.playerstyle?.icon_button_hover_color,
          center_icon_color:
            playerById[0]?.config?.playerstyle?.center_icon_color,
          center_icon_button_color:
            playerById[0]?.config?.playerstyle?.center_icon_button_color,
          center_icon_button_opacity:
            playerById[0]?.config?.playerstyle?.center_icon_button_opacity,
          center_icon_button_hover_color:
            playerById[0]?.config?.playerstyle?.center_icon_button_hover_color,
          progress_bar_BG_color:
            playerById[0]?.config?.playerstyle?.progress_bar_BG_color,
          progress_bar_FG_color:
            playerById[0]?.config?.playerstyle?.progress_bar_FG_color,
          progress_bar_loaded_color:
            playerById[0]?.config?.playerstyle?.progress_bar_loaded_color,
          progress_bar_circle_color:
            playerById[0]?.config?.playerstyle?.progress_bar_circle_color,
          progress_bar_opacity:
            playerById[0]?.config?.playerstyle?.progress_bar_opacity,
          settings_menu_BG_color:
            playerById[0]?.config?.playerstyle?.settings_menu_BG_color,
          settings_menu_opacity:
            playerById[0]?.config?.playerstyle?.settings_menu_opacity,
          settings_menu_BG_hover_color:
            playerById[0]?.config?.playerstyle?.settings_menu_BG_hover_color,
          settings_menu_text_color:
            playerById[0]?.config?.playerstyle?.settings_menu_text_color,
          tooltip_BG_color:
            playerById[0]?.config?.playerstyle?.tooltip_BG_color,
          tooltip_opacity: playerById[0]?.config?.playerstyle?.tooltip_opacity,
          tooltip_text_color:
            playerById[0]?.config?.playerstyle?.tooltip_text_color,
          tooltip_corner_radius:
            playerById[0]?.config?.playerstyle?.tooltip_corner_radius,
          volume_bar_BG_color:
            playerById[0]?.config?.playerstyle?.volume_bar_BG_color,
          volume_bar_opacity:
            playerById[0]?.config?.playerstyle?.volume_bar_opacity,
          volume_bar_FG_color:
            playerById[0]?.config?.playerstyle?.volume_bar_FG_color,
          player_corner_radius:
            playerById[0]?.config?.playerstyle?.player_corner_radius,
          player_controls_margin:
            playerById[0]?.config?.playerstyle?.player_controls_margin,
          bottom_bar_spacing:
            playerById[0]?.config?.playerstyle?.bottom_bar_spacing,
          icon_button_padding:
            playerById[0]?.config?.playerstyle?.icon_button_padding,
          icon_button_corner_radius:
            playerById[0]?.config?.playerstyle?.icon_button_corner_radius,
          icon_button_size:
            playerById[0]?.config?.playerstyle?.icon_button_size,
          center_icon_button_padding:
            playerById[0]?.config?.playerstyle?.center_icon_button_padding,
          center_icon_button_corner_radius:
            playerById[0]?.config?.playerstyle
              ?.center_icon_button_corner_radius,
          center_icon_button_size:
            playerById[0]?.config?.playerstyle?.center_icon_button_size,
          progress_bar_size:
            playerById[0]?.config?.playerstyle?.progress_bar_size,
          progress_bar_hover_scale:
            playerById[0]?.config?.playerstyle?.progress_bar_hover_scale,
          volume_bar_size: playerById[0]?.config?.playerstyle?.volume_bar_size,
          branding_opacity:
            playerById[0]?.config?.playerstyle?.branding_opacity,
        },
        playercontrol: {
          branding: playerById[0]?.config?.playercontrol?.branding,
          thumbnail: playerById[0]?.config?.playercontrol?.thumbnail,
          video_frame: playerById[0]?.config?.playercontrol?.video_frame,
          playpause: playerById[0]?.config?.playercontrol?.playpause,
          center_playpause:
            playerById[0]?.config?.playercontrol?.center_playpause,
          progress_bar: playerById[0]?.config?.playercontrol?.progress_bar,
          time_stamp: playerById[0]?.config?.playercontrol?.time_stamp,
          volume: playerById[0]?.config?.playercontrol?.volume,
          full_screen_icon:
            playerById[0]?.config?.playercontrol?.full_screen_icon,
          video_name: playerById[0]?.config?.playercontrol?.video_name,
          settings_menu: playerById[0]?.config?.playercontrol?.settings_menu,
          back_button: playerById[0]?.config?.playercontrol?.back_button,
          gradient: playerById[0]?.config?.playercontrol?.gradient,
          osd_auto_hide: playerById[0]?.config?.playercontrol?.osd_auto_hide,
          scrubber: playerById[0]?.config?.playercontrol?.scrubber,
        },
        ...(premiumConfig && { premium: premiumConfig }),
        captionSettings: {
          captionFromBottom:
            playerById[0]?.config?.captionSettings?.captionFromBottom || "70",
          captionFontSize:
            playerById[0]?.config?.captionSettings?.captionFontSize || "24",
        },
      };

      setSelectedTemplate(
        playerById[0]?.config?.premium?.layoutConfig?.name || "halcyon",
      );
      setLoadingPlayerData(false);
    } catch (error: any) {
      setLoadingPlayerData(false);
      if (error.response.status === 401) {
        window.location.href = `${window.location.pathname}?page=sato-signin`;
      }
      if (error?.response?.status === 402) {
        window.location.href = `${window.location.pathname}?page=sato-profile`;
      }
    }
  };

  const fetchSource = async () => {
    try {
      const res = await axios.get(`/players/${videoId}/sources`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sources = res.data || [];
      if (sources.length === 0) {
        setSourceId(undefined);
        return;
      }
      setSources(sources);
      const firstSource = sources[0];
      videoUrlUpdate.value = firstSource?.url;
      videoUrlExtensionUpdate.value = firstSource?.media_type;
      videoTranscript.value = firstSource?.transcripts?.auto;
      setSelectedExtension(firstSource?.media_type);
      setSourceId(firstSource?.id);
      setLoadingSource(false);
    } catch (error) {
      setLoadingSource(false);
    } finally {
      setLoadingSource(false);
    }
  };

  React.useEffect(() => {
    videoconfigupdate.value = {
      ...videoconfigupdate.value,
      premium: {
        ...videoconfigupdate.value.premium,
        layoutConfig: {
          ...videoconfigupdate?.value?.premium?.layoutConfig,
          name: selectedTemplate,
        },
      },
    };
  }, [selectedTemplate]);

  const fetchMedia = async () => {
    try {
      const res = await axios.get("/videos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sorted = res.data?.sort((a: any, b: any) => {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      });
      setMedia(sorted);
    } catch (error) {
      // console.log("error fetching media", error);
    }
  };

  React.useEffect(() => {
    fetchMedia();
    fetchSource();
  }, [refetch]);

  const addSource = async (sourceId?: string, mediaItem?: any) => {
    const transcriptionUrl = mediaItem?.transcription_url;
    const transcodedUrls = mediaItem?.playback_url;

    const data = {
      url: videoUrlUpdate.value,
      media_type: selectedExtension || "mp4",
      transcripts: {
        auto:
          transcriptionUrl &&
          new URL(transcriptionUrl, config.VIDEO_CDN_URL).toString(),
      },
      transcoded_urls: {
        auto:
          transcodedUrls &&
          new URL(transcodedUrls, config.VIDEO_CDN_URL).toString(),
      },
    };

    try {
      if (!sources || sources.length === 0) {
        await axios.post(`/players/${videoId}/sources`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.put(`/players/${videoId}/sources/${sourceId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      showNotice({
        status: "error",
        text: "Failed to add video!",
      });
    }
  };

  const resetDefault = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const data = {
      name: playerNameUpdate.value,
      config: playerconfig[selectedTemplate],
    };
    try {
      await axios.put(`/players/${videoId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showNotice({ status: "success", text: "Player reset to default!" });
      setOpenModalReset(false);
      const plan = await fetchSubscription();
      await fetchPlayer(plan);
      setLivePlayerKey((key) => key + 1);
    } catch (error) {
      showNotice({
        status: "error",
        text: "Error while resetting to default!",
      });
    }
  };

  const updatePlayer = async () => {
    const data = {
      name: playerNameUpdate.value,
      config: videoconfigupdate.value,
    };
    try {
      await axios.put(`/players/${videoId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showNotice({ status: "success", text: "Player updated!" });
      setDisableSaveButton(true);
    } catch (error) {
      showNotice({ status: "error", text: "Error updating player!" });
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await updatePlayer();
    setLivePlayerKey((key) => key + 1);
  };

  const handlePlayerThumbnailOnChange = async (val: string) => {
    let image = new URL(val, config.IMAGE_CDN_URL).toString();
    videoconfigupdate.value.playerThumbnailImageUrl = image;
    videoconfigupdate.value.playercontrol.thumbnail = true;
    await updatePlayer();
    try {
      await fetchImage(image, 3);
    } catch (error) {
      showNotice({ status: "error", text: "Error updating thumbnail!" });
    } finally {
      setLivePlayerKey((key) => key + 1);
    }
  };

  const handlePlayerBrandingOnChange = async (val: string) => {
    let image = new URL(val, config.IMAGE_CDN_URL).toString();
    videoconfigupdate.value.playerBrandingImageUrl = image;
    videoconfigupdate.value.playercontrol.branding = true;
    await updatePlayer();
    try {
      await fetchImage(image, 3); //  retry up to 3 times
    } catch (error) {
      showNotice({ status: "error", text: "Error updating brand!" });
    } finally {
      setLivePlayerKey((key) => key + 1);
    }
  };

  const handlePlayerCTAImageOnChange = async (val: string) => {
    const premium = videoconfigupdate.value.premium;
    const playerCTA = premium?.playerCTA;
    if (!playerCTA) return;
    let image = new URL(val, config.IMAGE_CDN_URL).toString();
    playerCTA.image = image;
    playerCTA.imageEnable = true;
    await updatePlayer();
    try {
      await fetchImage(image, 3); //  retry up to 3 times
    } catch (error) {
      showNotice({ status: "error", text: "Error updating CTA image!" });
    } finally {
      setLivePlayerKey((key) => key + 1);
    }
  };

  const handleToggle = (id: string) => {
    if (active.includes(id)) {
      setActive(active.filter((item) => item !== id));
    } else {
      setActive([...active, id]);
    }
  };

  const getFileName = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const truncate = (text: string = "", maxLength = 50): string => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      maxLength = 30;
    }
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const handleChangeTemplate = async () => {
    const data = {
      name: playerNameUpdate.value,
      config: playerconfig[selectedTemplate],
    };
    try {
      await axios.put(`/players/${videoId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const plan = await fetchSubscription();
      await fetchPlayer(plan);
      showNotice({ status: "success", text: "Theme updated!" });
      setOpenModalChooseTemplate(false);
      setError("");
      setLivePlayerKey((key) => key + 1);
    } catch (error) {
      showNotice({ status: "error", text: "Error updating theme!" });
    }
  };

  const fetchSubscription = async () => {
    try {
      const subRes = await axios.get(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const planRes = await axios.get(
        `/plans/${subRes.data.subscription.plan_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const plan = planRes.data?.plan || null;
      setActivePlan(plan);
      return plan;
    } catch (error) {
      return null;
    }
  };

  React.useEffect(() => {
    const init = async () => {
      const plan = await fetchSubscription();
      await fetchPlayer(plan);
    };

    init();
  }, []);

  if (isLoadingPlayerData && !activePlan && loadingSource)
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
    <div className="detail-main">
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
      <div className="detail-container">
        <div className="detail-sub-container-2 sato-hide-scroll">
          <div className="detail-sub-container-child">
            <SatoLogo />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <p className="satoSubtitle-three">Player Name: </p>
                <p className="satoBody">{playerNameUpdate.value}</p>
                <span
                  className="material-symbols-outlined m-icon"
                  style={{
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setOpenModalEditName(true);
                  }}
                >
                  edit_square
                </span>
                <Modal
                  isOpen={openModalEditName}
                  setOpen={setOpenModalEditName}
                  title={`Rename Player`}
                  size="sm"
                >
                  <form
                    onSubmit={(e) => {
                      handleSubmit(e);
                      setOpenModalEditName(false);
                    }}
                  >
                    <div style={{ marginBottom: "0.5rem" }}>
                      <p className="satoInput-title">Player name</p>
                    </div>
                    <input
                      style={{ width: "100%" }}
                      className="satoInput-secondary"
                      type={"text"}
                      name={"videotitle"}
                      placeholder="Enter player name"
                      defaultValue={playerNameUpdate.value}
                      maxLength={60}
                      onInput={(e: any) =>
                        (playerNameUpdate.value = e.target.value)
                      }
                    />

                    <button
                      type="submit"
                      className="large-primary-btn"
                      style={{
                        width: "100%",
                        margin: "2rem 0 0 0",
                      }}
                    >
                      Done
                    </button>
                  </form>
                </Modal>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <p className="satoSubtitle-three">Player ID: </p>
                <p className="satoBody">{videoId}</p>
                <span
                  className="material-symbols-outlined m-icon"
                  style={{
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(`${videoId}`);
                      showNotice({ status: "success", text: "Copied!" });
                    } catch (error) {
                      showNotice({
                        status: "error",
                        text: "Error copying!",
                      });
                    }
                  }}
                >
                  content_copy
                </span>
              </div>
            </div>

            <div
              style={{
                width: "100%",
                marginTop: "1.5rem",
                boxSizing: "border-box",
                border: "1px solid",
                borderColor: "var(--satoStroke)",
                borderRadius: "0.25rem",
              }}
            >
              <div style={{ marginBottom: "0.5rem" }}>
                <p className="satoSubtitle-three">Video name</p>
              </div>
              <div
                className="upload-container"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <Input
                  disabled
                  value={
                    videoUrlUpdate?.value
                      ? truncate(getFileName(videoUrlUpdate.value))
                      : "Add a video to the player from video library or upload a new one."
                  }
                  style={{
                    flex: 2,
                    paddingInlineStart: "1rem",
                  }}
                ></Input>
                <div
                  style={{
                    flex: 1,
                  }}
                  className="w-100"
                >
                  <Button
                    __next40pxDefaultSize={true}
                    variant="primary"
                    icon={"plus"}
                    onClick={() => setOpenModalUpload(true)}
                  >
                    Add Video
                  </Button>
                </div>

                <Modal
                  isOpen={openModalUpload}
                  setOpen={setOpenModalUpload}
                  size="md"
                >
                  <div
                    style={{
                      maxHeight: "34rem",
                      overflowY: "scroll",
                    }}
                  >
                    <div className="v-p-container">
                      <VideoPicker
                        token={token}
                        file={file}
                        setFile={setFile}
                        setRefetch={(u) => {
                          setRefetch(u);
                        }}
                        activePlan={activePlan}
                        setOpenModalUpload={setOpenModalUpload}
                        addSource={addSource}
                        sourceId={sourceId}
                      />
                    </div>

                    {media && media.length > 0 && (
                      <div>
                        <div className="desktop-text-render">
                          <p className="satoSubtitle-two">Uploaded Videos</p>
                        </div>

                        <Table
                          token={token}
                          data={media}
                          setRefetch={(u) => {
                            setRefetch(u);
                          }}
                          activePlan={activePlan}
                          handleClick={async (item: any) => {
                            setOpenModalUpload(false);
                            await addSource(sourceId, item);
                            setRefetch(Math.random());
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Modal>
              </div>
            </div>

            <div
              style={{
                width: "95%",
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {videoUrlUpdate.value !== "" && (
                <LivePlayer key={livePlayerKey} embedUrl={embedUrl} />
              )}
              {videoUrlUpdate.value === "" && (
                <div style={{ width: "100%", aspectRatio: "16/9" }}>
                  <EmptyPlayersState
                    imageSrc="videocam"
                    heading="No video added yet"
                    description="Add a video from your library to preview the player and its configuration settings."
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="detail-sub-container-1 sato-hide-scroll">
          <form
            onSubmit={handleSubmit}
            style={{ position: "relative" }}
            className="toolkit-form"
          >
            <div
              style={{
                position: "sticky",
                top: "0",
                padding: "1rem 0",
                // right: '1rem',
                background: "#fafafa",
                zIndex: 5,
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div style={{ marginBottom: "0.5rem" }}>
                <p className="satoLabel">Save the changes to preview</p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <Button
                  __next40pxDefaultSize={true}
                  variant="primary"
                  type="submit"
                  disabled={disableSaveButon}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Save Edits
                </Button>

                <Button
                  __next40pxDefaultSize={true}
                  variant="secondary"
                  type="button"
                  icon={"controls-repeat"}
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => {
                    setOpenModalReset(true);
                  }}
                >
                  Reset Default
                </Button>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Accordion
                active={active}
                handleToggle={handleToggle}
                header="Video Playback"
                id="video-playback"
                icon="autoplay"
              >
                <div
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <Toggle
                    key={`autoplay-${toggleKey.autoplay || 0}`}
                    name={"autoplay"}
                    label={"Auto Play"}
                    checked={videoconfigupdate.value.playersettings.autoplay}
                    onChange={(e: any) => {
                      videoconfigupdate.value.playersettings.autoplay =
                        e.target.checked;
                      videoconfigupdate.value.playersettings.muted =
                        e.target.checked;
                      setDisableSaveButton(false);
                      reloadToggle("autoplay");
                    }}
                  />

                  <Toggle
                    key={`muted-${toggleKey.muted || 0}`}
                    name={"muted"}
                    label={"Muted"}
                    checked={videoconfigupdate.value.playersettings.muted}
                    onChange={(e: any) => {
                      if (videoconfigupdate.value.playersettings.autoplay)
                        return;
                      videoconfigupdate.value.playersettings.muted =
                        e.target.checked;
                      setDisableSaveButton(false);
                      reloadToggle("muted");
                    }}
                    tooltipText="All autoplay-enabled videos are mute by default until manually unmuted"
                  />

                  <Toggle
                    key={`loop-${toggleKey.loop || 0}`}
                    name={"loop"}
                    label={"Loop"}
                    checked={videoconfigupdate.value.playersettings.loop}
                    onChange={(e: any) => {
                      videoconfigupdate.value.playersettings.loop =
                        e.target.checked;
                      setDisableSaveButton(false);
                      reloadToggle("loop");
                    }}
                    tooltipText="Your video will play in loop until manually paused"
                  />
                </div>
              </Accordion>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Accordion
                active={active}
                handleToggle={handleToggle}
                header="Theme Style"
                id="theme-style"
                icon="colorize"
                premium={
                  !activePlan?.metadata?.premium_features?.layoutConfig?.name
                }
                onPremiumClick={(title) => {
                  setPremiumModal({
                    open: true,
                    title,
                  });
                }}
                premiumModalTitle={"Upgrade to Pro plan"}
              >
                <div
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.25rem",
                      position: "relative",
                      marginBottom: selectedTemplate !== "halcyon" ? "1rem" : 0,
                    }}
                  >
                    <p className="satoBody satoPlaceholder">Change Theme</p>
                    <p
                      className="satoBody satoPrimary"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setOpenModalChooseTemplate(true);
                      }}
                    >
                      Change
                    </p>
                  </div>

                  {selectedTemplate !== "halcyon" && (
                    <>
                      <SizePicker
                        label={"Padding"}
                        name={"controls-container-padding"}
                        // @ts-ignore
                        value={
                          videoconfigupdate.value.premium?.layoutConfig
                            ?.controls_padding
                        }
                        // @ts-ignore
                        onChange={(e: any) => {
                          videoconfigupdate.value = {
                            ...videoconfigupdate.value,
                            premium: {
                              ...videoconfigupdate.value.premium,
                              layoutConfig: {
                                ...videoconfigupdate.value.premium
                                  ?.layoutConfig,
                                controls_padding: e.target.value,
                              },
                            },
                          };
                          setDisableSaveButton(false);
                        }}
                      />

                      <SizePicker
                        label={"Radius"}
                        name={"control-container-radius"}
                        // @ts-ignore
                        value={
                          videoconfigupdate?.value.premium?.layoutConfig
                            ?.controls_corner_radius
                        }
                        onChange={(e: any) => {
                          videoconfigupdate.value = {
                            ...videoconfigupdate.value,
                            premium: {
                              ...videoconfigupdate.value.premium,
                              layoutConfig: {
                                ...videoconfigupdate.value.premium
                                  ?.layoutConfig,
                                controls_corner_radius: e.target.value,
                              },
                            },
                          };

                          setDisableSaveButton(false);
                        }}
                      />

                      <ColorPicker
                        label={"Primary Color"}
                        name={"control-container-color"}
                        value={
                          videoconfigupdate.value?.premium?.layoutConfig
                            ?.controls_bg
                        }
                        onChange={(e: string) => {
                          videoconfigupdate.value = {
                            ...videoconfigupdate.value,
                            premium: {
                              ...videoconfigupdate.value.premium,
                              layoutConfig: {
                                ...videoconfigupdate.value.premium
                                  ?.layoutConfig,
                                controls_bg: e,
                              },
                            },
                          };

                          setDisableSaveButton(false);
                        }}
                      />
                    </>
                  )}
                </div>
              </Accordion>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Accordion
                active={active}
                handleToggle={handleToggle}
                header="Player Style"
                id="player-style"
                icon="movie_edit"
              >
                <div
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <SizePicker
                    label={"Padding"}
                    name={"inner-padding"}
                    value={
                      videoconfigupdate.value.playerstyle.player_controls_margin
                    }
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.player_controls_margin =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <SizePicker
                    label={"Radius"}
                    name={"corner-radius"}
                    value={
                      videoconfigupdate.value.playerstyle.player_corner_radius
                    }
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.player_corner_radius =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <Toggle
                    key={`gradient-${toggleKey.gradient || 0}`}
                    name={"gradient"}
                    label={"Gradient"}
                    checked={videoconfigupdate.value.playercontrol.gradient}
                    onChange={(e: any) => {
                      videoconfigupdate.value.playercontrol.gradient =
                        e.target.checked;
                      setDisableSaveButton(false);
                      reloadToggle("gradient");
                    }}
                  />

                  <Toggle
                    key={`osd-${toggleKey.osd || 0}`}
                    name={"osd-auto-hide"}
                    label={"OSD Autohide"}
                    checked={
                      videoconfigupdate.value.playercontrol.osd_auto_hide
                    }
                    onChange={(e: any) => {
                      videoconfigupdate.value.playercontrol.osd_auto_hide =
                        e.target.checked;
                      setDisableSaveButton(false);
                      reloadToggle("osd");
                    }}
                  />
                </div>
              </Accordion>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Accordion
                active={active}
                handleToggle={handleToggle}
                header="OSD Style"
                id="osd-style"
                icon="gamepad"
              >
                <div
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "1rem",
                    }}
                  >
                    <p className="satoSubtitle-two">Primary Play Button</p>
                  </div>

                  <Toggle
                    key={`cntrbtn-${toggleKey.cntrbtn || 0}`}
                    name={"center-btn-show"}
                    label={"Show/Hide"}
                    checked={
                      videoconfigupdate.value.playercontrol.center_playpause
                    }
                    onChange={(e: any) => {
                      videoconfigupdate.value.playercontrol.center_playpause =
                        e.target.checked;
                      setDisableSaveButton(false);
                      reloadToggle("cntrbtn");
                    }}
                  />
                  <SizePicker
                    label={"Size"}
                    name={"center-btn-size"}
                    // @ts-ignore
                    value={
                      videoconfigupdate.value.playerstyle
                        .center_icon_button_size
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.center_icon_button_size =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <SizePicker
                    label={"Padding"}
                    name={"center-btn-padding"}
                    // @ts-ignore
                    value={
                      videoconfigupdate.value.playerstyle
                        .center_icon_button_padding
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.center_icon_button_padding =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <SizePicker
                    label={"Radius"}
                    name={"center-btn-corner-radius"}
                    // @ts-ignore
                    value={
                      videoconfigupdate.value.playerstyle
                        .center_icon_button_corner_radius
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.center_icon_button_corner_radius =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <ColorPicker
                    label={"Color"}
                    name={"center-btn-color"}
                    value={
                      videoconfigupdate.value.playerstyle
                        .center_icon_button_color
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.center_icon_button_color =
                        e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <ColorPicker
                    label={"Play Icon Color"}
                    name={"center-icon-color"}
                    value={
                      videoconfigupdate.value.playerstyle.center_icon_color
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.center_icon_color = e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <ColorPicker
                    label={"Hover Color"}
                    name={"center-btn-hover-color"}
                    value={
                      videoconfigupdate.value.playerstyle
                        .center_icon_button_hover_color
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.center_icon_button_hover_color =
                        e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <SizePicker
                    label={"Opacity"}
                    name={"center-btn-opacity"}
                    // @ts-ignore
                    value={
                      videoconfigupdate.value.playerstyle
                        .center_icon_button_opacity
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.center_icon_button_opacity =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <div
                    style={{
                      marginBottom: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--satoStroke)",
                    }}
                  >
                    <p className="satoSubtitle-two">
                      Control Icons (Mini Controls)
                    </p>
                  </div>

                  <Toggle
                    key={`smallplay-${toggleKey.smallplay || 0}`}
                    name={"small-icon-play-show"}
                    label={"Play Button"}
                    checked={videoconfigupdate.value.playercontrol.playpause}
                    onChange={(e: any) => {
                      videoconfigupdate.value.playercontrol.playpause =
                        e.target.checked;
                      setDisableSaveButton(false);
                      reloadToggle("smallplay");
                    }}
                  />

                  <Toggle
                    key={`smallvol-${toggleKey.smallvol || 0}`}
                    name={"small-icon-vol-show"}
                    label={"Volume Button"}
                    checked={videoconfigupdate.value.playercontrol.volume}
                    onChange={(e: any) => {
                      videoconfigupdate.value.playercontrol.volume =
                        e.target.checked;
                      setDisableSaveButton(false);
                      reloadToggle("smallvol");
                    }}
                  />

                  <Toggle
                    key={`settings-${toggleKey.settings || 0}`}
                    name={"small-icon-setting-show"}
                    label={"Settings Button"}
                    checked={
                      videoconfigupdate.value.playercontrol.settings_menu
                    }
                    onChange={(e: any) => {
                      videoconfigupdate.value.playercontrol.settings_menu =
                        e.target.checked;
                      setDisableSaveButton(false);
                      reloadToggle("settings");
                    }}
                  />

                  <Toggle
                    key={`fullscreen-${toggleKey.fullscreen || 0}`}
                    name={"small-icon-fullscreen-show"}
                    label={"Fullscreen Button"}
                    checked={
                      videoconfigupdate.value.playercontrol.full_screen_icon
                    }
                    onChange={(e: any) => {
                      videoconfigupdate.value.playercontrol.full_screen_icon =
                        e.target.checked;
                      setDisableSaveButton(false);
                      reloadToggle("fullscreen");
                    }}
                  />

                  <SizePicker
                    label={"Size"}
                    name={"small-icon-size"}
                    // @ts-ignore
                    value={videoconfigupdate.value.playerstyle.icon_button_size}
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.icon_button_size =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <SizePicker
                    label={"Padding"}
                    name={"small-icon-padding"}
                    // @ts-ignore
                    value={
                      videoconfigupdate.value.playerstyle.icon_button_padding
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.icon_button_padding =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <SizePicker
                    label={"Radius"}
                    name={"small-icon-corner-radius"}
                    // @ts-ignore
                    value={
                      videoconfigupdate.value.playerstyle
                        .icon_button_corner_radius
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.icon_button_corner_radius =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <ColorPicker
                    label={"Color"}
                    name={"small-icon-color"}
                    value={
                      videoconfigupdate.value.playerstyle.icon_button_color
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.icon_button_color = e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <ColorPicker
                    label={"Icon Color"}
                    name={"small-icon-color"}
                    value={videoconfigupdate.value.playerstyle.icon_color}
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.icon_color = e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <ColorPicker
                    label={"Hover Color"}
                    name={"small-icon-hover-color"}
                    value={
                      videoconfigupdate.value.playerstyle
                        .icon_button_hover_color
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.icon_button_hover_color =
                        e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <SizePicker
                    label={"Opacity"}
                    name={"small-icon-opacity"}
                    // @ts-ignore
                    value={
                      videoconfigupdate.value.playerstyle.icon_button_opacity
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.icon_button_opacity =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />
                </div>
              </Accordion>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Accordion
                active={active}
                handleToggle={handleToggle}
                header="Progress Bar"
                id="progress-bar"
                icon="sliders"
              >
                <div
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <Toggle
                    key={`progress-${toggleKey.progress || 0}`}
                    name={"progress-bar-show"}
                    label={"Show"}
                    checked={videoconfigupdate.value.playercontrol.progress_bar}
                    onChange={(e: any) => {
                      videoconfigupdate.value.playercontrol.progress_bar =
                        e.target.checked;
                      setDisableSaveButton(false);
                      reloadToggle("progress");
                    }}
                  />

                  <Toggle
                    key={`scrubber-${toggleKey.scrubber || 0}`}
                    name={"progress-bar-scrubber"}
                    label={"Scrubber"}
                    checked={videoconfigupdate.value.playercontrol.scrubber}
                    onChange={(e: any) => {
                      videoconfigupdate.value.playercontrol.scrubber =
                        e.target.checked;
                      setDisableSaveButton(false);
                      reloadToggle("scrubber");
                    }}
                  />

                  <Toggle
                    key={`timestamp-${toggleKey.timestamp || 0}`}
                    name={"progress-bar-time"}
                    label={"Timestamp"}
                    checked={videoconfigupdate.value.playercontrol.time_stamp}
                    onChange={(e: any) => {
                      if (videoconfigupdate.value?.premium?.rapidEngage) {
                        return setError("rapid-engage-enabled");
                      }
                      videoconfigupdate.value.playercontrol.time_stamp =
                        e.target.checked;
                      setDisableSaveButton(false);
                      reloadToggle("timestamp");
                    }}
                  />

                  {error === "rapid-engage-enabled" && (
                    <div className="error-container">
                      <p className="error-text">
                        Super progress is already enabled
                      </p>
                    </div>
                  )}

                  <Toggle
                    key={`videoframe-${toggleKey.videoframe || 0}`}
                    name={"video-frame"}
                    label={"Video Frame"}
                    checked={videoconfigupdate.value.playercontrol.video_frame}
                    onChange={(e: any) => {
                      if (videoconfigupdate.value?.premium?.rapidEngage) {
                        return setError("rapid-engage-enabled");
                      }
                      videoconfigupdate.value.playercontrol.video_frame =
                        e.target.checked;
                      setDisableSaveButton(false);
                      reloadToggle("videoframe");
                    }}
                  />

                  {error === "rapid-engage-enabled" && (
                    <div className="error-container">
                      <p className="error-text">
                        Super progress is already enabled
                      </p>
                    </div>
                  )}

                  <Toggle
                    key={`superprgrs-${toggleKey.superprgrs || 0}`}
                    name={"super-progress"}
                    label={"Super Progress"}
                    disabled={
                      !activePlan?.metadata?.premium_features?.rapidEngage
                    }
                    checked={videoconfigupdate.value.premium?.rapidEngage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setError("");
                      videoconfigupdate.value = {
                        ...videoconfigupdate.value,
                        premium: {
                          ...videoconfigupdate.value.premium,
                          rapidEngage: e.target.checked,
                        },
                      };
                      videoconfigupdate.value.playercontrol.time_stamp = false;
                      videoconfigupdate.value.playercontrol.video_frame = false;
                      setDisableSaveButton(false);
                      reloadToggle("superprgrs");
                    }}
                    showCaptions={true}
                    onPremiumClick={(title) => {
                      setPremiumModal({
                        open: true,
                        title,
                      });
                    }}
                    premiumModalTitle={"Upgrade to Advanced plan"}
                  />

                  <SizePicker
                    label={"Bottom Padding"}
                    name={"spacing-from-bottom"}
                    // @ts-ignore
                    value={
                      videoconfigupdate.value.playerstyle.bottom_bar_spacing
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.bottom_bar_spacing =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <SizePicker
                    label={"Thickness"}
                    name={"progress-bar-height"}
                    // @ts-ignore
                    value={
                      videoconfigupdate.value.playerstyle.progress_bar_size
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.progress_bar_size =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <SizePicker
                    label={"On-Hover Scale"}
                    name={"progress-bar-scale-on-hover"}
                    // @ts-ignore
                    value={
                      videoconfigupdate.value.playerstyle
                        .progress_bar_hover_scale
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.progress_bar_hover_scale =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <div
                    style={{
                      marginBottom: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--satoStroke)",
                    }}
                  >
                    <p className="satoSubtitle-two">Progress Bar Color</p>
                  </div>

                  <ColorPicker
                    label={"Foreground Color"}
                    name={"progress-bar-fg-color"}
                    value={
                      videoconfigupdate.value.playerstyle.progress_bar_FG_color
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.progress_bar_FG_color =
                        e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <ColorPicker
                    label={"Background Color"}
                    name={"progress-bar-bg-color"}
                    value={
                      videoconfigupdate.value.playerstyle.progress_bar_BG_color
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.progress_bar_BG_color =
                        e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <ColorPicker
                    label={"Loaded Color"}
                    name={"progress-bar-loaded-color"}
                    value={
                      videoconfigupdate.value.playerstyle
                        .progress_bar_loaded_color
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.progress_bar_loaded_color =
                        e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <ColorPicker
                    label={"Scrubber Color"}
                    name={"progress-bar-circle-color"}
                    value={
                      videoconfigupdate.value.playerstyle
                        .progress_bar_circle_color
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.progress_bar_circle_color =
                        e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <SizePicker
                    label={"Opacity"}
                    name={"progress-bar-opacity"}
                    // @ts-ignore
                    value={
                      videoconfigupdate.value.playerstyle.progress_bar_opacity
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.progress_bar_opacity =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <div
                    style={{
                      marginBottom: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--satoStroke)",
                    }}
                  >
                    <p className="satoSubtitle-two">Tooltip Styling</p>
                  </div>

                  <ColorPicker
                    label={"Background Color"}
                    name={"tooltip-bg-color"}
                    value={videoconfigupdate.value.playerstyle.tooltip_BG_color}
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.tooltip_BG_color = e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <ColorPicker
                    label={"Text Color"}
                    name={"tooltip-text-color"}
                    value={
                      videoconfigupdate.value.playerstyle.tooltip_text_color
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.tooltip_text_color =
                        e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <SizePicker
                    label={"Radius"}
                    name={"tooltip-corner-radius"}
                    // @ts-ignore
                    value={
                      videoconfigupdate.value.playerstyle.tooltip_corner_radius
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.tooltip_corner_radius =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <SizePicker
                    label={"Opacity"}
                    name={"tooltip-opacity"}
                    // @ts-ignore
                    value={videoconfigupdate.value.playerstyle.tooltip_opacity}
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.tooltip_opacity =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />
                </div>
              </Accordion>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Accordion
                active={active}
                handleToggle={handleToggle}
                header="Volume Bar"
                id="volume-bar"
                icon="brand_awareness"
              >
                <div
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <SizePicker
                    label={"Size"}
                    name={"volume-bar-size"}
                    // @ts-ignore
                    value={videoconfigupdate.value.playerstyle.volume_bar_size}
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.volume_bar_size =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />
                  <ColorPicker
                    label={"Background Color"}
                    name={"volume-bar-bg-color"}
                    value={
                      videoconfigupdate.value.playerstyle.volume_bar_BG_color
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.volume_bar_BG_color =
                        e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <ColorPicker
                    label={"Foreground Color"}
                    name={"volume-bar-fg-color"}
                    value={
                      videoconfigupdate.value.playerstyle.volume_bar_FG_color
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.volume_bar_FG_color =
                        e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <SizePicker
                    label={"Opacity"}
                    name={"volume-bar-opacity"}
                    // @ts-ignore
                    value={
                      videoconfigupdate.value.playerstyle.volume_bar_opacity
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.volume_bar_opacity =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />
                </div>
              </Accordion>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Accordion
                active={active}
                handleToggle={handleToggle}
                header="Settings Menu"
                id="settings-menu-design"
                icon="settings_slow_motion"
              >
                <div
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <ColorPicker
                    label={"Background Color"}
                    name={"settting-background-color"}
                    value={
                      videoconfigupdate.value.playerstyle.settings_menu_BG_color
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.settings_menu_BG_color =
                        e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <ColorPicker
                    label={"Hover Color"}
                    name={"settting-hover-color"}
                    value={
                      videoconfigupdate.value.playerstyle
                        .settings_menu_BG_hover_color
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.settings_menu_BG_hover_color =
                        e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <ColorPicker
                    label={"Text Color"}
                    name={"settting-test-color"}
                    value={
                      videoconfigupdate.value.playerstyle
                        .settings_menu_text_color
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.settings_menu_text_color =
                        e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <SizePicker
                    label={"Opacity"}
                    name={"settings-menu-opacity"}
                    // @ts-ignore
                    value={
                      videoconfigupdate.value.playerstyle.settings_menu_opacity
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.settings_menu_opacity =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />
                </div>
              </Accordion>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Accordion
                active={active}
                handleToggle={handleToggle}
                header="Call-to-action"
                id="cta"
                icon="call_to_action"
                premium={
                  !activePlan?.metadata?.premium_features?.playerCTA?.cta
                }
                onPremiumClick={(title) => {
                  setPremiumModal({
                    open: true,
                    title,
                  });
                }}
                premiumModalTitle={"Upgrade to Advanced plan"}
              >
                <div
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      // margin: "1rem 0",
                      width: "100%",
                    }}
                  >
                    <p className="satoInput-title">URL</p>
                    <input
                      className="satoInput-secondary"
                      style={{
                        width: "100%",
                        cursor: !activePlan?.metadata?.premium_features
                          ?.playerCTA?.url
                          ? "not-allowed"
                          : "pointer",
                      }}
                      disabled={
                        !activePlan?.metadata?.premium_features?.playerCTA?.url
                      }
                      autoComplete="off"
                      type="text"
                      defaultValue={
                        videoconfigupdate.value?.premium?.playerCTA?.url
                      }
                      onInput={(e: any) => {
                        const value = e.target.value;

                        videoconfigupdate.value = {
                          ...videoconfigupdate.value,
                          premium: {
                            ...videoconfigupdate.value.premium!,
                            playerCTA: {
                              ...videoconfigupdate.value.premium!.playerCTA,
                              url: value,
                            },
                          },
                        };
                        setDisableSaveButton(false);
                      }}
                      name="cta-url"
                      placeholder="Enter URL"
                    />
                  </div>

                  <div
                    style={{
                      margin: "1rem 0",
                      width: "100%",
                    }}
                  >
                    <p className="satoInput-title">Heading</p>
                    <input
                      className="satoInput-secondary"
                      style={{
                        width: "100%",
                        cursor: !activePlan?.metadata?.premium_features
                          ?.playerCTA?.heading
                          ? "not-allowed"
                          : "pointer",
                      }}
                      disabled={
                        !activePlan?.metadata?.premium_features?.playerCTA
                          ?.heading
                      }
                      autoComplete="off"
                      type="text"
                      defaultValue={
                        videoconfigupdate.value?.premium?.playerCTA?.heading
                      }
                      onInput={(e: any) => {
                        const value = e.target.value;

                        videoconfigupdate.value = {
                          ...videoconfigupdate.value,
                          premium: {
                            ...videoconfigupdate.value.premium!,
                            playerCTA: {
                              ...videoconfigupdate.value.premium!.playerCTA,
                              heading: value,
                            },
                          },
                        };
                        setDisableSaveButton(false);
                      }}
                      name="cta-heading"
                      placeholder="Enter heading"
                      maxLength={30}
                    />
                  </div>

                  <div
                    style={{
                      margin: "1rem 0",
                      width: "100%",
                    }}
                  >
                    <p className="satoInput-title">Description</p>
                    <input
                      className="satoInput-secondary"
                      style={{
                        width: "100%",
                        cursor: !activePlan?.metadata?.premium_features
                          ?.playerCTA?.description
                          ? "not-allowed"
                          : "pointer",
                      }}
                      disabled={
                        !activePlan?.metadata?.premium_features?.playerCTA
                          ?.description
                      }
                      autoComplete="off"
                      type="text"
                      defaultValue={
                        videoconfigupdate.value?.premium?.playerCTA?.description
                      }
                      onInput={(e: any) => {
                        const value = e.target.value;

                        videoconfigupdate.value = {
                          ...videoconfigupdate.value,
                          premium: {
                            ...videoconfigupdate.value.premium!,
                            playerCTA: {
                              ...videoconfigupdate.value.premium!.playerCTA,
                              description: value,
                            },
                          },
                        };
                        setDisableSaveButton(false);
                      }}
                      name="cta-description"
                      placeholder="Enter description"
                      maxLength={50}
                    />
                  </div>

                  <div
                    style={{
                      margin: "1rem 0",
                      width: "100%",
                    }}
                  >
                    <p className="satoInput-title">Button Text</p>
                    <input
                      className="satoInput-secondary"
                      style={{
                        width: "100%",
                        cursor: !activePlan?.metadata?.premium_features
                          ?.playerCTA?.buttonText
                          ? "not-allowed"
                          : "pointer",
                      }}
                      disabled={
                        !activePlan?.metadata?.premium_features?.playerCTA
                          ?.buttonText
                      }
                      autoComplete="off"
                      type="text"
                      maxLength={15}
                      defaultValue={
                        videoconfigupdate.value?.premium?.playerCTA?.buttonText
                      }
                      onInput={(e: any) => {
                        const value = e.target.value;
                        videoconfigupdate.value = {
                          ...videoconfigupdate.value,
                          premium: {
                            ...videoconfigupdate.value.premium!,
                            playerCTA: {
                              ...videoconfigupdate.value.premium!.playerCTA,
                              buttonText: value,
                            },
                          },
                        };
                        setDisableSaveButton(false);
                      }}
                      name="cta-title"
                      placeholder="Enter Button Text"
                    />
                  </div>

                  <Dropdown
                    label="Position"
                    disabled={
                      !activePlan?.metadata?.premium_features?.playerCTA
                        ?.placement
                    }
                    value={
                      videoconfigupdate.value?.premium?.playerCTA?.placement
                    }
                    onChange={(val: any) => {
                      const value = val;
                      videoconfigupdate.value = {
                        ...videoconfigupdate.value,
                        premium: {
                          ...videoconfigupdate.value.premium!,
                          playerCTA: {
                            ...videoconfigupdate.value.premium!.playerCTA,
                            placement: value,
                          },
                        },
                      };
                      setDisableSaveButton(false);
                    }}
                    options={[
                      { label: "Top Left", value: "top-left" },
                      { label: "Top Center", value: "top-center" },
                      { label: "Top Right", value: "top-right" },
                      { label: "Bottom Left", value: "bottom-left" },
                      { label: "Bottom Center", value: "bottom-center" },
                      { label: "Bottom Right", value: "bottom-right" },
                    ]}
                  />

                  <Dropdown
                    label="Placement"
                    disabled={
                      !activePlan?.metadata?.premium_features?.playerCTA?.timing
                    }
                    value={videoconfigupdate.value?.premium?.playerCTA?.timing}
                    onChange={(val: any) => {
                      const value = val;

                      videoconfigupdate.value = {
                        ...videoconfigupdate.value,
                        premium: {
                          ...videoconfigupdate.value.premium!,
                          playerCTA: {
                            ...videoconfigupdate.value.premium!.playerCTA,
                            timing: value,
                          },
                        },
                      };
                      setDisableSaveButton(false);
                    }}
                    options={[
                      { label: "Preroll", value: "pre" },
                      { label: "Midroll", value: "mid" },
                      { label: "Postroll", value: "post" },
                    ]}
                  />

                  <Dropdown
                    label="Type"
                    disabled={
                      !activePlan?.metadata?.premium_features?.playerCTA
                        ?.direction
                    }
                    value={
                      videoconfigupdate.value?.premium?.playerCTA?.direction
                    }
                    onChange={(val: any) => {
                      const value = val;

                      videoconfigupdate.value = {
                        ...videoconfigupdate.value,
                        premium: {
                          ...videoconfigupdate.value.premium!,
                          playerCTA: {
                            ...videoconfigupdate.value.premium!.playerCTA,
                            direction: value,
                          },
                        },
                      };
                      setDisableSaveButton(false);
                    }}
                    options={[
                      { label: "Vertical", value: "vertical" },
                      { label: "Horizontal", value: "horizontal" },
                    ]}
                  />

                  <div style={{ width: "100%" }}>
                    <ImagePicker
                      token={token}
                      disabled={
                        !activePlan?.metadata?.premium_features?.playerCTA
                          ?.image
                      }
                      onChange={(val: any) => {
                        handlePlayerCTAImageOnChange(val);
                      }}
                      label="Upload Image"
                      // setImageUploading={setCTAImageUploading}
                      uploadedUrl={
                        videoconfigupdate.value.premium?.playerCTA?.image
                      }
                    />
                  </div>

                  <Toggle
                    key={`imgenable-${toggleKey.imgenable || 0}`}
                    name={"imageEnable"}
                    label={"Enable Image"}
                    disabled={
                      !activePlan?.metadata?.premium_features?.playerCTA
                        ?.imageEnable
                    }
                    checked={
                      videoconfigupdate.value?.premium?.playerCTA?.imageEnable
                        ? true
                        : false
                    }
                    onChange={(e: any) => {
                      if (videoconfigupdate.value.premium?.playerCTA?.image) {
                        videoconfigupdate.value.premium.playerCTA.imageEnable =
                          e.target.checked;
                        setDisableSaveButton(false);
                        reloadToggle("imgenable");
                      } else {
                        setError("upload-cta-thumbnail-error");
                      }
                    }}
                  />

                  <div className="error-container">
                    {error === "upload-cta-thumbnail-error" && (
                      <p className="error-text">
                        Upload CTA Thumbnail to preview
                      </p>
                    )}
                  </div>

                  <Toggle
                    key={`ctaenable-${toggleKey.ctaenable || 0}`}
                    name={"enable-cta"}
                    label={"Enable CTA"}
                    disabled={
                      !activePlan?.metadata?.premium_features?.playerCTA?.cta
                    }
                    checked={
                      videoconfigupdate.value?.premium?.playerCTA?.cta
                        ? true
                        : false
                    }
                    onChange={(e: any) => {
                      setError("");
                      if (
                        videoconfigupdate.value?.premium?.playerCTA
                          ?.buttonText &&
                        videoconfigupdate.value?.premium?.playerCTA?.url &&
                        videoconfigupdate.value?.premium?.playerCTA
                          ?.direction &&
                        videoconfigupdate.value?.premium?.playerCTA?.timing &&
                        videoconfigupdate.value?.premium?.playerCTA?.placement
                      ) {
                        videoconfigupdate.value.premium.playerCTA.cta =
                          e.target.checked;
                        setDisableSaveButton(false);
                        reloadToggle("ctaenable");
                      } else {
                        setError("cta-enable-error");
                      }
                    }}
                  />

                  <div className="error-container">
                    {error === "cta-enable-error" && (
                      <p className="error-text">
                        Add CTA Button Text and URL, and select Placement,
                        Display and Type to enable
                      </p>
                    )}
                  </div>
                </div>
              </Accordion>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Accordion
                active={active}
                handleToggle={handleToggle}
                header="Video Details"
                id="metadata-&-thumbnail"
                icon="tooltip_2"
              >
                <div
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <SEOcard
                    title={videoconfigupdate.value.videotitle}
                    setDisableSaveButton={setDisableSaveButton}
                  />

                  <Toggle
                    key={`videoname-${toggleKey.videoname || 0}`}
                    name={"video-name"}
                    label={"Show"}
                    checked={videoconfigupdate.value.playercontrol.video_name}
                    onChange={(e: any) => {
                      setError("");
                      if (videoconfigupdate.value.videotitle) {
                        videoconfigupdate.value.playercontrol.video_name =
                          e.target.checked;
                        setDisableSaveButton(false);
                        reloadToggle("videoname");
                      } else {
                        setError("title-enable-error");
                      }
                    }}
                  />

                  <div className="error-container">
                    {error === "title-enable-error" && (
                      <p className="error-text">Add video name to show</p>
                    )}
                  </div>

                  <ColorPicker
                    label={"Text Color"}
                    name={"text-color"}
                    value={videoconfigupdate.value.playerstyle.text_color}
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.text_color = e;
                      setDisableSaveButton(false);
                    }}
                  />

                  <div style={{ width: "100%" }}>
                    <ImagePicker
                      token={token}
                      onChange={(val: any) => {
                        handlePlayerThumbnailOnChange(val);
                        setDisableSaveButton(false);
                      }}
                      label="Upload Thumbnail"
                      tooltipText="For best results, upload an image that matches the aspect ratio of the video player you create"
                      uploadedUrl={
                        videoconfigupdate.value.playerThumbnailImageUrl
                      }
                    />
                  </div>

                  <Toggle
                    key={`thumbnail-${toggleKey.thumbnail || 0}`}
                    name={"thumbnail"}
                    label={"Show"}
                    checked={
                      videoconfigupdate.value.playercontrol.thumbnail
                        ? true
                        : false
                    }
                    onChange={(e: any) => {
                      if (videoconfigupdate.value.playerThumbnailImageUrl) {
                        videoconfigupdate.value.playercontrol.thumbnail =
                          e.target.checked;
                        setDisableSaveButton(false);
                        reloadToggle("thumbnail");
                      } else {
                        setError("upload-thumbnail-error");
                      }
                    }}
                  />

                  <div
                    className="error-container"
                    style={{ marginBottom: "1rem" }}
                  >
                    {error === "upload-thumbnail-error" && (
                      <p className="error-text">Upload image to show</p>
                    )}
                  </div>
                </div>
              </Accordion>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Accordion
                active={active}
                handleToggle={handleToggle}
                header="Branding"
                id="branding"
                icon="branding_watermark"
              >
                <div
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <ImagePicker
                      token={token}
                      onChange={(val: any) => {
                        handlePlayerBrandingOnChange(val);
                        setDisableSaveButton(false);
                      }}
                      label="Upload Logo"
                      uploadedUrl={
                        videoconfigupdate.value.playerBrandingImageUrl
                      }
                    />
                  </div>

                  <Toggle
                    key={`branding-${toggleKey.branding || 0}`}
                    name={"branding"}
                    label={"Show Logo"}
                    checked={
                      videoconfigupdate.value.playercontrol.branding
                        ? true
                        : false
                    }
                    onChange={(e: any) => {
                      videoconfigupdate.value.playercontrol.branding =
                        e.target.checked;
                      setDisableSaveButton(false);
                      reloadToggle("branding");
                    }}
                  />

                  <SizePicker
                    label={"Opacity"}
                    name={"branding-opacity"}
                    // @ts-ignore
                    value={videoconfigupdate.value.playerstyle.branding_opacity}
                    // @ts-ignore
                    onChange={(e: any) => {
                      videoconfigupdate.value.playerstyle.branding_opacity =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />
                </div>
              </Accordion>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Accordion
                active={active}
                handleToggle={handleToggle}
                header="Speech-to-text"
                id="speech-to-text"
                icon="subtitles"
                premium={!activePlan?.metadata?.premium_features?.caption}
                onPremiumClick={(title) => {
                  setPremiumModal({
                    open: true,
                    title,
                  });
                }}
                premiumModalTitle={"Upgrade to Pro plan"}
              >
                <div
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <Toggle
                    key={`caption-${toggleKey.caption || 0}`}
                    name={"caption"}
                    label={"Show/Hide"}
                    disabled={!activePlan?.metadata?.premium_features?.caption}
                    checked={videoconfigupdate.value.premium?.caption}
                    onChange={(e: any) => {
                      videoconfigupdate.value = {
                        ...videoconfigupdate.value,
                        premium: {
                          ...videoconfigupdate.value.premium,
                          caption: e.target.checked,
                        },
                      };
                      setDisableSaveButton(false);
                      reloadToggle("caption");
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.25rem",
                    }}
                  >
                    <p className="satoBody satoPlaceholder">Transcribe Video</p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      {!!videoTranscript.value && (
                        <img
                          src={CompleteSvg}
                          alt="premium Illustration"
                          style={{ width: "24px", maxWidth: 380 }}
                        />
                      )}
                      <Button
                        variant="primary"
                        disabled={
                          !activePlan?.metadata?.premium_features?.caption ||
                          !!videoTranscript.value ||
                          !videoUrlUpdate.value
                        }
                        onClick={() => {
                          setTranscriptModal(true);
                          setTranscriptionFailed(false);
                        }}
                        title={
                          videoTranscript.value
                            ? "Generated"
                            : !activePlan?.metadata?.premium_features
                                  ?.caption || !videoUrlUpdate.value
                              ? "Add a video to generate"
                              : ""
                        }
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>
              </Accordion>
            </div>
          </form>

          <Modal
            isOpen={transcriptModal}
            setOpen={setTranscriptModal}
            title={""}
            size="sm"
          >
            {transcriptLoading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <Loader
                  borderColor="var(--satoPrimary)"
                  height="44px"
                  width="44px"
                />
                <p className="satoLabel">Generating Caption...</p>

                <button
                  type="button"
                  onClick={() => {
                    setTranscriptModal(false);
                  }}
                  className="large-secondary-btn"
                  style={{
                    width: "100%",
                    marginTop: "1rem",
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
            {transcriptionFailed && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <p className="satoHeading">Speech-to-text</p>

                <p className="satoBody">
                  {truncate(getFileName(videoUrlUpdate.value))}
                </p>

                <p className="error-text">We could not transcribe the video.</p>

                <p
                  className="error-text"
                  style={{ color: "var(--satoTextSecondary)" }}
                >
                  But the video will play normally without captions.
                </p>

                <Link
                  to={"https://www.satoplayer.com/contact-us"}
                  style={{
                    textDecoration: "none",
                  }}
                  className="satoPrimary"
                >
                  Get help
                </Link>
              </div>
            )}
            {!transcriptLoading &&
              !transcriptionFailed &&
              !transcriptComplete && (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: "2rem",
                    }}
                  >
                    <p className="satoHeading">Speech-to-text</p>

                    <p className="satoBody">
                      {truncate(getFileName(videoUrlUpdate.value))}
                    </p>
                    <button
                      type="button"
                      className="large-primary-btn"
                      style={{
                        width: "100%",
                      }}
                      disabled={
                        !activePlan?.metadata?.premium_features?.caption ||
                        !!videoTranscript.value ||
                        transcriptLoading
                      }
                      onClick={() => {
                        handleTranscribe(videoUrlUpdate.value?.split("/")[4]);
                      }}
                    >
                      Generate
                    </button>
                  </div>
                  {error === "error-transcribing-video" && (
                    <div className="error-container">
                      <p className="error-text" style={{ textAlign: "center" }}>
                        Opps! Something went wrong.
                      </p>
                    </div>
                  )}
                </>
              )}

            {transcriptComplete && (
              <>
                <p
                  className="satoLabel"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <img
                      src={CompleteSvg}
                      alt="premium Illustration"
                      style={{ width: "60px", maxWidth: 380 }}
                    />
                  </span>
                  Speech-to-text generated successfully!
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setTranscriptModal(false);
                  }}
                  className="large-primary-btn"
                  style={{
                    width: "100%",
                    marginTop: "1rem",
                  }}
                >
                  Continue
                </button>
              </>
            )}
          </Modal>

          <Modal
            isOpen={premiumModal.open}
            setOpen={(val: any) =>
              setPremiumModal((prev) => ({ ...prev, open: val }))
            }
            title={""}
            size="sm"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                flexDirection: "column",
              }}
            >
              <Premium smIcon={true} width="60" />
              <p className="satoSubtitle-one">{premiumModal.title}</p>

              <button
                className="large-primary-btn"
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onClick={() => {
                  updatePlayer();
                  navigate("/plans");
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
                  Save & Proceed
                </div>
              </button>
            </div>
          </Modal>

          <Modal
            isOpen={openModalChooseTemplate}
            setOpen={setOpenModalChooseTemplate}
            title={`Change Player Theme`}
            size="lg"
          >
            <div style={{ marginTop: "2rem" }}>
              <div
                style={{
                  background: "var(--satoSurface)",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--satoStroke)",
                  padding: "1rem",
                  marginTop: "2rem",
                }}
              >
                <ImageRadioGroup
                  value={selectedTemplate}
                  onChange={setSelectedTemplate}
                  name="template-radio"
                  activePlan={activePlan}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                <button
                  className="large-primary-btn"
                  // onClick={handleChangeTemplate}
                  onClick={() => {
                    setOpenModalTemplateConfirm(true);
                  }}
                  style={{ marginTop: "1rem" }}
                >
                  Apply
                </button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={openModalTemplateConfirm}
            setOpen={setOpenModalTemplateConfirm}
            title={`Continue Change Theme ?`}
            size="sm"
          >
            <p className="satoBody">
              If you proceed, all customisations you might have made to this
              video player will replace with the selected theme.
            </p>

            <button
              type="button"
              onClick={() => {
                handleChangeTemplate();
                setOpenModalTemplateConfirm(false);
              }}
              className="large-primary-btn"
              style={{
                width: "100%",
                margin: "2rem 0 0 0",
              }}
            >
              Continue
            </button>
          </Modal>

          <Modal
            isOpen={openModalReset}
            setOpen={setOpenModalReset}
            title={`Reset to default?`}
            size="sm"
          >
            <p className="satoBody">
              If you proceed, all customisations you might have made to this
              video player will reset to its default state.
            </p>
            <form onSubmit={(e) => resetDefault(e)}>
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
                    setOpenModalReset(false);
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
        </div>
      </div>
    </div>
  );
};

export default Index;
