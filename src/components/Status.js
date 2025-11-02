"use client";

import { useMemo } from "react";
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

const Status = () => {
  const { data } = useSensorData();
  const m = useMemo(() => mapFresh(data.fresh), [data.fresh]);

  return (
    <section className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Kondisi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </section>
  );
};

export default Status;
