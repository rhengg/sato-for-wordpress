import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Login from "./pages/Auth/Login";
import MediaLibrary from "./pages/MediaLibrary";
import AccountPage from "./pages/Account";
import React, { useEffect } from "react";
import Loader from "./components/Loader";

const App = () => {
  const [token, setToken] = React.useState<string>();
  const [loading, setLoading] = React.useState(true);
  const page = new URLSearchParams(window.location.search).get("page");

  useEffect(() => {
    const loadToken = async () => {
      try {
        const res = await fetch(`${window.satoConfig.apiUrl}auth-token`, {
          headers: {
            "X-WP-Nonce": window.satoConfig.nonce,
          },
        });
        const data = await res.json();
        setToken(data.token);
      } catch (error) {
        console.error("error fetching token", error);
      } finally {
        setLoading(false);
      }
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
      return <AccountPage token={token} />;
    case "sato-player-detail":
      return <Detail token={token} />;
    case "sato-signin":
      if (token) {
        window.location.href = `${window.location.pathname}?page=sato-player`;
        return null;
      }
      return <Login />;
    case "sato-player":
      return <Home token={token} />;
    default:
      return <Home token={token} />;
  }
};

export default App;
