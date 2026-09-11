import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

type AuthContextType = {
  token?: string;
  loading: boolean;
  setAuthToken: (token?: string) => void;
  refreshToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>();
  const [loading, setLoading] = useState(true);

  const fetchToken = useCallback(async () => {
    try {
      await fetch(`${window.satoConfig.apiUrl}auth-token?_cb=${Date.now()}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          "X-WP-Nonce": window.satoConfig.nonce,
        },
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => setToken(data.token || undefined));
    } catch (error) {
      setToken(undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  const refreshToken = useCallback(async () => {
    setLoading(true);
    await fetchToken();
  }, [fetchToken]);

  const setAuthToken = useCallback((newToken?: string) => {
    setToken(newToken);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, loading, setAuthToken, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
