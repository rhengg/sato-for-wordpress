import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Login from "./pages/Auth/Login";
import MediaLibrary from "./pages/MediaLibrary";
import AccountPage from "./pages/Account";
import Loader from "./components/Loader";
import { AuthProvider, useAuth } from "./context/AuthContext";

const AppContent = () => {
  const { token, loading } = useAuth();

  const page = new URLSearchParams(window.location.search).get("page");

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
          <MediaLibrary />
        </div>
      );

    case "sato-profile":
      return (
        <div style={{ padding: "1rem" }}>
          <AccountPage />
        </div>
      );

    case "sato-player-detail":
      return (
        <div style={{ padding: "1rem" }}>
          <Detail />
        </div>
      );

    case "sato-signin":
      window.location.href = `${window.location.pathname}?page=sato-player`;
      return null;

    case "sato-player":
    default:
      return (
        <div style={{ padding: "1rem" }}>
          <Home />
        </div>
      );
  }
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
