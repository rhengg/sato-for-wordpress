import React from "react";
import "./demoplayer.css";
import { VideoConfigType } from "../../pages/Detail";

type IconButtonProp = {
  src: string;
  size: string;
  padding: string;
  background: string;
  hoverBackground: string;
  borderRadius: string;
  onClick?: () => void;
  reRender: number;
  opacity: string;
};

type ProgressBarType = {
  reRender: number;
  foreground: string;
  background: string;
  loadedColor?: string;
  circleColor: string;
  progressPercent: string;
  progressHeight: string;
  progressBarHoverScale?: string;
  opacity: string;
  hover?: boolean;
};

type DemoPlayerType = {
  config: VideoConfigType;
  reRender: number;
  brandUploading: boolean;
  thumbnailUploading: boolean;
  ctaImageUploading: boolean;
  preview: any;
};

const IconButton = ({
  opacity,
  reRender,
  src,
  size,
  padding,
  background,
  hoverBackground,
  borderRadius,
  onClick,
}: IconButtonProp) => {
  const [bgColor, setBgColor] = React.useState(background);

  React.useEffect(() => {
    setBgColor(background);
  }, [reRender]);

  function onHoverInStyle() {
    setBgColor(hoverBackground);
  }

  function onHoverOutStyle() {
    setBgColor(background);
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        padding: padding,
        background: bgColor,
        borderRadius: borderRadius,
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        opacity: opacity || "100%",
      }}
      onClick={onClick}
      onMouseEnter={() => {
        onHoverInStyle();
      }}
      onMouseLeave={() => {
        onHoverOutStyle();
      }}
    >
      <img style={{ width: "100%", height: "100%" }} src={src}></img>
    </div>
  );
};

const ProgressBar = ({
  hover = false,
  opacity,
  reRender,
  background,
  circleColor,
  foreground,
  progressPercent,
  progressHeight,
  loadedColor,
  progressBarHoverScale,
}: ProgressBarType) => {
  const [progressScale, setProgressScale] = React.useState(1);
  const [circleHoverSize, setCircleHoverSize] = React.useState(1);

  React.useEffect(() => {
    setProgressScale(1);
    setCircleHoverSize(1);
  }, [reRender]);

  function onHoverInStyle() {
    setProgressScale(Number(progressBarHoverScale));
    setCircleHoverSize(Number(progressBarHoverScale));
  }

  function onHoverOutStyle() {
    setProgressScale(1);
    setCircleHoverSize(1);
  }

  return (
    <div
      style={{
        boxSizing: "border-box",
        height: progressHeight,
        width: "100%",
        background: background,
        position: "relative",
        transform: `scale3d(1,${progressScale},1)`,
        transition: "transform 50ms ease-out",
        opacity: opacity || "100%",
      }}
      onMouseEnter={() => {
        if (hover) {
          onHoverInStyle();
        }
      }}
      onMouseLeave={() => {
        if (hover) {
          onHoverOutStyle();
        }
      }}
    >
      <div
        style={{
          width: progressPercent,
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          background: foreground,
          zIndex: 2,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          width: "70%",
          height: "100%",
          background: loadedColor,
          opacity: 0.25,
          zIndex: 1,
        }}
      ></div>
      <div
        style={{
          width: `calc(2*${progressHeight}*${circleHoverSize})`,
          height: `calc(2*${progressHeight})`,
          borderRadius: "50%",
          position: "absolute",
          top: "50%",
          left: progressPercent,
          background: circleColor,
          transform: `translate(-${progressPercent}, -50%)`,
          zIndex: 2,
          // boxShadow: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px"
        }}
      ></div>
    </div>
  );
};

