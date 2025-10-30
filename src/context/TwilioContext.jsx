import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import twilioClient from "../lib/twilioClient";
import { useAuth } from "./AuthContext";

const ONLINE_KEY = "__booking_online";

const TwilioContext = createContext(null);

export function TwilioProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [isOnline, setIsOnline] = useState(false);
  const [hasIncoming, setHasIncoming] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [callerNumber, setCallerNumber] = useState("");
  const [clientInfo, setClientInfo] = useState(null);
  const [callSeconds, setCallSeconds] = useState(0);

  const unsubscribers = useRef([]);

  // Derived display for duration if needed by consumers
  const callTimeStr = useMemo(() => {
    const m = String(Math.floor(callSeconds / 60)).padStart(2, "0");
    const s = String(callSeconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  }, [callSeconds]);

  // Session persistence and device lifecycle
  useEffect(() => {
    if (!isOnline) {
      // Going offline -> cleanup
      twilioClient.goOffline();
      setAccepted(false);
      setHasIncoming(false);
      setCallerNumber("");
      setClientInfo(null);
      setCallSeconds(0);
      unsubscribers.current.forEach((u) => { try { u(); } catch {} });
      unsubscribers.current = [];
      try { sessionStorage.removeItem(ONLINE_KEY); } catch {}
      return;
    }

    try { sessionStorage.setItem(ONLINE_KEY, "1"); } catch {}
    const uid = sessionStorage.getItem("__auth_user_id");
    // Register device
    twilioClient.goOnline({ params: { identity: uid } });

    const offRegistered = twilioClient.on("registered", () => setHasIncoming(false));
    const offIncoming = twilioClient.on("incoming", (conn) => {
      setHasIncoming(true);
      setAccepted(false);
      try {
        const p = conn && conn.parameters ? conn.parameters : {};
        const num = p.From || p.from || p.Caller || p.caller || "";
        setCallerNumber(num);
      } catch {
        setCallerNumber("");
      }
    });

    const resetAll = () => {
      setAccepted(false);
      setHasIncoming(false);
      setCallerNumber("");
      setClientInfo(null);
      setCallSeconds(0);
      setIsOnline(false); // triggers full cleanup path
    };

    const offDisconnect = twilioClient.on("disconnect", resetAll);
    const offOffline = twilioClient.on("offline", resetAll);
    const offUnregistered = twilioClient.on("unregistered", resetAll);

    const offConnect = twilioClient.on("connect", async (conn) => {
      setAccepted(true);
      try {
        const p = conn && conn.parameters ? conn.parameters : {};
        const sid = p.CallSid || p.callsid || p.callSid || "";
        if (!sid) return;
        const base = import.meta.env.VITE_API_BASE?.replace(/\/+$/, '') || '';
        const url = `${base}/Call/OnDemondClientData?ClientCallSid=${encodeURIComponent(sid)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Client data fetch failed: ${res.status}`);
        const data = await res.json();
        setClientInfo(data || null);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[TwilioContext] Failed to fetch client info", e);
        setClientInfo(null);
      }
    });

    unsubscribers.current = [
      offRegistered,
      offIncoming,
      offDisconnect,
      offOffline,
      offUnregistered,
      offConnect,
    ];

    return () => {
      unsubscribers.current.forEach((u) => { try { u(); } catch {} });
      unsubscribers.current = [];
    };
  }, [isOnline]);

  // Auto-online on mount if session says so and user is authenticated
  useEffect(() => {
    if (authLoading) return;
    try {
      const online = sessionStorage.getItem(ONLINE_KEY) === "1";
      if (online && isAuthenticated) {
        setIsOnline(true);
      }
    } catch {}
  }, [authLoading, isAuthenticated]);

  // Call duration timer when accepted
  useEffect(() => {
    if (!accepted) return;
    setCallSeconds(0);
    const id = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [accepted]);

  // Guard: beforeunload, keyboard refresh, and history navigation while online
  useEffect(() => {
    function onBeforeUnload(e) {
      if (!isOnline) return;
      e.preventDefault();
      e.returnValue = "";
    }
    function onKeyDown(e) {
      if (!isOnline) return;
      const isRefreshKey = e.key === "F5" || ((e.ctrlKey || e.metaKey) && (e.key === "r" || e.key === "R"));
      if (isRefreshKey) {
        e.preventDefault();
        // eslint-disable-next-line no-alert
        alert("You are online. Refreshing the page will end your availability.");
      }
    }
    function push() {
      try { window.history.pushState(null, "", window.location.href); } catch {}
    }
    function onPopState() {
      if (!isOnline) return;
      push();
      // eslint-disable-next-line no-alert
      alert("You are online. Navigating away will end your availability.");
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("keydown", onKeyDown, { capture: true });

    if (isOnline) {
      push();
      window.addEventListener("popstate", onPopState);
    }

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("popstate", onPopState);
    };
  }, [isOnline]);

  // Public API
  async function goOnline() {
    setIsOnline(true);
  }

  async function goOffline() {
    // If a call is ongoing, confirm first
    const callActive = accepted || !!twilioClient.activeConnection;
    if (callActive) {
      // eslint-disable-next-line no-alert
      const proceed = window.confirm(
        "⚠️ You’re currently in a call.\nGoing offline will end your current call and reset the session.\nDo you want to proceed?"
      );
      if (!proceed) return false;
      try { twilioClient.disconnectAll(); } catch {}
    }
    setIsOnline(false);
    return true;
  }

  // Additional helpers to preserve existing page behavior
  function acceptIncoming() {
    try { twilioClient.acceptIncoming(); } catch {}
    setAccepted(true);
    setHasIncoming(false);
  }

  function connect(to) {
    try { twilioClient.connect(to); } catch {}
  }

  function disconnectAll() {
    try { twilioClient.disconnectAll(); } catch {}
  }

  const value = {
    // state
    isOnline,
    hasIncoming,
    accepted,
    callerNumber,
    clientInfo,
    callSeconds,
    callTimeStr,
    // actions
    goOnline,
    goOffline,
    acceptIncoming,
    connect,
    disconnectAll,
  };

  return (
    <TwilioContext.Provider value={value}>{children}</TwilioContext.Provider>
  );
}

TwilioProvider.propTypes = {
  children: PropTypes.node,
};

export function useTwilio() {
  const ctx = useContext(TwilioContext);
  if (!ctx) throw new Error("useTwilio must be used within TwilioProvider");
  return ctx;
}
