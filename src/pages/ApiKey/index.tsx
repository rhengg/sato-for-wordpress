import React from "react";
import "./apikey.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import Loader from "../../components/Loader";
import Toast from "../../components/Toast";
import IconButton from "../../components/IconButton";
import Modal from "../../components/Modal";
import InputPassword from "../../components/InputPassword";

const ApiKey = (props: any) => {
  const { length } = props;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLoading, setLoading] = React.useState(false);
  const [refetch, setRefetch] = React.useState(0);
  const [text, setText] = React.useState("");
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
  const [apiId, setApiId] = React.useState("");

  const [data, setData] = React.useState<any>([]);
  const [show, setShowToast] = React.useState(false);

  const fetchApiKey = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api-keys`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      setData(res.data);
    } catch (error) {
      console.log("error fetching media", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchApiKey();
  }, [refetch]);

  const generateApiKey = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `/api-keys`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("s-token")}`,
          },
        }
      );
      setTimeout(() => {
        setRefetch(Math.random());
      }, 500);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`/api-keys/${apiId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // console.log("delete", res);
      setOpenModalDelete(false);
      setText("Api Key Deleted");
      showToast();
      setTimeout(() => {
        setRefetch(Math.random());
      }, 800);
    } catch (error) {
      console.log("error deleting asset", error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    // return date.toLocaleDateString("en-IN");
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setText("API KEY copied");
    showToast();
  };

  const showToast = () => {
    setShowToast(true);
  };
  const hideToast = () => {
    setShowToast(false);
  };

  return (
    <div
      style={{
        marginTop: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "max-content",
          }}
        >
          <p className={"subtitle-one"}>Your API Keys</p>
        </div>
      </div>

      <p
        className="label textSecondary"
        style={{
          marginTop: "1rem",
        }}
      >
        API keys help you integrate Sato to any external applications like
        Webflow.
      </p>

      <div
        className="w-100"
        style={{
          marginTop: "1rem",
        }}
      >
        <button className="large-primary-btn m-100" onClick={generateApiKey}>
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
              add
            </span>
            Generate API KEY
          </div>
        </button>
      </div>

      {isLoading && (
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
      )}

      {data && data.length > 0 && (
        <div className="api-list">
          {data
            .sort((a: any, b: any) => {
              return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
              );
            })
            .map((api: any, index: number) => (
              <div
                key={api.id}
                className="api-item"
                style={{
                  borderBottom:
                    index === data.length - 1
                      ? "none"
                      : "1px solid var(--stroke)",
                  padding: "0.5rem 0",
                }}
              >
                <div className="api-details">
                  <span className="body">
                    <InputPassword value={api.value} />
                  </span>
                  <span className="dot">•</span>
                  <span className="label">
                    Created on: {formatDate(api.created_at)}
                  </span>
                </div>
                <div className="action-container">
                  <span
                    onClick={() => handleCopy(api.value)}
                    style={{
                      cursor: "pointer",
                    }}
                    className="material-symbols-outlined primary"
                  >
                    content_copy
                  </span>

                  <span
                    onClick={() => {
                      setOpenModalDelete(true);
                      setApiId(api.id);
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                    className="material-symbols-outlined negative"
                  >
                    delete_forever
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      <Modal
        isOpen={openModalDelete}
        setOpen={setOpenModalDelete}
        title={`Delete API Key?`}
        size="sm"
      >
        <p className="body">
          Deleting this video will permanently remove it from your profile.
        </p>
        <form onSubmit={deleteApiKey}>
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
                setOpenModalDelete(false);
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
            {text}
          </p>
        </div>
      </Toast>
    </div>
  );
};

export default ApiKey;