const DemoPlayer = ({
  config,
  reRender,
  brandUploading,
  thumbnailUploading,
  ctaImageUploading,
  preview,
}: DemoPlayerType) => {
  // const scaledValue = 0.5;

  const [scaledValue, setScaledValue] = React.useState(1);

  React.useEffect(() => {
    const updateValue = () => {
      if (window.innerWidth <= 1590) {
        setScaledValue(0.7);
      } else if (window.innerWidth <= 768) {
        setScaledValue(0.5);
      } else {
        setScaledValue(1);
      }
    };

    updateValue();
    window.addEventListener("resize", updateValue);

    return () => window.removeEventListener("resize", updateValue);
  }, []);

  const [toggleSetting, setToggleSetting] = React.useState(false);
  const [settingsBG1, setSettingBG1] = React.useState(
    config.playerstyle.settings_menu_BG_color,
  );
  const [settingsBG2, setSettingBG2] = React.useState(
    config.playerstyle.settings_menu_BG_color,
  );
  const [textColor, setTextColor] = React.useState(
    config.playerstyle.text_color,
  );
  const [thumbnail, setThumbnail] = React.useState(
    config.playerThumbnailImageUrl,
  );
  const [thumbnailShow, setThumbnailShow] = React.useState(
    config.playercontrol.thumbnail,
  );
  const [logo, setLogo] = React.useState(config.playerBrandingImageUrl);

  React.useEffect(() => {
    setSettingBG1(config.playerstyle.settings_menu_BG_color);
    setSettingBG2(config.playerstyle.settings_menu_BG_color);
    setTextColor(config.playerstyle.text_color);
    setThumbnail(config.playerThumbnailImageUrl);
    setThumbnailShow(config.playercontrol.thumbnail);
    setLogo(config.playerBrandingImageUrl);
  }, [reRender]);

  React.useEffect(() => {
    const div = document.getElementById("settings-demo-box") as HTMLElement;
    if (toggleSetting) {
      div.style.display = "block";
      div.style.zIndex = "16";
      div.style.opacity = "1";
    } else {
      div.style.display = "none";
      div.style.zIndex = "-16";
      div.style.opacity = "0";
    }
  }, [toggleSetting]);

  function settingsHoverIn1() {
    setSettingBG1(config.playerstyle.settings_menu_BG_hover_color);
  }

  function settingsHoverOut1() {
    setSettingBG1(config.playerstyle.settings_menu_BG_color);
  }
  function settingsHoverIn2() {
    setSettingBG2(config.playerstyle.settings_menu_BG_hover_color);
  }

  function settingsHoverOut2() {
    setSettingBG2(config.playerstyle.settings_menu_BG_color);
  }

  const bgLoading = () => {
    if (thumbnailUploading) {
      return "none";
    } else {
      if (thumbnail.length !== 0) {
        return `url(${thumbnail})`;
      } else {
        return "none";
        // return "url(https://skara-imagecontent-staging.b-cdn.net/b14652d6-1e0c-4716-85f4-9fa9d53d8d25/d61b4510-224c-437d-bcdd-577701e9cec5/splaycover.png)";
      }
    }
  };

  const bgImagePresent = () => {
    if (thumbnail) {
      return "transparent";
    } else {
      return "#000000";
    }
  };

  return (
    <div
      className="video-player-edit-demo"
      style={{
        borderRadius:
          `${
            Number(config.playerstyle.player_corner_radius) * scaledValue
          }px` || "0",
        backgroundImage: thumbnailShow ? bgLoading() : "none",
        backgroundColor: thumbnailShow ? bgImagePresent() : "#000000",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      <div
        className="video-pLayer-children video-top"
        style={{
          padding:
            `${
              Number(config.playerstyle.player_controls_margin) * scaledValue
            }px ${
              Number(config.playerstyle.player_controls_margin) * scaledValue
            }px 0px ${
              Number(config.playerstyle.player_controls_margin) * scaledValue
            }px` ||
            `${30 * scaledValue}px ${30 * scaledValue}px 0px ${
              30 * scaledValue
            }px`,
          backgroundImage: config.playercontrol.gradient
            ? "linear-gradient(rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)"
            : "none",
        }}
      >
        <div
          className="video-top-children"
          style={{
            justifyContent: "flex-start",
            width: "33.33%",
            zIndex: config.playercontrol.back_button ? 0 : -100,
            opacity: config.playercontrol.back_button ? 1 : 0,
          }}
        ></div>
        <div
          style={{
            width: "33.33%",
            display: "flex",
            zIndex: config.playercontrol.video_name ? 0 : -100,
            opacity: config.playercontrol.video_name ? 1 : 0,
            padding: `0 ${1 * scaledValue}rem`,
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            wordBreak: "break-word",
          }}
        >
          <p
            style={{
              color: textColor,
              textAlign: "center",
              fontSize: `${1 * scaledValue + 0.25}rem`,
            }}
          >
            {config.videotitle || "Video title"}
          </p>
        </div>
        <div
          className="video-top-children"
          style={{
            justifyContent: "flex-end",
            width: "33.33%",
            zIndex: config.playercontrol.full_screen_icon ? 0 : -100,
            opacity: config.playercontrol.full_screen_icon ? 1 : 0,
          }}
        >
          <IconButton
            opacity={config.playerstyle.icon_button_opacity + "%"}
            reRender={reRender}
            src="./icon/fullscreen.svg"
            size={
              Number(config.playerstyle.icon_button_size) * scaledValue + "px"
            }
            background={config.playerstyle.icon_button_color}
            padding={
              Number(config.playerstyle.icon_button_padding) * scaledValue +
              "px"
            }
            borderRadius={
              Number(config.playerstyle.icon_button_corner_radius) *
                scaledValue +
              "px"
            }
            hoverBackground={config.playerstyle.icon_button_hover_color}
          />
        </div>
      </div>

      <div
        className="video-center"
        style={{
          boxSizing: "border-box",
          position: "absolute",
          display: config.playercontrol.center_playpause ? "block" : "none",
        }}
      >
        <IconButton
          opacity={config.playerstyle.center_icon_button_opacity + "%"}
          reRender={reRender}
          src="./icon/play_arrow.svg"
          size={
            Number(config.playerstyle.center_icon_button_size) * scaledValue +
            "px"
          }
          background={config.playerstyle.center_icon_button_color}
          padding={
            Number(config.playerstyle.center_icon_button_padding) *
              scaledValue +
            "px"
          }
          borderRadius={
            Number(config.playerstyle.center_icon_button_corner_radius) *
              scaledValue +
            "px"
          }
          hoverBackground={config.playerstyle.center_icon_button_hover_color}
          onClick={preview}
        />
      </div>

      <div
        className="video-bottom"
        style={{
          position: "absolute",
          padding:
            `0px
${Number(config.playerstyle.player_controls_margin) * scaledValue}px
${Number(config.playerstyle.player_controls_margin) * scaledValue}px
${Number(config.playerstyle.player_controls_margin) * scaledValue}px` ||
            `0px ${30 * scaledValue}px ${30 * scaledValue}px ${
              30 * scaledValue
            }px`,
          backgroundImage: config.playercontrol.gradient
            ? "linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)"
            : "none",
        }}
      >
        <div
          className="video-progress"
          style={{
            marginBottom:
              `${
                Number(config.playerstyle.bottom_bar_spacing) * scaledValue
              }px` || `${12 * scaledValue}px`,
            position: "relative",
            height: `calc(2 * ${
              Number(config.playerstyle.progress_bar_size) * scaledValue
            }px)`,
          }}
        >
          <div
            style={{
              width: config.playercontrol.time_stamp ? "100%" : "100%",
              display: config.playercontrol.progress_bar ? "block" : "none",
            }}
          >
            <ProgressBar
              hover={true}
              opacity={config.playerstyle.progress_bar_opacity + "%"}
              reRender={reRender}
              progressPercent="40%"
              background={config.playerstyle.progress_bar_BG_color}
              foreground={config.playerstyle.progress_bar_FG_color}
              circleColor={config.playerstyle.progress_bar_circle_color}
              loadedColor={config.playerstyle.progress_bar_loaded_color}
              progressHeight={
                Number(config.playerstyle.progress_bar_size) * scaledValue +
                "px"
              }
              progressBarHoverScale={
                config.playerstyle.progress_bar_hover_scale
              }
            />
            <div
              style={{
                position: "absolute",
                display: config.playercontrol.progress_bar ? "flex" : "none",
                justifyContent: "center",
                alignItems: "center",
                width: `${65 * scaledValue}px`,
                height: `${30 * scaledValue}px`,
                top: `calc(-${48 * scaledValue}px + ${
                  Number(config.playerstyle.progress_bar_size) * scaledValue
                }px)`,
                left: "27%",
                background: config.playerstyle.tooltip_BG_color,
                opacity: `${config.playerstyle.tooltip_opacity}%`,
                borderRadius: `${
                  Number(config.playerstyle.tooltip_corner_radius) * scaledValue
                }px`,
              }}
            >
              <p
                style={{
                  color: config.playerstyle.tooltip_text_color,
                  fontSize: `${1 * scaledValue + 0.15}rem`,
                }}
              >
                07:38
              </p>
            </div>
          </div>
          <div
            style={{
              width: config.playercontrol.time_stamp ? "max-content" : "0%",
              textAlign: "right",
              display: config.playercontrol.time_stamp ? "block" : "none",
              paddingLeft: `${5 * scaledValue}px`,
            }}
          >
            <p
              style={{
                color: textColor,
                fontSize: `${1 * scaledValue + 0.15}rem`,
              }}
            >
              11:18/12:14
            </p>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              gap: `${0.5 * scaledValue}rem`,
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: config.playercontrol.playpause ? "block" : "none",
              }}
            >
              <IconButton
                opacity={config.playerstyle.icon_button_opacity + "%"}
                reRender={reRender}
                src="./icon/play_arrow.svg"
                size={
                  Number(config.playerstyle.icon_button_size) * scaledValue +
                  "px"
                }
                background={config.playerstyle.icon_button_color}
                padding={
                  Number(config.playerstyle.icon_button_padding) * scaledValue +
                  "px"
                }
                borderRadius={
                  Number(config.playerstyle.icon_button_corner_radius) *
                    scaledValue +
                  "px"
                }
                hoverBackground={config.playerstyle.icon_button_hover_color}
                onClick={preview}
              />
            </div>
            <div
              style={{
                display: config.playercontrol.volume ? "flex" : "none",
                alignItems: "center",
                gap: `${0.5 * scaledValue}rem`,
                zIndex: config.playercontrol.volume ? 0 : -100,
                opacity: config.playercontrol.volume ? 1 : 0,
              }}
            >
              <IconButton
                opacity={config.playerstyle.icon_button_opacity + "%"}
                reRender={reRender}
                src="./icon/volume_up.svg"
                size={
                  Number(config.playerstyle.icon_button_size) * scaledValue +
                  "px"
                }
                background={config.playerstyle.icon_button_color}
                padding={
                  Number(config.playerstyle.icon_button_padding) * scaledValue +
                  "px"
                }
                borderRadius={
                  Number(config.playerstyle.icon_button_corner_radius) *
                    scaledValue +
                  "px"
                }
                hoverBackground={config.playerstyle.icon_button_hover_color}
              />
              <div style={{ width: `${6 * scaledValue}rem` }}>
                <ProgressBar
                  opacity={config.playerstyle.volume_bar_opacity + "%"}
                  reRender={reRender}
                  background={config.playerstyle.volume_bar_BG_color}
                  foreground={config.playerstyle.volume_bar_FG_color}
                  circleColor={config.playerstyle.volume_bar_FG_color}
                  progressHeight={
                    Number(config.playerstyle.volume_bar_size) * scaledValue +
                    "px"
                  }
                  progressPercent="40%"
                />
              </div>
            </div>
          </div>
          <div
            className="video-top-children"
            style={{
              justifyContent: "flex-end",
              alignItems: "center",
              gap: `${0.3 * scaledValue}rem`,
            }}
          >
            <div
              style={{
                width: "auto",
                height: `${38 * scaledValue}px`,
                // aspectRatio: '16/9',
                maxHeight: `${50 * scaledValue}px`,
                display: config.playercontrol.branding ? "flex" : "none",
                alignItems: "flex-end",
                zIndex: config.playercontrol.branding ? 0 : -100,
                opacity: config.playercontrol.branding ? 1 : 0,
              }}
            >
              {!brandUploading ? (
                <img
                  src={logo || "./logo-white.png"}
                  alt="no-image"
                  style={{
                    width: "100%",
                    height: "100%",
                    fontSize: `${0.75 * scaledValue + 0.25}rem`,
                    opacity: `${config.playerstyle.branding_opacity}%`,
                  }}
                ></img>
              ) : (
                <p>loading</p>
              )}
            </div>
            <div
              style={{
                display: config.playercontrol.settings_menu ? "block" : "none",
                zIndex: config.playercontrol.settings_menu ? 0 : -100,
                opacity: config.playercontrol.settings_menu ? 1 : 0,
              }}
            >
              <IconButton
                opacity={config.playerstyle.icon_button_opacity + "%"}
                reRender={reRender}
                onClick={() => setToggleSetting(!toggleSetting)}
                src="./icon/settings.svg"
                size={
                  Number(config.playerstyle.icon_button_size) * scaledValue +
                  "px"
                }
                background={config.playerstyle.icon_button_color}
                padding={
                  Number(config.playerstyle.icon_button_padding) * scaledValue +
                  "px"
                }
                borderRadius={
                  Number(config.playerstyle.icon_button_corner_radius) *
                    scaledValue +
                  "px"
                }
                hoverBackground={config.playerstyle.icon_button_hover_color}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="settings-demo-box"
        id="settings-demo-box"
        style={{
          background: config.playerstyle.settings_menu_BG_color,
          zIndex: "-16",
          display: "none",
          opacity: `${config.playerstyle.settings_menu_opacity}%`,
        }}
      >
        {/*
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            boxSizing: "border-box",
            padding: "12px 8px",
            width: "100%",
            height: "50%",
            alignItems: "center",
            background: settingsBG1,
          }}
          onMouseEnter={() => settingsHoverIn1()}
          onMouseLeave={() => settingsHoverOut1()}
        >
          <div style={{ display: "flex", gap: `${0.25 * scaledValue}rem` }}>
            <img
              style={{
                width: `${24 * scaledValue}px`,
                height: `${24 * scaledValue}px`,
              }}
              src="./icon/tune.svg"
            ></img>
            <p
              style={{
                color: config.playerstyle.settings_menu_text_color,
                fontSize: `${0.75 * scaledValue + 0.25}rem`,
              }}
            >
              Quality
            </p>
          </div>
          <div style={{ display: "flex", gap: `${0.25 * scaledValue}rem` }}>
            <p
              style={{
                fontSize: `${0.5 * scaledValue + 0.25}rem`,
                color: config.playerstyle.settings_menu_text_color,
              }}
            >
              720p24
            </p>
            <img
              style={{
                width: `${24 * scaledValue}px`,
                height: `${24 * scaledValue}px`,
              }}
              src="./icon/chevron_right.svg"
            ></img>
          </div>
        </div>
        */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            boxSizing: "border-box",
            padding: "12px 8px",
            width: "100%",
            height: "50%",
            alignItems: "center",
            background: settingsBG2,
          }}
          onMouseEnter={() => settingsHoverIn2()}
          onMouseLeave={() => settingsHoverOut2()}
        >
          <div style={{ display: "flex", gap: `${0.25 * scaledValue}rem` }}>
            <img
              style={{
                width: `${24 * scaledValue}px`,
                height: `${24 * scaledValue}px`,
              }}
              src="./icon/slow_motion_video.svg"
            ></img>
            <p
              style={{
                color: config.playerstyle.settings_menu_text_color,
                fontSize: `${0.75 * scaledValue + 0.25}rem`,
                lineHeight: `${24 * scaledValue}px`,
              }}
            >
              Playback speed
            </p>
          </div>
          <div style={{ display: "flex", gap: `${0.25 * scaledValue}rem` }}>
            <p
              style={{
                fontSize: `${0.5 * scaledValue + 0.25}rem`,
                color: config.playerstyle.settings_menu_text_color,
                lineHeight: `${24 * scaledValue}px`,
              }}
            >
              Normal
            </p>
            <img
              style={{
                width: `${24 * scaledValue}px`,
                height: `${24 * scaledValue}px`,
              }}
              src="./icon/chevron_right.svg"
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPlayer;
