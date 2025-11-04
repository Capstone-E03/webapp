"use client";

import { useMemo, useState, useEffect } from "react";
import { useSensorData } from "@/contexts/SensorDataContext";

function mapFresh(code) {
  switch ((code || "-").toUpperCase()) {
    case "SS": // Sangat Segar
      return {
        label: "Sangat Segar",
        badgeBg: "bg-emerald-100",
        titleColor: "text-emerald-800",
        valueColor: "text-emerald-900",
        preservation: "Aman",
        preservationBg: "bg-teal-100",
        preservationTitle: "text-teal-800",
        preservationValue: "text-teal-900",
      };
    case "S": // Segar
      return {
        label: "Segar",
        badgeBg: "bg-emerald-100",
        titleColor: "text-emerald-800",
        valueColor: "text-emerald-900",
        preservation: "Aman",
        preservationBg: "bg-teal-100",
        preservationTitle: "text-teal-800",
        preservationValue: "text-teal-900",
      };
    case "KS": // Kurang Segar
      return {
        label: "Kurang Segar",
        badgeBg: "bg-amber-100",
        titleColor: "text-amber-800",
        valueColor: "text-amber-900",
        preservation: "Wajib Es/Chiller",
        preservationBg: "bg-yellow-100",
        preservationTitle: "text-yellow-800",
        preservationValue: "text-yellow-900",
      };
    case "B": // Busuk
      return {
        label: "Tidak Segar",
        badgeBg: "bg-rose-100",
        titleColor: "text-rose-800",
        valueColor: "text-rose-900",
        preservation: "Buang / Olah Limbah",
        preservationBg: "bg-red-100",
        preservationTitle: "text-red-800",
        preservationValue: "text-red-900",
      };
    default:
      return {
        label: "Menunggu data…",
        badgeBg: "bg-gray-100",
        titleColor: "text-gray-700",
        valueColor: "text-gray-700",
        preservation: "—",
        preservationBg: "bg-gray-100",
        preservationTitle: "text-gray-700",
        preservationValue: "text-gray-700",
      };
  }
}

function formatDuration(ms) {
  if (ms < 0) ms = 0;
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  const pad = (num) => num.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

const Status = () => {
  const { data, mqttConnectedAt } = useSensorData();
  const m = useMemo(() => mapFresh(data.fresh), [data.fresh]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const durationMs = mqttConnectedAt ? now.getTime() - mqttConnectedAt.getTime() : 0;

  return (
    <section className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Kondisi</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 ${m.badgeBg} rounded-lg shadow text-center`}>
          <h3 className={`text-lg font-bold ${m.titleColor} mb-2`}>
            Status Kesegaran
          </h3>
          <p className={`text-2xl font-semibold ${m.valueColor}`}>{m.label}</p>
        </div>
        <div
          className={`p-6 ${m.preservationBg} rounded-lg shadow text-center`}
        >
          <h3 className={`text-lg font-bold ${m.preservationTitle} mb-2`}>
            Status Pengawetan
          </h3>
          <p className={`text-2xl font-semibold ${m.preservationValue}`}>—</p>
        </div>
        <div className="p-6 bg-sky-100 rounded-lg shadow text-center">
          <h3 className="text-lg font-bold text-sky-800 mb-2">
            Durasi Sistem
          </h3>
          <p className="text-2xl font-semibold text-sky-900 font-mono">
            {mqttConnectedAt ? formatDuration(durationMs) : "00:00:00"}
          </p>
          {!mqttConnectedAt && (
            <p className="text-xs text-sky-700 mt-1">Menunggu koneksi...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Status;
