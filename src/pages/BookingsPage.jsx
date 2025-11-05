import React from "react";
import { PhoneIncoming, PhoneCall, PhoneOff, Check, X } from "lucide-react";
import { useTwilio } from "../context/TwilioContext";
import CallDialer from "../components/CallDialer";

export default function BookingsPage() {
  const {
    isOnline,
    hasIncoming,
    accepted,
    callerNumber,
    clientInfo,
    clientInfoLoading,
    callTimeStr,
    goOnline,
    goOffline,
    acceptIncoming,
    connect,
    disconnectAll,
  } = useTwilio();

  // No page-local phone list state; moved into CallDialer

  return (
    <div className="p-6">
      <div className="space-y-4">
        {isOnline && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-800">
            You are online. Refreshing or leaving this page may end your availability.
          </div>
        )}
        {/* Availability Card */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="font-semibold text-gray-900">
                Turn the switch on/off based on your availability
              </h2>
              <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                <span>{accepted ? "Session Duration" : "Status Waiting"}</span>
                {accepted && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {callTimeStr}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={async () => {
                if (isOnline) {
                  await goOffline();
                } else {
                  await goOnline();
                }
              }}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                isOnline ? "bg-green-500" : "bg-gray-300"
              }`}
              aria-label="Toggle online"
           >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                  isOnline ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Incoming Call (visible when online) */}
        {isOnline && !accepted && (
          hasIncoming ? (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Incoming Call</h3>
                  <div className="mt-2 text-sm text-gray-700 flex items-center gap-2">
                    <span className="text-gray-600">Caller No:</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                      {callerNumber || "Unknown"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => acceptIncoming()}
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-2 rounded-md"
                  >
                    <PhoneIncoming size={16} /> Accept call
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-12 flex items-center justify-center">
                <span className="text-sm text-gray-400">Waiting for calls…</span>
              </div>
            </div>
          )
        )}

        {/* Accepted Call View */}
        {accepted && (
          <div className="space-y-4">
            {/* Incoming Call Card with actions */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Incoming Call</h3>
                  <div className="mt-2 text-sm text-gray-700 flex items-center gap-2">
                    <span className="text-gray-600">Caller No:</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                      {callerNumber || "Unknown"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-2 bg-amber-500/90 hover:bg-amber-500 text-white text-sm font-medium px-3 py-2 rounded-md">
                    <X size={16} /> Wrong call
                  </button>
                  <button className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-3 py-2 rounded-md">
                    <PhoneCall size={16} /> Redirect to operator
                  </button>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Client Information</h3>
                {clientInfoLoading ? (
                  <div className="text-sm text-gray-500">Loading client info…</div>
                ) : (
                  <div className="text-sm text-gray-700 flex flex-wrap items-center gap-6">
                    <div>
                      <span className="text-gray-600">Booking Ref:</span>
                      <span className="ml-2 font-medium">{(clientInfo && (clientInfo.bookingRef || clientInfo.bookingReference)) || "-"}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Language:</span>
                      <span className="ml-2 font-medium">{(clientInfo && (clientInfo.language || clientInfo.preferredLanguage)) || "-"}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Service user (refactored dialer) */}
            <CallDialer />
          </div>
        )}
      </div>
    </div>
  );
}
