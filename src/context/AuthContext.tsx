import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  token?: string;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>();
  const [loading, setLoading] = useState(true);

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
        setToken(undefined);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, loading }}>
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
