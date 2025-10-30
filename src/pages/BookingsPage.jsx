import React from "react";
import { PhoneIncoming, PhoneCall, PhoneOff, Check, X } from "lucide-react";
import { useTwilio } from "../context/TwilioContext";

export default function BookingsPage() {
  const {
    isOnline,
    hasIncoming,
    accepted,
    callerNumber,
    clientInfo,
    callTimeStr,
    goOnline,
    goOffline,
    acceptIncoming,
    connect,
    disconnectAll,
  } = useTwilio();

  const [phoneInput, setPhoneInput] = React.useState("");
  const [serviceUsers, setServiceUsers] = React.useState([]);

  // Clear local inputs when going offline (preserves prior behavior)
  React.useEffect(() => {
    if (!isOnline) {
      setServiceUsers([]);
      setPhoneInput("");
    }
  }, [isOnline]);

  const addServiceUser = () => {
    if (!phoneInput.trim()) return;
    setServiceUsers((list) => [...list, phoneInput.trim()]);
    setPhoneInput("");
  };

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
              </div>
            </div>

            {/* Service user */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Service user</h3>

                <div className="flex gap-2">
                  <input
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Phone number along with country code"
                    className="flex-1 h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addServiceUser}
                    className="h-10 px-4 rounded-md bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      const num = phoneInput.trim();
                      if (!num) return;
                      connect(num);
                    }}
                    className="h-10 px-4 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium inline-flex items-center gap-2"
                  >
                    <PhoneCall size={16} /> Call
                  </button>
                </div>

                <div className="mt-4">
                  <div className="text-xs uppercase text-gray-500 mb-2">Phone numbers</div>
                  <ul className="divide-y">
                    {serviceUsers.length === 0 && (
                      <li className="py-3 text-sm text-gray-400">No phone numbers added</li>
                    )}
                    {serviceUsers.map((num, i) => (
                      <li key={i} className="py-3 flex items-center justify-between text-sm">
                        <span className="font-medium">{num}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              connect(num);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-white bg-emerald-500 hover:bg-emerald-600"
                          >
                            <Check size={14} /> Dial
                          </button>
                          <button
                            onClick={() => setServiceUsers((l) => l.filter((_, idx) => idx !== i))}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-white bg-red-500 hover:bg-red-600"
                          >
                            <PhoneOff size={14} /> Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
