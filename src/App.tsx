import React, { useEffect } from "react";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Login from "./pages/Auth/Login";
import MediaLibrary from "./pages/MediaLibrary";
import AccountPage from "./pages/Account";
import Loader from "./components/Loader";

const App = () => {
  const [token, setToken] = React.useState<string>();
  const [loading, setLoading] = React.useState(true);
  const page = new URLSearchParams(window.location.search).get("page");

  useEffect(() => {
    const loadToken = async () => {
      const res = await fetch(`${window.satoConfig.apiUrl}auth-token`, {
        headers: {
          "X-WP-Nonce": window.satoConfig.nonce,
        },
      });
      const data = await res.json();
      setToken(data.token);
      setLoading(false);
    };

    loadToken();
  }, []);

  if (loading) {
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
  }

  if (!token) {
    return <Login />;
  }

  switch (page) {
    case "sato-video-library":
      return (
        <div style={{ padding: "1rem" }}>
          <MediaLibrary token={token} />
        </div>
      );
    case "sato-profile":
      return (
        <div style={{ padding: "1rem" }}>
          <AccountPage token={token} />
        </div>
      );
    case "sato-player-detail":
      return (
        <div style={{ padding: "1rem" }}>
          <Detail token={token} />
        </div>
      );
    case "sato-signin":
      if (token) {
        window.location.href = `${window.location.pathname}?page=sato-player`;
        return null;
      }
      return <Login />;
    case "sato-player":
      return (
        <div style={{ padding: "1rem" }}>
          <Home token={token} />
        </div>
      );
    default:
      return (
        <div style={{ padding: "1rem" }}>
          <Home token={token} />
        </div>
      );
  }
};

export default App;
