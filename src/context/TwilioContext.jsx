import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import twilioClient from "../lib/twilioClient";
import { useAuth } from "./AuthContext";
import axios from "axios";

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
  const [participantAdded, setParticipantAdded] = useState(false);
  const [clientInfoLoading, setClientInfoLoading] = useState(false);
  const [clientCallSid, setClientCallSid] = useState(null);

  const unsubscribers = useRef([]);
  const clientInfoTimer = useRef(null);

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
      setParticipantAdded(false);
      setClientInfoLoading(false);
      setClientCallSid(null);
      if (clientInfoTimer.current) { try { clearTimeout(clientInfoTimer.current); } catch {} clientInfoTimer.current = null; }
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
      setParticipantAdded(false);
      try {
        const p = conn && conn.parameters ? conn.parameters : {};
        const num = p.From || p.from || p.Caller || p.caller || "";
        setCallerNumber(num);
      } catch {
        setCallerNumber("");
      }
    });

    const clearCallState = () => {
      setAccepted(false);
      setHasIncoming(false);
      setCallerNumber("");
      setClientInfo(null);
      setCallSeconds(0);
      setParticipantAdded(false);
      setClientInfoLoading(false);
      setClientCallSid(null);
      if (clientInfoTimer.current) { try { clearTimeout(clientInfoTimer.current); } catch {} clientInfoTimer.current = null; }
    };

    // Only clear call state on real disconnects. Do not force offline.
    const offDisconnect = twilioClient.on("disconnect", clearCallState);
    const offCancel = twilioClient.on("cancel", () => {
      setHasIncoming(false);
    });
    // Offline/unregistered should not auto-end call; leave online flag alone.
    const offOffline = twilioClient.on("offline", () => {});
    const offUnregistered = twilioClient.on("unregistered", () => {});

    const offConnect = twilioClient.on("connect", (conn) => {
      setAccepted(true);
      try {
        const p = conn && conn.parameters ? conn.parameters : {};
        const sid = p.CallSid || p.callsid || p.callSid || "";
        if (!sid) return;
        setClientCallSid(sid);
        setClientInfoLoading(true);
        if (clientInfoTimer.current) { try { clearTimeout(clientInfoTimer.current); } catch {} }
        clientInfoTimer.current = setTimeout(async () => {
          try {
            const base = import.meta.env.VITE_API_BASE?.replace(/\/+$/, '') || '';
            const url1 = `${base}/Call/OnDemondClientData?ClientCallSid=${encodeURIComponent(sid)}`;
            const url2 = `${base}/Call/OnDemandClientData?ClientCallSid=${encodeURIComponent(sid)}`;
            let data = null;
            try {
              const r1 = await axios.get(url1, { withCredentials: true });
              data = r1.data;
            } catch (e) {
              try {
                const r2 = await axios.get(url2, { withCredentials: true });
                data = r2.data;
              } catch (e2) {
                // Last attempt: try without /Call prefix
                const alt1 = `${base}/OnDemondClientData?ClientCallSid=${encodeURIComponent(sid)}`;
                const alt2 = `${base}/OnDemandClientData?ClientCallSid=${encodeURIComponent(sid)}`;
                try {
                  const rA = await axios.get(alt1, { withCredentials: true });
                  data = rA.data;
                } catch (e3) {
                  const rB = await axios.get(alt2, { withCredentials: true });
                  data = rB.data;
                }
              }
            }
            if (data && Object.keys(data || {}).length > 0) {
              console.log("[TwilioContext] Client info fetched after delay", { sid, data });
              setClientInfo(data);
            } else {
              const fallback = {
                bookingRef: p.bookingRef || p.bookingReference || null,
                language: p.language || p.preferredLanguage || null,
              };
              console.log("[TwilioContext] Client info empty; using fallback from connection params", { sid, fallback });
              setClientInfo(fallback);
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error("[TwilioContext] Failed to fetch client info", e);
            try {
              const p2 = conn && conn.parameters ? conn.parameters : {};
              const fallback = {
                bookingRef: p2.bookingRef || p2.bookingReference || null,
                language: p2.language || p2.preferredLanguage || null,
              };
              console.log("[TwilioContext] Client info fetch failed; using fallback from connection params", { sid, fallback });
              setClientInfo(fallback);
            } catch {
              setClientInfo(null);
            }
          } finally {
            setClientInfoLoading(false);
          }
        }, 5000);
      } catch {}
    });

    unsubscribers.current = [
      offRegistered,
      offIncoming,
      offDisconnect,
      offCancel,
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

  function setHold(hold) {
    try { twilioClient.setHold(hold); } catch {}
  }

  const callActive = twilioClient.isCallActive();

  async function addParticipant(phoneNumber) {
    try {
      const bookingRef = (clientInfo && (clientInfo.bookingRef || clientInfo.bookingReference)) || null;
      if (!bookingRef || !phoneNumber) throw new Error("Missing bookingRef or phoneNumber");
      const apiBase = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");
      const addUrl = `${apiBase}/Call/AddParticipant?BookingRef=${encodeURIComponent(bookingRef)}&phoneNumber=${encodeURIComponent(phoneNumber)}`;
      const res = await axios.post(addUrl, null, { withCredentials: true });
      console.log("[TwilioContext] AddParticipant success", { status: res?.status, url: addUrl, bookingRef, phoneNumber });
      setParticipantAdded(true);
      return true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[TwilioContext] AddParticipant failed", e);
      setParticipantAdded(false);
      throw e;
    }
  }

  const value = {
    // state
    isOnline,
    hasIncoming,
    accepted,
    callerNumber,
    clientInfo,
    clientInfoLoading,
    callSeconds,
    callTimeStr,
    participantAdded,
    callActive,
    // actions
    goOnline,
    goOffline,
    acceptIncoming,
    connect,
    disconnectAll,
    setHold,
    addParticipant,
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
