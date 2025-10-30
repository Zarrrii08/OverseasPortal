import { Device } from "@twilio/voice-sdk";

class TwilioVoiceClient {
  constructor() {
    this.device = null;
    this.incoming = null;
    this.activeConnection = null;
    this.tokenUrl = null;
    this.tokenParams = null;
    this.lastToken = null;
    this.listeners = new Map();
    this.state = {
      registered: false,
    };
  }

  on(event, cb) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(cb);
    return () => this.off(event, cb);
  }

  off(event, cb) {
    const set = this.listeners.get(event);
    if (set) set.delete(cb);
  }

  emit(event, payload) {
    const set = this.listeners.get(event);
    if (set) for (const cb of set) try { cb(payload); } catch {}
  }

  resolveTokenUrl(raw) {
    if (!raw) return null;
    if (/^https?:\/\//i.test(raw)) return raw;
    const base = import.meta.env.VITE_API_BASE || "";
    if (!base) return raw;
    const b = base.replace(/\/+$/, "");
    let p = raw.replace(/^\/+/, "");
    if (b.endsWith("/api") && p.startsWith("api/")) {
      p = p.replace(/^api\/+/, "");
    }
    if (raw.startsWith(b)) return raw; // already fully qualified with base
    return `${b}/${p}`;
  }

  async fetchToken() {
    let url = this.resolveTokenUrl(this.tokenUrl);
    if (this.tokenParams && typeof this.tokenParams === "object") {
      const usp = new URLSearchParams();
      Object.entries(this.tokenParams).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") usp.append(k, String(v));
      });
      const sep = url.includes("?") ? "&" : "?";
      url = `${url}${usp.toString() ? sep + usp.toString() : ""}`;
    }
    console.log("[Twilio] Fetching token from:", url);
    const res = await fetch(url, { credentials: "include" });
    // const res = await fetch(url);
    if (!res.ok) {
      console.error("[Twilio] Token fetch failed:", res.status, res.statusText);
      throw new Error(`Token fetch failed: ${res.status}`);
    }
    const data = await res.json();
    const token = data.token || data.accessToken || data;
    console.log("[Twilio] Token received. Length:" + token.length );
    this.lastResolvedTokenUrl = url;
    this.lastToken = token;
    return token;
  }

  async goOnline(tokenUrlOrOptions) {
    const defaultPath = "/Call/GenerateVoiceToken";
    if (typeof tokenUrlOrOptions === "string" || !tokenUrlOrOptions) {
      this.tokenUrl = tokenUrlOrOptions || defaultPath; // path; prepend base later
      this.tokenParams = null;
    } else {
      this.tokenUrl = tokenUrlOrOptions.tokenUrl || defaultPath;
      this.tokenParams = tokenUrlOrOptions.params || tokenUrlOrOptions;
    }
    await this.initDevice();
  }

  async initDevice() {
    const token = await this.fetchToken();
    if (this.device) {
      try { this.device.destroy(); } catch {}
      this.device = null;
    }
    this.device = new Device(token, {
      closeProtection: "A call is currently in progress. Leaving or reloading this page will end the call.",
      codecPreferences: ["opus", "pcmu"],
      fakeLocalDTMF: true,
      enableRingingState: true,
      disableAudioContextSounds: true,
      logLevel: "error"
    });

    this.device.on("registered", () => {
      this.state.registered = true;
      this.emit("registered");
      const claims = this.decodeJwtClaims(this.lastToken);
      console.group("[Twilio] Device registered and ready for calls");
      console.log("Device:", this.device);
      console.log("Token URL:", this.lastResolvedTokenUrl);
      console.log("Token params:", this.tokenParams);
      console.log("JWT claims:", claims);
      console.groupEnd();
    });

    this.device.on("incoming", (conn) => {
      this.incoming = conn;
      this.emit("incoming", conn);
      console.log("[Twilio] Incoming call detected");

      try {
        const onAccept = () => {
          console.log("[Twilio] Incoming call accepted");
          this.activeConnection = conn;
          try {
            const sid = conn && conn.parameters && (conn.parameters.CallSid || conn.parameters.callsid || conn.parameters.callSid);
            if (sid) console.log("[Twilio] Call SID:", sid);
            console.log("[Twilio] Call parameters:", conn.parameters);
           console.log("[Twilio] Full connection object:", JSON.parse(JSON.stringify(conn)));

          } catch {}
          this.emit("connect", conn);
          // Clear stored incoming reference once accepted
          if (this.incoming === conn) this.incoming = null;
        };
        const onDisconnect = () => {
          console.log("[Twilio] Incoming call disconnected");
          this.emit("disconnect", conn);
          if (this.activeConnection === conn) this.activeConnection = null;
          if (this.incoming === conn) this.incoming = null;
        };
        const onCancel = () => {
          console.log("[Twilio] Incoming call canceled");
          this.emit("disconnect", conn);
          if (this.activeConnection === conn) this.activeConnection = null;
          if (this.incoming === conn) this.incoming = null;
        };
        const onError = (err) => {
          console.error("[Twilio] Incoming connection error", err);
          this.emit("error", err);
        };

        // Attach per-connection listeners for inbound leg
        conn.once && conn.once("accept", onAccept);
        conn.once && conn.once("disconnect", onDisconnect);
        conn.once && conn.once("cancel", onCancel);
        conn.on && conn.on("error", onError);
      } catch {}
       debugger
    });

    this.device.on("connect", (conn) => {
      // track active call and forward per-connection end events
      this.activeConnection = conn;
      try {
        const onConnDisconnect = () => {
          console.log("[Twilio] Connection disconnected");
          this.emit("disconnect", conn);
          if (this.activeConnection === conn) this.activeConnection = null;
        };
        const onConnError = (err) => {
          console.error("[Twilio] Connection error", err);
          this.emit("error", err);
        };
        const onConnCancel = () => {
          console.log("[Twilio] Connection canceled");
          this.emit("disconnect", conn);
          if (this.activeConnection === conn) this.activeConnection = null;
        };
        conn.once && conn.once("disconnect", onConnDisconnect);
        conn.once && conn.once("cancel", onConnCancel);
        conn.on && conn.on("error", onConnError);
      } catch {}
      console.log("[Twilio] Call connected");
      this.emit("connect", conn);
    });
    this.device.on("disconnect", (conn) => {
      console.log("[Twilio] Call disconnected");
      this.emit("disconnect", conn);
      if (this.activeConnection === conn) this.activeConnection = null;
    });
    this.device.on("error", (err) => { console.error("[Twilio] Device error", err); this.emit("error", err); });
    this.device.on("offline", () => { console.warn("[Twilio] Device offline"); this.emit("offline"); });
    this.device.on("unregistered", () => { console.warn("[Twilio] Device unregistered"); this.emit("unregistered"); });
    this.device.on("tokenWillExpire", async () => {
      try {
        const newToken = await this.fetchToken();
        await this.device.updateToken(newToken);
        console.log("[Twilio] Token refreshed");
        this.emit("tokenRefreshed");
      } catch (e) {
        this.emit("error", e);
      }
    });

    try { await this.device.register(); } catch {}
  }

  async refresh() {
    console.log("[Twilio] Manual refresh triggered");
    await this.initDevice();
  }

  async goOffline() {
    this.state.registered = false;
    this.incoming = null;
    if (this.device) {
      try { this.device.destroy(); } catch {}
      this.device = null;
    }
  }

  isRegistered() { return !!this.state.registered; }

  acceptIncoming() {
    if (this.incoming) {
      try { this.incoming.accept(); } catch {}
    }
  }

  rejectIncoming() {
    if (this.incoming) {
      try { this.incoming.reject(); } catch {}
      this.incoming = null;
    }
  }

  disconnectAll() {
    if (this.device) {
      try { this.device.disconnectAll(); } catch {}
    }
  }

  connect(to) {
    if (this.device && to) {
      try { this.device.connect({ params: { To: to } }); } catch {}
    }
  }

  decodeJwtClaims(token) {
    try {
      if (!token || typeof token !== "string") return null;
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(atob(b64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(json);
    } catch (e) {
      console.warn("[Twilio] Failed to decode JWT claims", e);
      return null;
    }
  }
}

const twilioClient = new TwilioVoiceClient();
export default twilioClient;
