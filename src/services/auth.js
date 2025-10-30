// prefer Vite env variable VITE_API_BASE; fall back to the previous hardcoded URL
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "";

// in-memory access token
let accessToken = null;
const SESSION_KEY = "__auth_access_token";
const SESSION_USER_ID = "__auth_user_id";

let userId = null;

export function setAccessToken(token) {
  accessToken = token || null;
  try {
    if (accessToken) sessionStorage.setItem(SESSION_KEY, accessToken);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {
    // ignore sessionStorage errors
  }
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
  try {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_USER_ID);
  } catch (e) {
    // ignore
  }
}

// axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE,
  // withCredentials: true,
});

// attach Authorization header when accessToken exists
axiosInstance.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// helper: attempt refresh token flow
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function attemptRefresh() {
  try {
    const res = await axiosInstance.post(`/Auth/refresh`);
    const data = res.data;
    const token = data?.token || data?.accessToken || data?.data?.token;
    if (token) {
      setAccessToken(token);
      return token;
    }
    return null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.debug(
      "attemptRefresh failed",
      err?.response?.status || err.message
    );
    return null;
  }
}

// response interceptor: do not auto-clear token or refresh for now
axiosInstance.interceptors.response.use(
  (resp) => resp,
  async (error) => Promise.reject(error)
);

// migration helper: clear legacy tokens from localStorage if present
function clearLegacyTokens() {
  try {
    const legacyKeys = ["accessToken", "token", "auth_token"];
    legacyKeys.forEach((k) => {
      if (localStorage.getItem(k)) {
        // eslint-disable-next-line no-console
        console.debug("clearing legacy token key from localStorage", k);
        localStorage.removeItem(k);
      }
    });
  } catch (e) {
    // ignore (no localStorage in some environments)
  }
}

// run migration helper at module init
clearLegacyTokens();

// rehydrate token from sessionStorage so page refresh preserves session when backend cookies are unavailable
function loadAccessTokenFromSession() {
  try {
    const t = sessionStorage.getItem(SESSION_KEY);
    if (t) accessToken = t;
    const uid = sessionStorage.getItem(SESSION_USER_ID);
    if (uid) userId = uid;
  } catch (e) {
    // ignore
  }
}

loadAccessTokenFromSession();
// Exported function: call refresh endpoint to exchange httpOnly refresh cookie for access token
export async function refresh() {
  try {
    const res = await axiosInstance.post(`/Auth/refresh`);
    const data = res.data;
    const token = data?.token || data?.accessToken || data?.data?.token;
    if (token) {
      setAccessToken(token);
    }
    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.debug("refresh failed", err?.response?.status || err.message);
    clearAccessToken();
    return null;
  }
}

export async function login({ cardNo, username, password }) {
  const url = `/Auth/login`;
  // eslint-disable-next-line no-console
  console.debug("auth.login -> POST", API_BASE + url, {
    cardNo,
    username: username && username.replace(/(.{3}).+/, "$1***"),
  });
  const res = await axiosInstance.post(url, { cardNo, username, password });
  const data = res.data;
  const resp = data?.response || data?.data || data;
  const token = resp?.token || data?.token || data?.accessToken;
  const uid = resp?.userId ?? data?.userId ?? data?.data?.userId;
  if (token) setAccessToken(token);
  try {
    if (uid != null) {
      userId = String(uid);
      sessionStorage.setItem(SESSION_USER_ID, userId);
    }
  } catch {}
  return data;
}

export async function me() {
  try {
    const res = await axiosInstance.get(`/Auth/me`);
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      // eslint-disable-next-line no-console
      console.debug("auth.me: endpoint not implemented (404)", {
        url: API_BASE + "/Auth/me",
        body: err.response.data,
      });
      return null;
    }
    throw err;
  }
}

export async function logout() {
  try {
    await axiosInstance.post(`/Auth/logout`);
  } catch (e) {
    // If the backend doesn't implement logout (404) or method not allowed (405),
    // treat it as a no-op and silently continue — we still clear client state below.
    const status = e?.response?.status;
    if (status === 404 || status === 405) {
      // expected in some dev/backends; don't spam console
    } else {
      // eslint-disable-next-line no-console
      console.warn("logout network warning", e);
    }
  }
  clearAccessToken();
}

export function getToken() {
  return accessToken;
}

export function getUserId() {
  return userId;
}

export function isAuthenticated() {
  return !!accessToken;
}
