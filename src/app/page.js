"use client";

import { useSensorData } from "@/contexts/SensorDataContext";

import LiveData from "@/components/LiveData";
import Status from "@/components/Status";

export default function Home() {
  const {
    connected,
    reconnecting,
    lastSeenAt,
    lastDisconnectReason,
    connectNow,
    disconnectNow,
  } = useSensorData();

  return (
    <>
      {/* Status Section */}
      <section className="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-black">
            Status:{" "}
            <span
              className={
                connected
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {connected ? "Terhubung" : "Terputus"}
            </span>
            {reconnecting && (
              <span className="ml-2 text-amber-600">• reconnecting…</span>
            )}
            {lastSeenAt && (
              <div className="text-xs text-gray-500 mt-1">
                Last seen: {lastSeenAt.toLocaleString()}
                {lastDisconnectReason && ` — reason: ${lastDisconnectReason}`}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!connected && (
              <button
                onClick={connectNow}
                className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Reconnect
              </button>
            )}
            {connected && (
              <button
                onClick={disconnectNow}
                className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Sensor Section */}
      <section className="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Sensor</h2>
        <LiveData />
      </section>

      {/* Kondisi Section (placeholder) */}
      <Status />
    </>
  );
}
