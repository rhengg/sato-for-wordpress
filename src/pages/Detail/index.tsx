import React from "react";
import Toggle from "../../components/Toggle";
import ColorPicker from "../../components/ColorPicker";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import { signal } from "@preact/signals";
import SEOcard from "../../components/SEOcard";
import SizePicker from "../../components/SizePicker";
import Toast from "../../components/Toast";
import ImagePicker from "../../components/ImagePicker";
import config from "../../config";
import DemoPlayer from "../../components/DemoPlayer";
import IconButton from "../../components/IconButton";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import VideoPicker, {
  waitForVideoProcessing,
} from "../../components/VideoPicker";
import Accordion from "../../components/Accordion";
import { config as playerconfig } from "../../utils/default-config";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../components/Table";
import DetailMenu from "../../components/DetailMenu";
import Tooltip from "../../components/Tooltip";
import ImageRadioGroup from "../../components/ImageRadioButton";
import playerTemplate from "../../database/playerTemplate.json";
import Dropdown from "../../components/Dropdown";
import LivePlayer from "../../components/LivePlayer";
import { makeConfig } from "../../utils/makePlayerConfig";
import { fetchImage } from "../../utils/helper";
import Premium from "../../components/PremiumIcon";
import CompleteSvg from "../../assets/Complete.svg";
import { Button } from "@wordpress/components";

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

// export const videoconfigupdate = signal({
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

// export type VideoConfigType = typeof videoconfigupdate.value;

/**
 * Returns the detail page.
 * URLSearchParams named artist is used to filter the data.
 * DetailTable component is used which renders the music platform analytics card.
 * The entire page renders a profile card, an about card and analytics table.
 */

