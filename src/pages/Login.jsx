import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm/LoginForm";
import { useAuth } from "../context/AuthContext";
import backgroundImage from "/Images/background.png";
import maskBgImage from "/Images/mask-bg.png";
import analyticFrameImage from "/Images/anylictic-frame.png";

export default function LoginPage() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleLogin(creds) {
    // call context login and navigate on success
    await login(creds);
    navigate("/dashboard");
  }

  return (
    <section className="relative mx-auto flex min-h-screen w-full items-center justify-center px-4 py-6">
      {/* full-page background */}
      <img
        src={backgroundImage}
        alt="background"
        className="absolute inset-0 h-full w-full object-cover -z-10"
      />
      <div className="flex w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-sm md:h-[92dvh]">
        {/* LEFT HERO */}
        <div className="relative hidden basis-7/12 md:flex text-white items-center">
          {/* mask-bg is the side panel background */}
          <img
            src={maskBgImage}
            alt="panel-mask"
            className="absolute inset-0 h-full w-full object-cover z-0"
          />

          {/* content stacked above the mask: heading, analytics image, links */}
          <div className="relative z-10 mx-auto text-center max-w-lg flex flex-col items-center gap-6">
            <h1 className="text-4xl font-semibold text-white">Welcome back!</h1>
            <p className="text-white/90 text-sm leading-relaxed">
              Please Login in to your Linguist Portal. Access your interpreter
              bookings, manage your hours, download job sheets, and stay updated
              with the latest Language Empire announcements — all in one secure
              platform.
            </p>

            {/* analytics/frame image placed in the column */}
            <img
              src={analyticFrameImage}
              alt="analytics"
              className="w-100"
            />

            {/* policy links */}
            <div className="relative top-16 mt-6 flex justify-center gap-6 text-xs opacity-95">
              <a href="#" className="hover:underline text-white/90">
                Privacy Policy
              </a>
              <a href="#" className="hover:underline text-white/90">
                Terms of Service
              </a>
              <a href="#" className="hover:underline text-white/90">
                Cookies Policy
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex basis-full items-center justify-center p-6 md:basis-5/12 md:p-10">
          <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
        </div>
      </div>
    </section>
  );
}