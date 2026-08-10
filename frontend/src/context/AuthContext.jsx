import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import AuthContext from "./authContextObject";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosClient.get("/api/auth/me");

        setUser(response.data);
      } catch (error) {
        console.error("Failed to restore user:", error);

        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await axiosClient.post("/api/auth/login", {
        email,
        password,
      });

      const { token } = response.data;

      localStorage.setItem("token", token);

      const meResponse = await axiosClient.get("/api/auth/me");

      setUser(meResponse.data);

      return meResponse.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}