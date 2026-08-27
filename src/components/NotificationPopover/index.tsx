import React from "react";
import "./NotificationPopover.css";
import axios from "../../utils/axios-instance";
import NotificationList from "./NotificationList";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@wordpress/ui";
import { bell, bellUnread } from "@wordpress/icons";
import { useAuth } from "../../context/AuthContext";

export type NotificationType = "success" | "error" | "warning" | "info";

export type NotificationItem = {
  id: string;
  type: string;
  event: string;
  title: string;
  body: string;
  data: Data;
  is_read: boolean;
  created_at: number;
};

export type Data = {
  actions: Action[];
  video_id: string;
  video_name: string;
};

export type Action = {
  url: string;
  type: string;
  label: string;
};

const NotificationPopover = () => {
  const { token } = useAuth();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [data, setData] = React.useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);

  const readNotification = async (id: string) => {
    await axios.put(
      `/notifications/${id}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  };

  const markAllAsRead = async () => {
    await axios.put(
      `/notifications/read-all`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    setUnreadCount(0);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const notifications = await axios.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const unreadCount = await axios.get("/notifications/unread-count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(notifications.data?.notifications || []);
      setUnreadCount(unreadCount.data?.count || 0);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
  }, []);

  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = async (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        await markAllAsRead();
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="notif-wrapper" ref={ref}>
      <IconButton
        icon={unreadCount > 0 ? bellUnread : bell}
        label={` Notifications `}
        size="compact"
        variant="minimal"
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && (
        <div className="notif-popover">
          <div className="notif-list">
            <NotificationList
              data={data}
              loading={isLoading}
              onAction={(item) => readNotification(item.id)}
            />
            {data.length > 10 && (
              <div style={{ marginTop: "0.5rem", width: "100%" }}>
                <button
                  className="notif-action-btn"
                  style={{ width: "100%" }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    setOpen(false);
                    navigate("/notifications");
                  }}
                >
                  See all
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPopover;
