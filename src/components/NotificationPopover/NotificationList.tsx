import Loader from "../Loader";
import { NotificationItem, NotificationType } from ".";
import { timeAgo } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import { Text } from "@wordpress/ui";

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case "success":
      return (
        <div className="notif-icon success">
          <span className="material-symbols-outlined">check</span>
        </div>
      );

    case "error":
      return (
        <div className="notif-icon error">
          <span className="material-symbols-outlined">warning</span>
        </div>
      );

    case "warning":
      return (
        <div className="notif-icon warning">
          <span className="material-symbols-outlined">info_i</span>
        </div>
      );

    case "info":
      return (
        <div className="notif-icon info">
          <span className="material-symbols-outlined">kid_star</span>
        </div>
      );

    default:
      return null;
  }
};

type Props = {
  data: NotificationItem[];
  loading: boolean;
  onAction: (item: NotificationItem) => Promise<void>;
};

const NotificationList = ({ data, loading, onAction }: Props) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="notif-loading">
        <Loader />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="notif-empty">
        <p className="body">No notifications</p>
      </div>
    );
  }

  return (
    <>
      {data.map((item) => (
        <div
          key={item.id}
          className="notif-item"
          style={{
            backgroundColor: item.is_read ? "transparent" : "#FFF0EC",
          }}
        >
          <NotificationIcon type={item.type as NotificationType} />

          <div className="notif-content">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text variant="body-sm">{timeAgo(item.created_at)}</Text>
            </div>
            <div className="notif-top">
              <div>
                <Text variant="body-lg">{item.title}</Text>
                <Text variant="body-sm" style={{ display: "block" }}>
                  {item.body}
                </Text>
              </div>
            </div>

            {item.data?.actions?.length > 0 && (
              <button
                className="notif-action-btn"
                onClick={async (e) => {
                  e.stopPropagation();
                  await onAction(item);

                  const url = item.data.actions[0].url;
                  if (url) {
                    if (
                      item.data.actions[0].label.toLowerCase() ===
                      "view invoice"
                    ) {
                      window.open(
                        new URL(url, config.IMAGE_CDN_URL).toString(),
                        "_blank",
                        "noopener,noreferrer",
                      );
                    } else {
                      navigate(url);
                    }
                  }
                }}
              >
                {item.data.actions[0].label}
              </button>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default NotificationList;
