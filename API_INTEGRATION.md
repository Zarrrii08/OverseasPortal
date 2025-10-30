# API Integration Overview

## Twilio Voice (Browser)
- **Library**: `@twilio/voice-sdk`
- **Device lifecycle**
  - `Device.register()` → device becomes ready.
  - `device.on('registered')` → UI can show "online".
  - `device.on('incoming', (conn))` → incoming call object received.
  - `conn.accept()` → start call.
  - `conn` events: `accept`, `disconnect`, `cancel`, `error`.

## Frontend Event Flow
- `incoming` (from Twilio):
  - Show incoming UI.
  - Extract caller number from `conn.parameters.From` (fallbacks: `from`, `Caller`).
- `accept` (per-connection):
  - Start session timer.
  - Log Call SID from `conn.parameters.CallSid` (fallbacks: `callsid`, `callSid`).
  - Emit app-level `connect` for downstream logic.
- `disconnect`/`cancel`:
  - Stop session timer, clear UI, reset state.

## Client Data Endpoint
- **Purpose**: Fetch Booking/Language using Twilio Call SID after call is accepted.
- **HTTP**: GET
- **URL**:
  - `https://odenhanced.language-empire.net/ODOverseasPortalAPI/api/Call/OnDemondClientData?callsid=<CallSid>`
- **Params**:
  - `callsid` (string) – Twilio Call SID from `conn.parameters`.
- **Auth**: None (as implemented). If API requires auth later, attach headers/tokens.
- **Response**: JSON
  - Expected keys (examples): `bookingRef` or `bookingReference`, `language` or `preferredLanguage`.

## UI Bindings
- Incoming panel shows caller number from connection parameters.
- After `accept`:
  - "Session Duration" timer starts.
  - Fetch client data using `CallSid` and display Booking Ref and Language.
- On `disconnect`/`offline`: reset timer and client info.

## Error Handling
- Log failures to fetch client data; show `-` placeholders in UI.
- Forward Twilio connection/device `error` events to a central handler.

## Notes
- Ensure only a single Twilio `Device` instance is active to avoid duplicate events.
- If CORS/auth is required by the API, add appropriate headers/credentials to the fetch call.
