import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  LayoutDashboard,
  Users,
  Phone,
  DollarSign,
  FolderOpen,
  BarChart3,
  FileText,
  UserCog,
  Shield,
  MessageSquare,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  { id: "bookings", label: "Bookings Calls", icon: Phone, path: "/bookings" },
  // {
  //   id: "on-demand",
  //   label: "On-demand Calls",
  //   icon: Phone,
  //   path: "/on-demand-calls",
  // },
  // { id: "finance", label: "Finance", icon: DollarSign, path: "/finance" },
  // {
  //   id: "useful-links",
  //   label: "Useful Links & Training",
  //   icon: FolderOpen,
  //   path: "/useful-links",
  // },
  // { id: "cpd", label: "CPD Course", icon: BarChart3, path: "/cpd-course" },
  // {
  //   id: "policies",
  //   label: "Policies & Procedure",
  //   icon: FileText,
  //   path: "/policies",
  // },
  // {
  //   id: "profile",
  //   label: "Profile & Setting",
  //   icon: UserCog,
  //   path: "/profile",
  // },
  // {
  //   id: "screening",
  //   label: "Screening & Vetting",
  //   icon: Shield,
  //   path: "/screening",
  // },
  // {
  //   id: "enquiries",
  //   label: "Enquiries & Feedback",
  //   icon: MessageSquare,
  //   path: "/enquiries",
  // },
  // {
  //   id: "system",
  //   label: "System Updates",
  //   icon: Bell,
  //   path: "/system-updates",
  // },
];

export default function Sidebar({ isOpen, onClose, onToggle }) {
  const location = useLocation();
  const [tooltip, setTooltip] = useState({
    visible: false,
    label: "",
    top: 0,
    left: 0,
  });
  const containerRef = useRef(null);

  useEffect(() => {
    function onResize() {
      setTooltip((t) => ({ ...t, visible: false }));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={containerRef}
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-gray-50 to-gray-100 shadow-xl z-50 
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-0
          ${isOpen ? "lg:w-72" : "lg:w-20"}
          w-72
          flex flex-col
          overflow-visible
        `}>
        {/* Logo Section */}
        <div className="p-4 flex items-center justify-between transition-all duration-300 border-b border-gray-200">
          <div
            className={`flex items-center gap-3 ${
              isOpen ? "" : "lg:opacity-0 lg:w-0 lg:overflow-hidden"
            }`}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200 flex-shrink-0">
              <svg
                className="w-7 h-7 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-xl text-blue-900 whitespace-nowrap transition-all duration-300">
              Linguist Hub
            </span>
          </div>

          {/* Desktop Toggle Button - Always Visible */}
          <button
            onClick={onToggle}
            className="hidden lg:flex p-2 hover:bg-white rounded-lg transition-all duration-200 hover:shadow-md group flex-shrink-0"
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}>
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <div
                key={item.id}
                className="relative group/tooltip"
                onMouseEnter={(e) => {
                  try {
                    if (
                      !isOpen &&
                      typeof window !== "undefined" &&
                      window.innerWidth >= 1024
                    ) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const top = rect.top + rect.height / 2 + window.scrollY;
                      const left = rect.right + 12 + window.scrollX; // small gap
                      setTooltip({
                        visible: true,
                        label: item.label,
                        top,
                        left,
                      });
                    }
                  } catch (err) {
                    // ignore
                  }
                }}
                onMouseLeave={() =>
                  setTooltip((t) => ({ ...t, visible: false }))
                }>
                <Link
                  to={item.path}
                  onClick={(e) => {
                    try {
                      // close only on mobile / small screens
                      if (
                        typeof window !== "undefined" &&
                        window.innerWidth < 1024
                      ) {
                        onClose && onClose(e);
                      }
                    } catch (err) {}
                  }}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`
                    group flex items-center gap-3 rounded-xl
                    transition-all duration-300 ease-out
                    animate-slideInLeft relative
                    ${
                      isOpen
                        ? "px-4 py-3.5"
                        : "lg:px-2 lg:py-3.5 lg:justify-center px-4 py-3.5"
                    }
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                        : "text-gray-700 hover:bg-white hover:shadow-md hover:scale-102"
                    }
                    ${
                      item.path === "/profile"
                        ? "rounded-tl-none rounded-tr-none rounded-br-lg rounded-bl-lg border-t border-blue-500 mt-2 pt-2"
                        : ""
                    }
                  `}>
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 flex-shrink-0 ${
                      isActive
                        ? "bg-white/20 shadow-inner"
                        : "bg-gray-200 group-hover:bg-blue-100"
                    }`}>
                    <Icon
                      className={`${
                        isActive
                          ? "text-white"
                          : "text-gray-600 group-hover:text-blue-600"
                      } w-5 h-5 transition-all duration-300`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                      isActive ? "font-semibold" : "group-hover:text-blue-700"
                    } ${isOpen ? "opacity-100" : "lg:opacity-0 lg:hidden"}`}>
                    {item.label}
                  </span>

                  {/* Active Indicator */}
                  {isActive && isOpen && (
                    <div className="ml-auto w-1.5 h-8 bg-white rounded-full animate-slideInRight" />
                  )}
                </Link>

                {/* legacy tooltip fallback for very old browsers */}
                {!isOpen && (
                  <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div
          className={`p-4 border-t border-gray-200 bg-white/50 transition-all duration-300 ${
            isOpen ? "" : "lg:p-2"
          }`}>
          <div
            className={`text-xs text-gray-500 text-center animate-fadeIn transition-all duration-300 ${
              isOpen ? "opacity-100" : "lg:opacity-0 lg:hidden"
            }`}>
            © 2025 Linguist Hub
          </div>
          {!isOpen && (
            <div className="hidden lg:block text-xs text-gray-500 text-center">
              ©
            </div>
          )}
        </div>
      </aside>

      {/* Tooltip portal for collapsed sidebar - rendered on document.body so it won't be clipped */}
      {tooltip.visible &&
        createPortal(
          <div
            className="lg:block px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg transition-opacity duration-150 whitespace-nowrap z-[99999]"
            style={{
              position: "fixed",
              top: tooltip.top,
              left: tooltip.left,
              transform: "translateY(-50%)",
            }}>
            {tooltip.label}
          </div>,
          document.body
        )}
    </>
  );
}
