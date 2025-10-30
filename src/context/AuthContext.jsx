import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as authService from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true); // Start with true while checking auth
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function init() {
      const token = authService.getToken();
      const uid = authService.getUserId();
      if (!mounted) return;
      if (token) {
        setIsAuthenticated(true);
        if (uid) setUser({ userId: uid });
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    }
    init();
    return () => { mounted = false; };
  }, []);

  async function login({ cardNo, username, password }) {
    setError("");
    setLoading(true);
    // eslint-disable-next-line no-console
    console.debug("AuthContext.login start", {
      cardNo,
      username: username && username.replace(/(.{3}).+/, "$1***"),
    });
    try {
      const data = await authService.login({ cardNo, username, password });
      // eslint-disable-next-line no-console
      console.debug("AuthContext.login success", { data });
      // store user info if returned
      // prefer nested payloads (common backends) then full response
      const payload = data?.data || data?.user || data || null;
      setUser(payload);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("AuthContext.login error", err);
      setError(err.message || "Login failed");
      throw err;
    } finally {
      // eslint-disable-next-line no-console
      console.debug("AuthContext.login finally - clearing loading");
      setLoading(false);
    }
  }

  function logout() {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}