const Index = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const videoId = params.get("video");
  const [error, setError] = React.useState("");

  const [activePlan, setActivePlan] = React.useState<any>();

  const [disableSaveButon, setDisableSaveButton] = React.useState(true);
  const [token, setToken] = React.useState("");
  const [selectedExtension, setSelectedExtension] =
    React.useState<string>("mp4");
  const [mediaTypeName, setMediaTypeName] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [reRender, setReRender] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [copiedPlayerId, setCopiedPlayerId] = React.useState(false);
  const [isLoadingEmbed, setLoadingEmbed] = React.useState(false);
  const [isLoadingPlayerData, setLoadingPlayerData] = React.useState(true);
  const [loadingSource, setLoadingSource] = React.useState(true);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [embedUrl, setEmbedUrl] = React.useState("");
  const [sourceEmpty, setSourceEmpty] = React.useState(false);
  const [sourceId, setSourceId] = React.useState<any>("");
  const [openModalUpload, setOpenModalUpload] = React.useState<boolean>(false);
  const [media, setMedia] = React.useState([]);
  const [refetch, setRefetch] = React.useState(0);
  const [file, setFile] = React.useState<any>();
  const [openModalEditName, setOpenModalEditName] =
    React.useState<boolean>(false);
  const [openModalReset, setOpenModalReset] = React.useState<boolean>(false);
  const [videoUrlFromModal, setVideoUrlFromModal] =
    React.useState<boolean>(false);

  const [livePlayerConfig, setLivePlayerConfig] = React.useState<any>();

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

  // transcribe video
  const handleTranscribe = async (id: string) => {
    try {
      console.log("id", id);
      setTranscriptLoading(true);
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
        await addSource(sourceId, result.video);
        setTranscriptComplete(true);
        // const plan = await fetchSubscription();
        // await fetchPlayer(plan);
        setTranscriptLoading(false);
        setRefetch(Math.random());
      }
      if (result.status === "failed") {
        setTranscriptionFailed(true);
        setTranscriptLoading(false);

        return;
      }
    } catch (error) {
      console.log("errror transcribe", error);
      setError("error-transcribing-video");
    } finally {
      setTranscriptLoading(false);
    }
  };

  // delete video
  const handleRemoveVideo = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`/players/${videoId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // console.log('delete', res);
      showToastDelete();
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.log("error deleting video: ", error);
    }
  };

  React.useEffect(() => {
    videoUrlExtensionUpdate.value = selectedExtension as string;

    if (selectedExtension === "hls") {
      setMediaTypeName("hls");
    } else {
      setMediaTypeName("mp4");
    }
    // console.log("selectedExtension", selectedExtension);
  }, [selectedExtension]);

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

  const generateToken = async (player_id: string) => {
    setLoadingEmbed(true);
    try {
      // const res = await axios.get(`/players/${player_id}/tokens`, {
      //   headers: {
      //     Authorization: `Bearer ${Cookies.get("s-token")}`,
      //   },
      // });
      // console.log('token generated', res);
      generateCode(`${config.BASE_URL}/players/embed/${player_id}`);
      // setToken(res.data.token);
      setLoadingEmbed(false);
    } catch (error) {
      setLoadingEmbed(false);
      console.log("error", error);
    }
  };

  const fetchPlayer = async (plan: any) => {
    setLoadingPlayerData(true);
    try {
      const res = await axios.get("/players", {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      const playerById = res.data.filter((item: any) => item.id === videoId);
      // console.log("playerById", playerById);
      setLivePlayerConfig(
        makeConfig(
          playerById[0]?.config,
          videoUrlUpdate.value,
          videoUrlExtensionUpdate.value,
          videoTranscript.value,
        ),
      );
      playerNameUpdate.value = playerById[0]?.name;

      const isPremium = plan?.amount > 0 || plan?.name === "Collab";
      const premiumConfig = isPremium
        ? {
            ...(playerById[0]?.config?.premium?.layoutConfig?.name && {
              layoutConfig: {
                name:
                  playerById[0]?.config?.premium?.layoutConfig?.name ||
                  "halcyon",

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
            }),
            ...(playerById[0]?.config?.premium?.playerCTA?.cta && {
              playerCTA: {
                cta: playerById[0]?.config?.premium?.playerCTA?.cta || false,

                url: playerById[0]?.config?.premium?.playerCTA?.url || "",

                buttonText:
                  playerById[0]?.config?.premium?.playerCTA?.buttonText || "",

                placement:
                  playerById[0]?.config?.premium?.playerCTA?.placement ||
                  "bottom-left",

                timing:
                  playerById[0]?.config?.premium?.playerCTA?.timing || "post",

                direction:
                  playerById[0]?.config?.premium?.playerCTA?.direction ||
                  "vertical",

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
            ...(playerById[0]?.config?.premium?.rapidEngage && {
              rapidEngage: playerById[0]?.config?.premium?.rapidEngage || false,
            }),
            ...(playerById[0]?.config?.premium?.caption && {
              caption: playerById[0]?.config?.premium?.caption || false,
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

      await generateToken(videoId as string);
      setLoadingPlayerData(false);
    } catch (error: any) {
      setLoadingPlayerData(false);
      console.log("error fetching player", error);
      if (error.response.status === 401) {
        navigate({ pathname: "/signin" });
      }
      if (error?.response?.status === 402) {
        navigate({ pathname: "/plans" });
      }
    }
  };

  // const fetchSource = async () => {
  //   try {
  //     const res = await axios.get(`/players/${videoId}/sources`, {
  //       headers: {
  //         Authorization: `Bearer ${Cookies.get("s-token")}`,
  //       },
  //     });

  //     if (Object.values(res.data).length === 0) {
  //       // console.log("res source", res.data);
  //       setSourceEmpty(true);
  //     }
  //     // console.log('fetching source', res);
  //     videoUrlUpdate.value = res.data[0]?.url as string;
  //     videoUrlExtensionUpdate.value = res.data[0]?.media_type;
  //     videoTranscript.value = res.data[0]?.transcripts?.auto;
  //     setSelectedExtension(res.data[0]?.media_type);
  //     setSourceId(res.data[0]?.id);
  //   } catch (error) {
  //     console.log("error fetching source", error);
  //     // setSourceEmpty(false)
  //   }
  // };

  const fetchSource = async () => {
    try {
      const res = await axios.get(`/players/${videoId}/sources`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });

      const sources = res.data || [];

      //  Proper empty check
      if (sources.length === 0) {
        setSourceEmpty(true);
        setSourceId(undefined); // important
        return; // stop here
      }

      //  If data exists
      setSourceEmpty(false);
      setSources(sources);

      const firstSource = sources[0];

      videoUrlUpdate.value = firstSource?.url;
      videoUrlExtensionUpdate.value = firstSource?.media_type;
      videoTranscript.value = firstSource?.transcripts?.auto;

      setSelectedExtension(firstSource?.media_type);
      setSourceId(firstSource?.id);
      setLoadingSource(false);
    } catch (error) {
      console.log("error fetching source", error);
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
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      const sorted = res.data?.sort((a: any, b: any) => {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      });
      setMedia(sorted);
    } catch (error) {
      console.log("error fetching media", error);
    }
  };

  React.useEffect(() => {
    fetchMedia();
    fetchSource();
  }, [refetch]);

  const [embedCode, setEmbedCode] = React.useState("loading ...");

  // const addSource = async (sourceId: string, mediaItem: any) => {
  //   console.log("mediaItem", mediaItem);

  //   const transcriptionUrl = mediaItem?.transcription_url;
  //   const transcodedUrls = mediaItem?.playback_url;

  //   const data = {
  //     url: videoUrlUpdate.value,
  //     // media_type: videoUrlExtensionUpdate.value,
  //     media_type: selectedExtension || "mp4",
  //     transcripts: {
  //       auto:
  //         transcriptionUrl &&
  //         new URL(transcriptionUrl, config.VIDEO_CDN_URL).toString(),
  //     },
  //     transcoded_urls: {
  //       auto:
  //         transcodedUrls &&
  //         new URL(transcodedUrls, config.VIDEO_CDN_URL).toString(),
  //     },
  //   };

  //   console.log("add", data);

  //   try {
  //     if (sourceEmpty) {
  //       console.log("adding source", sourceEmpty);

  //       const res = await axios.post(`/players/${videoId}/sources`, data, {
  //         headers: {
  //           Authorization: `Bearer ${Cookies.get("s-token")}`,
  //         },
  //       });
  //       setSourceEmpty(false);
  //       // console.log('source added', res);
  //     } else {
  //       console.log("updating source", sourceEmpty);
  //       const res = await axios.put(
  //         `/players/${videoId}/sources/${sourceId}`,
  //         data,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${Cookies.get("s-token")}`,
  //           },
  //         },
  //       );
  //       // console.log('source updated', res);
  //     }
  //   } catch (error) {
  //     console.log("error adding source", error);
  //   }
  // };

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
      //  ALWAYS rely on actual sources
      if (!sources || sources.length === 0) {
        console.log("adding source");

        await axios.post(`/players/${videoId}/sources`, data, {
          headers: {
            Authorization: `Bearer ${Cookies.get("s-token")}`,
          },
        });
      } else {
        console.log("updating source");

        await axios.put(`/players/${videoId}/sources/${sourceId}`, data, {
          headers: {
            Authorization: `Bearer ${Cookies.get("s-token")}`,
          },
        });
      }
    } catch (error) {
      console.log("error adding source", error);
    }
  };

  const resetDefault = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoadingEmbed(true);
    const data = {
      name: playerNameUpdate.value,
      config: playerconfig[selectedTemplate],
      // "media_source": videoUrlUpdate.value,
      // "media_type": videoUrlExtensionUpdate.value
    };
    try {
      const res = await axios.put(`/players/${videoId}`, data, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      showToast();
      setLoadingEmbed(false);
      setOpenModalReset(false);
      // reload with fresh plan
      const plan = await fetchSubscription();
      await fetchPlayer(plan);
    } catch (error) {
      setLoadingEmbed(false);
      console.log("error updating video", error);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await updatePlayer();
  };

  const updatePlayer = async () => {
    setLoadingEmbed(true);
    const data = {
      name: playerNameUpdate.value,
      config: videoconfigupdate.value,
    };
    try {
      const res = await axios.put(`/players/${videoId}`, data, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // await addSource(sourceId);
      // console.log('update', res);
      showToast();
      setLoadingEmbed(false);
      setDisableSaveButton(true);
    } catch (error) {
      setLoadingEmbed(false);
      console.log("error updating video", error);
    }
  };

  const generateCode = (url: string) => {
    setEmbedUrl(url);
    let snipet = `<iframe
            title="${videoconfigupdate.value.videotitle || "Video title"}"
            width="100%"
            height="100%"
            loading="lazy"
            frameborder="0"
            allowfullscreen
            src="${url}"
            style="border: none; outline: none; padding: 0; margin: 0;  cursor: pointer;"
        >
         <meta name="description" content="${
           videoconfigupdate.value.videodescription || "Video description"
         }">
        </iframe> 
       `;
    setEmbedCode(snipet);
  };

  const [brandUploading, setBrandUploading] = React.useState(false);
  const [thumbnailUploading, setThumbnailUploading] = React.useState(false);
  const [ctaImageUploading, setCTAImageUploading] = React.useState(false);

  const handlePlayerThumbnailOnChange = async (val: string) => {
    let image = new URL(val, config.IMAGE_CDN_URL).toString();
    console.log("thumb", image);
    videoconfigupdate.value.playerThumbnailImageUrl = image;
    videoconfigupdate.value.playercontrol.thumbnail = true;
    await updatePlayer();
    try {
      await fetchImage(image, 3); // retry up to 3 times
    } catch (error) {
      console.log("Image fetch failed after retries", error);
    } finally {
      setReRender(Math.random() * 1000);
    }
  };

  const handlePlayerBrandingOnChange = async (val: string) => {
    let image = new URL(val, config.IMAGE_CDN_URL).toString();
    console.log("branding", image);
    videoconfigupdate.value.playerBrandingImageUrl = image;
    videoconfigupdate.value.playercontrol.branding = true;
    await updatePlayer();
    try {
      await fetchImage(image, 3); //  retry up to 3 times
    } catch (error) {
      console.log("Image fetch failed after retries", error);
    } finally {
      setReRender(Math.random() * 1000);
    }
  };

  const handlePlayerCTAImageOnChange = async (val: string) => {
    const premium = videoconfigupdate.value.premium;
    const playerCTA = premium?.playerCTA;

    if (!playerCTA) return;

    let image = new URL(val, config.IMAGE_CDN_URL).toString();
    console.log("cta image", image);

    playerCTA.image = image;
    playerCTA.imageEnable = true;

    await updatePlayer();
    try {
      await fetchImage(image, 3); //  retry up to 3 times
    } catch (error) {
      console.log("Image fetch failed after retries", error);
    } finally {
      setReRender(Math.random() * 1000);
    }
  };

  const handleCopyClipboard = async (val: string) => {
    setCopied(false);
    setCopiedLink(false);
    setCopiedPlayerId(false);
    // hideCopyT()
    console.log("val", val);

    try {
      const element = document.querySelector(`#${val}`);
      console.log("element", element);

      // @ts-ignore
      element?.select();
      // @ts-ignore
      element?.setSelectionRange(0, 99999);
      document.execCommand("copy");
      if (val === "embed-link-code") {
        setCopied(true);
      } else if (val === "embed-player-id") {
        setCopiedPlayerId(true);
      } else {
        setCopiedLink(true);
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
      setCopied(false);
      setCopiedLink(false);
      setCopiedPlayerId(false);
    }
  };

  const handleMediaTypeSelection = (val: string) => {
    if (val === "hls") {
      setSelectedExtension("hls");
    } else {
      setSelectedExtension("mp4");
    }
  };

  // const [active, setActive] = React.useState<string | null>('playback-behavior');

  // const handleToggle = (id: string) => {
  //   setActive(prev => (prev === id ? null : id));
  // };

  const [active, setActive] = React.useState<string[]>(["video-playback"]);

  const handleToggle = (id: string) => {
    if (active.includes(id)) {
      // close it
      setActive(active.filter((item) => item !== id));
    } else {
      // open it
      setActive([...active, id]);
    }
  };

  const getFileName = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  // const truncate = (text: string, maxLength = 50): string =>
  //   text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  const truncate = (text: string = "", maxLength = 50): string => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      maxLength = 30; // mobile limit
    }
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const handleChangeTemplate = async () => {
    const data = {
      name: playerNameUpdate.value,
      config: playerconfig[selectedTemplate],
    };
    try {
      const res = await axios.put(`/players/${videoId}`, data, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // reload with fresh plan
      const plan = await fetchSubscription();
      await fetchPlayer(plan);
      showToast();
      setOpenModalChooseTemplate(false);
      setError("");
    } catch (error) {
      console.log("error updating layout", error);
    }
  };

  const fetchSubscription = async () => {
    try {
      const subRes = await axios.get(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });

      const planRes = await axios.get(
        `/plans/${subRes.data.subscription.plan_id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("s-token")}`,
          },
        },
      );

      const plan = planRes.data?.plan || null;

      setActivePlan(plan);

      return plan;
    } catch (error) {
      console.log("error subscription", error);
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

  const computedConfig = React.useMemo(() => {
    // console.log("reRender", reRender);

    if (reRender === 0) {
      if (livePlayerConfig) {
        return livePlayerConfig;
      }
    } else {
      return makeConfig(
        videoconfigupdate.value,
        videoUrlUpdate.value,
        videoUrlExtensionUpdate.value,
        videoTranscript.value,
      );
    }
  }, [
    reRender,
    livePlayerConfig,
    videoUrlUpdate.value,
    videoUrlExtensionUpdate.value,
  ]);

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
      <div className="detail-container">
        {/* left side */}
        <div className="detail-sub-container-2 hide-scroll">
          <div className="detail-sub-container-child">
            <DetailMenu />

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
                <p className="subtitle-three">Player Name: </p>
                <p className="body">{playerNameUpdate.value}</p>
                <span
                  className="material-symbols-outlined"
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
                      <p className="input-title">Player name</p>
                    </div>
                    <input
                      style={{ width: "100%" }}
                      className="input-secondary"
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
                <p className="subtitle-three">Player ID: </p>
                <p className="body">{videoId}</p>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleCopyClipboard("embed-player-id");
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
                borderColor: "var(--stroke)",
                borderRadius: "0.25rem",
              }}
            >
              <div style={{ marginBottom: "0.5rem" }}>
                <p className="subtitle-three">Video name</p>
              </div>
              <div
                className="upload-container"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    flex: 2,
                    boxSizing: "border-box",
                    border: "1px solid",
                    borderColor: videoUrlUpdate.value
                      ? `var(--surface)`
                      : `var(--stroke)`,
                    backgroundColor: videoUrlUpdate.value
                      ? "var(--surface)"
                      : "transparent",
                    borderRadius: "0.25rem",
                  }}
                  className="upload-content w-100"
                >
                  <p className="caption textSecondary">
                    {videoUrlUpdate?.value
                      ? truncate(getFileName(videoUrlUpdate.value))
                      : "Add a video to the player from video library or upload a new one."}
                  </p>
                </div>
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
                  // title={``}
                  size="md"
                >
                  <div
                    style={{
                      // marginTop: "2rem",
                      maxHeight: "34rem",
                      overflowY: "scroll",
                    }}
                  >
                    {/* <p className="body">
                      Upload a video from your device or select an already
                      uploaded video
                    </p> */}
                    <div
                      className="v-p-conainer"
                      // style={{
                      //   marginBottom: "2rem",
                      //   display: "flex",
                      //   alignItems: "center",
                      //   justifyContent: "center",
                      //   padding: "0 8rem",
                      // }}
                    >
                      <VideoPicker
                        file={file}
                        setFile={setFile}
                        setVideoUrl={setVideoUrlFromModal}
                        setRefetch={(u) => {
                          setRefetch(u);
                          setReRender(u);
                        }}
                        activePlan={activePlan}
                        // setOpenModalUpload={setOpenUpload}
                        setOpenModalUpload={setOpenModalUpload}
                        // handleSetUrl={async () => {
                        //   setOpenModalUpload(false);
                        //   await addSource(sourceId);
                        //   setRefetch(Math.random());
                        // }}
                        addSource={addSource} //  pass directly
                        sourceId={sourceId} //  pass id
                      />
                    </div>

                    {media && media.length > 0 && (
                      <div>
                        <div className="desktop-text-render">
                          <p className="subtitle-two">Uploaded Videos</p>
                        </div>

                        <Table
                          data={media}
                          setRefetch={(u) => {
                            setRefetch(u);
                            setReRender(u);
                          }}
                          activePlan={activePlan}
                          showCopy={false}
                          handleClick={async (item: any) => {
                            setOpenModalUpload(false);
                            await addSource(sourceId, item);
                            setRefetch(Math.random());
                            setReRender(Math.random());
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
              {computedConfig && <LivePlayer config={computedConfig} />}
            </div>

            <Modal
              isOpen={openModal}
              setOpen={setOpenModal}
              title={`Player Preview`}
              size="lg"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {sourceEmpty ? (
                  <p className="subtitle-one">
                    Set a video URL to preview your changes.
                  </p>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <iframe
                      width="100%"
                      height="100%"
                      loading="lazy"
                      src={embedUrl}
                      allowFullScreen
                      frameBorder={"0"}
                      style={{
                        border: "none",
                        outline: "none",
                        padding: "0",
                        margin: "0",
                        cursor: "pointer",
                        aspectRatio: "16/9",
                      }}
                    ></iframe>
                  </div>
                )}
              </div>
            </Modal>
          </div>
        </div>

        {/* right side */}
        <div className="detail-sub-container-1 hide-scroll">
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
                <p className="label">Save the changes to preview</p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <button
                  type="submit"
                  className="large-primary-btn"
                  disabled={disableSaveButon}
                  style={{ flex: 1 }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      columnGap: "0.25rem",
                    }}
                  >
                    Save Edits
                  </div>
                </button>

                <button
                  type="button"
                  className="large-secondary-btn"
                  disabled={sourceEmpty}
                  style={{ flex: 1 }}
                  onClick={() => setOpenModal(true)}
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
                      style={{ fontWeight: "bold", fontSize: "1.25rem" }}
                    >
                      slideshow
                    </span>
                    Preview
                  </div>
                </button>
              </div>

              {/*
              <button
                type="reset"
                className="large-secondary-btn"
                style={{ flex: 1 }}
                onClick={resetDefault}
              >
                Reset Default
              </button>
            */}
            </div>

            <div
              style={{ marginBottom: "1rem" }}
              className="get-embed-share-info"
            >
              <Accordion
                active={active}
                handleToggle={handleToggle}
                header="Get Embed & Share Info"
                id="get-embed-share-info"
                icon="frame_source"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <div className="video-player-embeded-style">
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
                          display: "flex",
                          alignItems: "center",
                          position: "relative",
                          gap: "0.5rem",
                        }}
                      >
                        <p className="subtitle-two textPrimary">Embed URL</p>
                        <div
                          style={{
                            position: "relative",
                          }}
                        >
                          <Tooltip
                            text={
                              "Use this to embed the player into platforms that allow embed URLs"
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
                      </div>
                      <div className="embed-link">
                        <textarea
                          className="hide-scroll"
                          id="embed-link"
                          value={isLoadingEmbed ? "Please wait" : embedUrl}
                          rows={5}
                          cols={5}
                          style={{
                            width: "95%",
                            height: "2rem",
                            padding: "0.5rem",
                            overflowY: "scroll",
                            borderStyle: "none",
                            borderColor: "transparent",
                            overflow: "auto",
                            outline: "none",
                            border: "1px solid #f0f0f0",
                            color: "#828282",
                          }}
                        ></textarea>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <IconButton
                            // width="100%"
                            // height="3.15rem"
                            onClick={() => {
                              handleCopyClipboard("embed-link");
                            }}
                          >
                            <span className="material-symbols-outlined white">
                              content_copy
                            </span>
                          </IconButton>
                        </div>
                      </div>
                      {copiedLink && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                            }}
                          >
                            <span className="material-symbols-outlined positive">
                              done
                            </span>
                            <p className="body" style={{ marginLeft: "1rem" }}>
                              Copied !
                            </p>
                          </div>
                        </>
                      )}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          position: "relative",
                          gap: "0.5rem",
                        }}
                      >
                        <p className="subtitle-two textPrimary">Embed code</p>
                        <div
                          style={{
                            position: "relative",
                          }}
                        >
                          <Tooltip
                            text={
                              "Use this snippet to embed the player into platforms that do not allow embed URLs, or if you are building a custom site"
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
                      </div>
                      <div className="embed-link">
                        <textarea
                          className="hide-scroll"
                          id="embed-link-code"
                          value={isLoadingEmbed ? "Please wait" : embedCode}
                          rows={7}
                          cols={5}
                          style={{
                            width: "95%",
                            height: "6rem",
                            padding: "0.5rem",
                            overflowY: "scroll",
                            borderStyle: "none",
                            borderColor: "transparent",
                            overflow: "auto",
                            outline: "none",
                            border: "1px solid #f0f0f0",
                            color: "#828282",
                          }}
                        ></textarea>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <IconButton
                            // width="100%"
                            // height="3.15rem"
                            onClick={() => {
                              handleCopyClipboard("embed-link-code");
                            }}
                          >
                            <span className="material-symbols-outlined white">
                              content_copy
                            </span>
                          </IconButton>
                        </div>
                      </div>
                      {copied && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                            }}
                          >
                            <span className="material-symbols-outlined positive">
                              done
                            </span>
                            <p className="body" style={{ marginLeft: "1rem" }}>
                              Copied !
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="video-player-embeded-style">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        width: "100%",
                      }}
                    >
                      <p className="subtitle-two textPrimary">Player ID</p>
                      <div className="embed-link">
                        <textarea
                          className="hide-scroll"
                          id="embed-player-id"
                          value={
                            isLoadingEmbed ? "Please wait" : (videoId as string)
                          }
                          rows={5}
                          cols={5}
                          style={{
                            width: "95%",
                            height: "2rem",
                            padding: "0.5rem",
                            overflowY: "scroll",
                            borderStyle: "none",
                            borderColor: "transparent",
                            overflow: "auto",
                            outline: "none",
                            border: "1px solid #f0f0f0",
                            color: "#828282",
                          }}
                        ></textarea>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <IconButton
                            onClick={() => {
                              handleCopyClipboard("embed-player-id");
                            }}
                          >
                            <span className="material-symbols-outlined white">
                              content_copy
                            </span>
                          </IconButton>
                        </div>
                      </div>

                      {copiedPlayerId && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                            }}
                          >
                            <span className="material-symbols-outlined positive">
                              done
                            </span>
                            <p className="body" style={{ marginLeft: "1rem" }}>
                              Copied !
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Accordion>
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
                    // marginTop: "1.5rem",
                    // padding: "0 1rem 0 3rem",
                    boxSizing: "border-box",
                  }}
                >
                  <Toggle
                    name={"autoplay"}
                    label={"Auto Play"}
                    checked={videoconfigupdate.value.playersettings.autoplay}
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playersettings.autoplay =
                        e.target.checked;
                      videoconfigupdate.value.playersettings.muted =
                        e.target.checked;
                      setDisableSaveButton(false);
                    }}
                  />

                  <Toggle
                    name={"muted"}
                    label={"Muted"}
                    checked={videoconfigupdate.value.playersettings.muted}
                    onChange={(e: any) => {
                      if (videoconfigupdate.value.playersettings.autoplay)
                        return;
                      videoconfigupdate.value.playersettings.muted =
                        e.target.checked;
                      setReRender(Math.random() * 1000);
                      setDisableSaveButton(false);
                    }}
                    tooltipText="All autoplay-enabled videos are mute by default until manually unmuted"
                  />

                  <Toggle
                    name={"loop"}
                    label={"Loop"}
                    checked={videoconfigupdate.value.playersettings.loop}
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playersettings.loop =
                        e.target.checked;
                      setDisableSaveButton(false);
                    }}
                    tooltipText="Your video will play in loop until manually paused"
                  />

                  {/* <Toggle
                                    name={'use-as-bg-video'}
                                    label={'Use as BG Video'}
                                    checked={videoconfigupdate.value.playersettings.use_as_BG_video}
                                    onChange={(e: any) => { setReRender(Math.random() * 1000); (videoconfigupdate.value.playersettings.use_as_BG_video = e.target.checked) }}
                                /> */}
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
                // premium={activePlan && activePlan?.amount === 0}
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
                    <p className="body placeholder">Change Theme</p>
                    <p
                      className="body primary"
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
                        // onChange={(e: any) => {
                        //   setReRender(Math.random() * 1000);
                        //   videoconfigupdate.value?.premium?.layoutConfig?.controls_padding =
                        //     e.target.value;
                        //   setDisableSaveButton(false);
                        // }}
                        onChange={(e: any) => {
                          setReRender(Math.random() * 1000);

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
                        // @ts-ignore
                        // onChange={(e: any) => {
                        //   setReRender(Math.random() * 1000);
                        //   videoconfigupdate.value?.premium?.layoutConfig?.controls_corner_radius =
                        //     e.target.value;
                        //   setDisableSaveButton(false);
                        // }}
                        onChange={(e: any) => {
                          setReRender(Math.random() * 1000);

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
                        // @ts-ignore
                        // onChange={(e: any) => {
                        //   setReRender(Math.random() * 1000);
                        //   videoconfigupdate.value?.premium?.layoutConfig?.controls_bg =
                        //     e;
                        //   setDisableSaveButton(false);
                        // }}
                        onChange={(e: string) => {
                          setReRender(Math.random() * 1000);

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
                    // @ts-ignore
                    value={
                      videoconfigupdate.value.playerstyle.player_controls_margin
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playerstyle.player_controls_margin =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <SizePicker
                    label={"Radius"}
                    name={"corner-radius"}
                    // @ts-ignore
                    value={
                      videoconfigupdate.value.playerstyle.player_corner_radius
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playerstyle.player_corner_radius =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <Toggle
                    name={"gradient"}
                    label={"Gradient"}
                    checked={videoconfigupdate.value.playercontrol.gradient}
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playercontrol.gradient =
                        e.target.checked;
                      setDisableSaveButton(false);
                    }}
                  />

                  <Toggle
                    name={"osd-auto-hide"}
                    label={"OSD Autohide"}
                    checked={
                      videoconfigupdate.value.playercontrol.osd_auto_hide
                    }
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playercontrol.osd_auto_hide =
                        e.target.checked;
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
                    <p className="subtitle-two">Primary Play Button</p>
                  </div>

                  <Toggle
                    name={"center-btn-show"}
                    label={"Show/Hide"}
                    checked={
                      videoconfigupdate.value.playercontrol.center_playpause
                    }
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playercontrol.center_playpause =
                        e.target.checked;
                      setDisableSaveButton(false);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playerstyle.center_icon_button_opacity =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <div
                    style={{
                      marginBottom: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--stroke)",
                    }}
                  >
                    <p className="subtitle-two">
                      Control Icons (Mini Controls)
                    </p>
                  </div>

                  <Toggle
                    name={"small-icon-play-show"}
                    label={"Play Button"}
                    checked={videoconfigupdate.value.playercontrol.playpause}
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playercontrol.playpause =
                        e.target.checked;
                      setDisableSaveButton(false);
                    }}
                  />

                  <Toggle
                    name={"small-icon-vol-show"}
                    label={"Volume Button"}
                    checked={videoconfigupdate.value.playercontrol.volume}
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playercontrol.volume =
                        e.target.checked;
                      setDisableSaveButton(false);
                    }}
                  />

                  <Toggle
                    name={"small-icon-setting-show"}
                    label={"Settings Button"}
                    checked={
                      videoconfigupdate.value.playercontrol.settings_menu
                    }
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playercontrol.settings_menu =
                        e.target.checked;
                      setDisableSaveButton(false);
                    }}
                  />

                  <Toggle
                    name={"small-icon-fullscreen-show"}
                    label={"Fullscreen Button"}
                    checked={
                      videoconfigupdate.value.playercontrol.full_screen_icon
                    }
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playercontrol.full_screen_icon =
                        e.target.checked;
                      setDisableSaveButton(false);
                    }}
                  />

                  {/* <Toggle
                    name={"caption"}
                    label={"Caption"}
                    disabled={!activePlan?.metadata?.premium_features?.caption}
                    showCaptions={true}
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
                      setReRender(Math.random() * 1000);
                    }}
                  /> */}

                  <SizePicker
                    label={"Size"}
                    name={"small-icon-size"}
                    // @ts-ignore
                    value={videoconfigupdate.value.playerstyle.icon_button_size}
                    // @ts-ignore
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                    name={"progress-bar-show"}
                    label={"Show"}
                    checked={videoconfigupdate.value.playercontrol.progress_bar}
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playercontrol.progress_bar =
                        e.target.checked;
                      setDisableSaveButton(false);
                    }}
                  />

                  <Toggle
                    name={"progress-bar-scrubber"}
                    label={"Scrubber"}
                    checked={videoconfigupdate.value.playercontrol.scrubber}
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playercontrol.scrubber =
                        e.target.checked;
                      setDisableSaveButton(false);
                    }}
                  />

                  <Toggle
                    name={"progress-bar-time"}
                    label={"Timestamp"}
                    checked={videoconfigupdate.value.playercontrol.time_stamp}
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      if (videoconfigupdate.value?.premium?.rapidEngage) {
                        return setError("rapid-engage-enabled");
                      }
                      videoconfigupdate.value.playercontrol.time_stamp =
                        e.target.checked;
                      setDisableSaveButton(false);
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
                      setReRender(Math.random() * 1000);
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
                    name={"super-progress"}
                    label={"Super Progress"}
                    disabled={
                      !activePlan?.metadata?.premium_features?.rapidEngage
                    }
                    checked={videoconfigupdate.value.premium?.rapidEngage}
                    // onChange={(e: any) => {
                    //   setReRender(Math.random() * 1000);
                    //   videoconfigupdate.value.premium?.rapidEngage =
                    //     e.target.checked;
                    //   setDisableSaveButton(false);
                    // }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setError("");
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playerstyle.progress_bar_hover_scale =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <div
                    style={{
                      marginBottom: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--stroke)",
                    }}
                  >
                    <p className="subtitle-two">Progress Bar Color</p>
                  </div>

                  <ColorPicker
                    label={"Foreground Color"}
                    name={"progress-bar-fg-color"}
                    value={
                      videoconfigupdate.value.playerstyle.progress_bar_FG_color
                    }
                    // @ts-ignore
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playerstyle.progress_bar_opacity =
                        e.target.value;
                      setDisableSaveButton(false);
                    }}
                  />

                  <div
                    style={{
                      marginBottom: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--stroke)",
                    }}
                  >
                    <p className="subtitle-two">Tooltip Styling</p>
                  </div>

                  <ColorPicker
                    label={"Background Color"}
                    name={"tooltip-bg-color"}
                    value={videoconfigupdate.value.playerstyle.tooltip_BG_color}
                    // @ts-ignore
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
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
                    <p className="input-title">URL</p>
                    <input
                      className="input-secondary"
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
                        setReRender(Math.random() * 1000);
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
                    <p className="input-title">Heading</p>
                    <input
                      className="input-secondary"
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
                        setReRender(Math.random() * 1000);
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
                    <p className="input-title">Description</p>
                    <input
                      className="input-secondary"
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
                        setReRender(Math.random() * 1000);
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
                    <p className="input-title">Button Text</p>
                    <input
                      className="input-secondary"
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
                        setReRender(Math.random() * 1000);
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
                    // onChange={(val: any) => {
                    //   videoconfigupdate.value.premium.playerCTA.placement = val;
                    //   setDisableSaveButton(false);
                    // }}
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
                      setReRender(Math.random() * 1000);
                      setDisableSaveButton(false);
                    }}
                    options={[
                      { label: "Select", value: "" },
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
                    // onChange={(val: any) => {
                    //   videoconfigupdate.value.premium.playerCTA.timing = val;
                    //   setDisableSaveButton(false);
                    // }}
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
                      setReRender(Math.random() * 1000);
                      setDisableSaveButton(false);
                    }}
                    options={[
                      { label: "Select", value: "" },
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
                    // onChange={(val: any) => {
                    //   videoconfigupdate.value.premium.playerCTA.direction = val;
                    //   setDisableSaveButton(false);
                    // }}
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
                      setReRender(Math.random() * 1000);
                      setDisableSaveButton(false);
                    }}
                    options={[
                      { label: "Select", value: "" },
                      { label: "Vertical", value: "vertical" },
                      { label: "Horizontal", value: "horizontal" },
                    ]}
                  />

                  <div style={{ width: "100%" }}>
                    <ImagePicker
                      disabled={
                        !activePlan?.metadata?.premium_features?.playerCTA
                          ?.image
                      }
                      onChange={(val: any) => {
                        handlePlayerCTAImageOnChange(val);
                      }}
                      label="Upload Image"
                      setImageUploading={setCTAImageUploading}
                      uploadedUrl={
                        videoconfigupdate.value.premium?.playerCTA?.image
                      }
                    />
                  </div>

                  <Toggle
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
                      setReRender(Math.random() * 1000);
                      if (videoconfigupdate.value.premium?.playerCTA?.image) {
                        videoconfigupdate.value.premium.playerCTA.imageEnable =
                          e.target.checked;
                        setDisableSaveButton(false);
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
                      setReRender(Math.random() * 1000);
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
                  {/* <div style={{ marginBottom: "1rem" }}>
                    <p className="subtitle-two">Title & Description</p>
                  </div> */}

                  <SEOcard
                    id={videoId as string}
                    title={videoconfigupdate.value.videotitle}
                    description={videoconfigupdate.value.videodescription}
                    embedCode={embedCode}
                    removeVideo={true}
                    setReRender={setReRender}
                    setDisableSaveButton={setDisableSaveButton}
                  />

                  <Toggle
                    name={"video-name"}
                    label={"Show"}
                    checked={videoconfigupdate.value.playercontrol.video_name}
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      setError("");
                      if (videoconfigupdate.value.videotitle) {
                        videoconfigupdate.value.playercontrol.video_name =
                          e.target.checked;
                        setDisableSaveButton(false);
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
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playerstyle.text_color = e;
                      setDisableSaveButton(false);
                    }}
                  />

                  {/* <div
                    style={{
                      marginBottom: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--stroke)",
                    }}
                  >
                    <p className="subtitle-two">Thumbnail</p>
                  </div> */}

                  <div style={{ width: "100%" }}>
                    <ImagePicker
                      onChange={(val: any) => {
                        handlePlayerThumbnailOnChange(val);
                        setDisableSaveButton(false);
                      }}
                      label="Upload Thumbnail"
                      setImageUploading={setThumbnailUploading}
                      tooltipText="For best results, upload an image that matches the aspect ratio of the video player you create"
                      uploadedUrl={
                        videoconfigupdate.value.playerThumbnailImageUrl
                      }
                    />
                  </div>

                  <Toggle
                    name={"thumbnail"}
                    label={"Show"}
                    checked={
                      videoconfigupdate.value.playercontrol.thumbnail
                        ? true
                        : false
                    }
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      if (videoconfigupdate.value.playerThumbnailImageUrl) {
                        videoconfigupdate.value.playercontrol.thumbnail =
                          e.target.checked;
                        setDisableSaveButton(false);
                      } else {
                        console.log("upload image");
                        setError("upload-thumbnail-error");
                      }
                    }}
                  />

                  <div className="error-container">
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
                      onChange={(val: any) => {
                        handlePlayerBrandingOnChange(val);
                        setDisableSaveButton(false);
                      }}
                      label="Upload Logo"
                      setImageUploading={setBrandUploading}
                      uploadedUrl={
                        videoconfigupdate.value.playerBrandingImageUrl
                      }
                      // tooltipText="Support JPG and PNG formats only."
                    />
                  </div>

                  <Toggle
                    name={"branding"}
                    label={"Show Logo"}
                    checked={
                      videoconfigupdate.value.playercontrol.branding
                        ? true
                        : false
                    }
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value.playercontrol.branding =
                        e.target.checked;
                      setDisableSaveButton(false);
                    }}
                  />

                  <SizePicker
                    label={"Opacity"}
                    name={"branding-opacity"}
                    // @ts-ignore
                    value={videoconfigupdate.value.playerstyle.branding_opacity}
                    // @ts-ignore
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
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
                      setReRender(Math.random() * 1000);
                    }}
                  />

                  {/* <SizePicker
                    label={"Bottom Padding"}
                    name={"bottom-padding"}
                    disabled={!activePlan?.metadata?.premium_features?.caption}
                    // @ts-ignore
                    value={
                      videoconfigupdate?.value.captionSettings
                        ?.captionFromBottom
                    }
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value = {
                        ...videoconfigupdate.value,
                        captionSettings: {
                          ...videoconfigupdate.value.captionSettings,
                          captionFromBottom: e.target.value,
                        },
                      };

                      setDisableSaveButton(false);
                    }}
                  /> */}

                  {/* <SizePicker
                    label={"Font size"}
                    name={"font-size"}
                    disabled={!activePlan?.metadata?.premium_features?.caption}
                    // @ts-ignore
                    value={
                      videoconfigupdate?.value.captionSettings?.captionFontSize
                    }
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      videoconfigupdate.value = {
                        ...videoconfigupdate.value,
                        captionSettings: {
                          ...videoconfigupdate.value.captionSettings,
                          captionFontSize: e.target.value,
                        },
                      };

                      setDisableSaveButton(false);
                    }}
                  /> */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.25rem",
                    }}
                  >
                    <p className="body placeholder">Transcribe Video</p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {!!videoTranscript.value && (
                        // <span className="material-symbols-outlined positive">
                        //   check_circle
                        // </span>
                        <img
                          src={CompleteSvg}
                          alt="premium Illustration"
                          style={{ width: "24px", maxWidth: 380 }}
                        />
                      )}
                      <button
                        className="large-primary-btn"
                        type="button"
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
                        {/* {!!videoTranscript.value ? "Genereted" : "Generate"} */}
                      </button>
                    </div>
                  </div>
                </div>
              </Accordion>
            </div>

            <button
              className="large-secondary-btn"
              type="button"
              onClick={() => {
                setOpenModalReset(true);
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
                <span
                  className="material-symbols-outlined"
                  style={{ fontWeight: "bold" }}
                >
                  cached
                </span>
                Reset Default
              </div>
            </button>
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
                  borderColor="var(--primary)"
                  height="44px"
                  width="44px"
                />
                <p className="label">Generating Caption...</p>

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
                <p className="heading">Speech-to-text</p>

                <p className="body">
                  {truncate(getFileName(videoUrlUpdate.value))}
                </p>

                <p className="error-text">We could not transcribe the video.</p>

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
                    <p className="heading">Speech-to-text</p>

                    <p className="body">
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
                  className="label"
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
              <p className="subtitle-one">{premiumModal.title}</p>

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
                  background: "var(--surface)",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--stroke)",
                  padding: "1rem",
                  marginTop: "2rem",
                }}
              >
                <ImageRadioGroup
                  options={playerTemplate}
                  value={selectedTemplate}
                  onChange={setSelectedTemplate}
                  name="template-radio"
                  handleSaveButton={() => {
                    setReRender(Math.random() * 1000);
                    // setDisableSaveButton(false);
                  }}
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
            <p className="body">
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
            <p className="body">
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
              Player Updated
            </p>
          </div>
        </Toast>
      </div>
    </div>
  );
};

export default Index;
