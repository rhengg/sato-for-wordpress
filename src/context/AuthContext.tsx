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
  refreshToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>();
  const [loading, setLoading] = useState(true);

  const fetchToken = useCallback(async () => {
    try {
      const res = await fetch(`${window.satoConfig.apiUrl}auth-token`, {
        headers: {
          "X-WP-Nonce": window.satoConfig.nonce,
        },
      });

      const data = await res.json();
      setToken(data.token || undefined);
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

  return (
    <AuthContext.Provider value={{ token, loading, refreshToken }}>
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
