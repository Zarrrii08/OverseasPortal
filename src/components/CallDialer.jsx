import React from "react";
import { PhoneCall, PhoneOff, Pause, Play } from "lucide-react";
import { useTwilio } from "../context/TwilioContext";

export default function CallDialer() {
  const { clientInfo, addParticipant, setHold, participantAdded, callActive, disconnectAll, accepted } = useTwilio();
  const [phone, setPhone] = React.useState("");
  const [status, setStatus] = React.useState("idle"); // idle | dialing | connected | disconnected
  const [onHold, setOnHold] = React.useState(false);
  const [history, setHistory] = React.useState([]);

  const canCall = phone.length > 0 && /^(\+)?\d+$/.test(phone);
  const bookingRef = clientInfo && (clientInfo.bookingRef || clientInfo.bookingReference);
  const readyToDial = !!accepted && !!bookingRef;

  const handleInput = (e) => {
    const v = e.target.value.replace(/[^\d+]/g, "");
    const cleaned = v.startsWith("+") ? "+" + v.slice(1).replace(/\+/g, "") : v.replace(/\+/g, "");
    setPhone(cleaned);
  };

  async function startCall() {
    if (!canCall || !readyToDial) return;
    try {
      setStatus("dialing");
      await addParticipant(phone);
      // only after API success, mark connected and push history
      setStatus("connected");
      setHistory((h) => [{ number: phone, bookingRef, ts: Date.now(), result: "connected" }, ...h]);
    } catch (_) {
      setStatus("disconnected");
    }
  }

  function endCall() {
    setStatus("disconnected");
    setOnHold(false);
    try { disconnectAll(); } catch {}
  }

  function toggleHold() {
    setOnHold((v) => {
      const next = !v;
      try { setHold(next); } catch {}
      return next;
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 space-y-4">
        <h3 className="font-semibold text-gray-900">Service user</h3>

        <div className="flex gap-2 items-center">
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={handleInput}
            placeholder="Phone number along with country code"
            className="flex-1 h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={startCall}
            disabled={!canCall || !readyToDial || status === "dialing" || status === "connected"}
            className={`h-10 px-4 rounded-md text-white text-sm font-medium inline-flex items-center gap-2 ${
              !canCall || !readyToDial || status === "dialing" || status === "connected" ? "bg-gray-300 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            <PhoneCall size={16} /> {status === "dialing" ? "Dialing…" : "Call"}
          </button>

          {participantAdded && status === "connected" && (
            <div className="flex items-center gap-2">
              <button
                onClick={endCall}
                className="h-10 px-3 rounded-md text-white text-sm font-medium inline-flex items-center gap-2 bg-red-500 hover:bg-red-600"
                title="End Call"
              >
                <PhoneOff size={16} />
              </button>
              <button
                onClick={toggleHold}
                className={`h-10 px-3 rounded-md text-white text-sm font-medium inline-flex items-center gap-2 ${
                  onHold ? "bg-amber-600 hover:bg-amber-700" : "bg-amber-500 hover:bg-amber-600"
                }`}
                title={onHold ? "Unhold" : "Hold"}
              >
                {onHold ? <Play size={16} /> : <Pause size={16} />}
              </button>
            </div>
          )}
        </div>

        {(status === "connected" || status === "disconnected") && (
          <div className="text-sm text-gray-600">
            Status: <span className="font-medium capitalize">{status}</span>
          </div>
        )}

        <div className="pt-2">
          {history.length > 0 && (
            <>
              <div className="text-xs uppercase text-gray-500 mb-2">Call History</div>
              <ul className="divide-y">
                {history.map((h, i) => (
                  <li key={i} className="py-3 text-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{h.number}</span>
                      <span className="text-gray-500">Ref: {h.bookingRef || '-'}</span>
                    </div>
                    <div className="text-gray-500">
                      {new Date(h.ts).toLocaleString()} — <span className="capitalize">{h.result}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
