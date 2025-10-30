"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import logoImage from "/logo.png";

function IconId() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        className="fill-none stroke-gray-400"
        strokeWidth="1.5"
      />
      <rect
        x="6"
        y="9"
        width="6"
        height="2.5"
        rx="1.25"
        className="fill-gray-300"
      />
      <rect
        x="6"
        y="13"
        width="12"
        height="2.5"
        rx="1.25"
        className="fill-gray-300"
      />
    </svg>
  );
}
function IconMail() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16v12H4z" className="stroke-gray-400" strokeWidth="1.5" />
      <path
        d="M4 7l8 6 8-6"
        className="stroke-gray-400"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
function IconEye({ off = false }) {
  return off ? (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M3 3l18 18" className="stroke-gray-500" strokeWidth="1.6" />
      <path
        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
        className="stroke-gray-500"
        strokeWidth="1.6"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        class="stroke-gray-500"
        stroke-width="1.6"
        fill="none"></circle>
    </svg>
  ) : (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
        className="stroke-gray-500"
        strokeWidth="1.6"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        className="stroke-gray-500"
        strokeWidth="1.6"
        fill="none"
      />
    </svg>
  );
}

export default function LoginForm({ onSubmit, loading, error }) {
  const [cardNo, setCardNo] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  async function submit(e) {
    e.preventDefault();
    // await the parent login handler so we can catch errors locally
    try {
      // onSubmit returns a promise from AuthContext.login
      await onSubmit({ cardNo, username, password });
    } catch (err) {
      // AuthContext already sets error state; log for debugging
      // eslint-disable-next-line no-console
      console.warn("LoginForm submit error", err);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 md:p-8">
      <div className="mb-6 flex flex-col items-center text-center">
        {/* If the image exists in public, it will render; otherwise it gracefully hides */}
        <img
          src={logoImage}
          alt="logo"
          className="mb-4 h-40 w-40 object-contain"
        />
        <h2 className="text-2xl font-semibold">
          Login To Access Your Account.
        </h2>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <form className="grid gap-4" onSubmit={submit}>
        {/* ID Card Number */}
        <div className="grid gap-2">
          <label htmlFor="idCard" className="text-sm font-medium">
            ID Card Number
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IconId />
            </span>
            <input
              id="idCard"
              value={cardNo}
              onChange={(e) => setCardNo(e.target.value)}
              type="text"
              inputMode="numeric"
              placeholder="0000"
              className="h-12 w-full rounded-md border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              required
              aria-describedby="idCard-help"
            />
          </div>
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IconMail />
            </span>
            <input
              id="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="email"
              placeholder="User@example.com"
              className="h-12 w-full rounded-md border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPwd ? "text" : "password"}
              placeholder="Enter your Password"
              className="h-12 w-full rounded-md border border-gray-200 bg-white pl-3 pr-12 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              required
            />
            <button
              type="button"
              aria-label={showPwd ? "Hide password" : "Show password"}
              aria-pressed={showPwd}
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800">
              <IconEye off={showPwd} />
            </button>
            <a
              href="#"
              className="absolute right-0 top-full mt-1 text-xs text-red-500 hover:underline">
              Forget Password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 h-12 rounded-xl bg-blue-500 px-4 text-lg font-medium text-white transition hover:bg-blue-600 disabled:opacity-60">
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="mt-2 text-center text-sm">
          Request for{" "}
          <a href="#" className="font-medium text-blue-600 hover:underline">
            login here.
          </a>
        </p>
      </form>
    </div>
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

LoginForm.defaultProps = {
  loading: false,
  error: "",
};
