"use client";

import { useMemo, useState, useEffect } from "react";
import { useSensorData } from "@/contexts/SensorDataContext";

function mapFresh(code) {
  switch ((code || "-").toUpperCase()) {
    case "SS": // Sangat Segar
      return {
        label: "Sangat Segar",
        badgeBg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
        borderColor: "border-emerald-300",
        titleColor: "text-emerald-800",
        valueColor: "text-emerald-900",
        icon: "✓",
      };
    case "S": // Segar
      return {
        label: "Segar",
        badgeBg: "bg-gradient-to-br from-green-50 to-green-100",
        borderColor: "border-green-300",
        titleColor: "text-green-800",
        valueColor: "text-green-900",
        icon: "✓",
      };
    case "KS": // Kurang Segar
      return {
        label: "Kurang Segar",
        badgeBg: "bg-gradient-to-br from-amber-50 to-amber-100",
        borderColor: "border-amber-300",
        titleColor: "text-amber-800",
        valueColor: "text-amber-900",
        icon: "⚠",
      };
    case "B": // Busuk
      return {
        label: "Tidak Segar",
        badgeBg: "bg-gradient-to-br from-rose-50 to-rose-100",
        borderColor: "border-rose-300",
        titleColor: "text-rose-800",
        valueColor: "text-rose-900",
        icon: "✕",
      };
    default:
      return {
        label: "Menunggu data…",
        badgeBg: "bg-gradient-to-br from-gray-50 to-gray-100",
        borderColor: "border-gray-300",
        titleColor: "text-gray-700",
        valueColor: "text-gray-700",
        icon: "•",
      };
  }
}

function mapPreservation(code) {
  switch ((code || "-").toUpperCase()) {
    case "SB": // Sangat Baik
      return {
        label: "Sangat Baik",
        badgeBg: "bg-gradient-to-br from-teal-50 to-teal-100",
        borderColor: "border-teal-300",
        titleColor: "text-teal-800",
        valueColor: "text-teal-900",
        icon: "✓",
      };
    case "B": // Baik
      return {
        label: "Baik",
        badgeBg: "bg-gradient-to-br from-blue-50 to-blue-100",
        borderColor: "border-blue-300",
        titleColor: "text-blue-800",
        valueColor: "text-blue-900",
        icon: "✓",
      };
    case "KB": // Kurang Baik
      return {
        label: "Kurang Baik",
        badgeBg: "bg-gradient-to-br from-orange-50 to-orange-100",
        borderColor: "border-orange-300",
        titleColor: "text-orange-800",
        valueColor: "text-orange-900",
        icon: "⚠",
      };
    case "BR": // Buruk
      return {
        label: "Buruk",
        badgeBg: "bg-gradient-to-br from-red-50 to-red-100",
        borderColor: "border-red-300",
        titleColor: "text-red-800",
        valueColor: "text-red-900",
        icon: "✕",
      };
    default:
      return {
        label: "Menunggu data…",
        badgeBg: "bg-gradient-to-br from-gray-50 to-gray-100",
        borderColor: "border-gray-300",
        titleColor: "text-gray-700",
        valueColor: "text-gray-700",
        icon: "•",
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
  const freshMap = useMemo(() => mapFresh(data.fresh), [data.fresh]);
  const preservationMap = useMemo(() => mapPreservation(data.preservation), [data.preservation]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const durationMs = mqttConnectedAt ? now.getTime() - mqttConnectedAt.getTime() : 0;

  return (
    <section className="p-8 bg-white border border-gray-200 rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Klasifikasi AI</h2>
        <p className="text-sm text-gray-600">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full font-medium text-xs border border-purple-200">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
            </svg>
            AI Decision Support (Fuzzy Logic on STM32)
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Freshness Card */}
        <div className={`${freshMap.badgeBg} border-2 ${freshMap.borderColor} rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-bold ${freshMap.titleColor} uppercase tracking-wider`}>
                Kesegaran Ikan
              </h3>
              <span className={`text-2xl ${freshMap.valueColor}`}>{freshMap.icon}</span>
            </div>
            <p className={`text-3xl font-bold ${freshMap.valueColor} mb-2`}>{freshMap.label}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className={`px-2 py-1 ${freshMap.titleColor} bg-white bg-opacity-60 rounded font-medium`}>
                MQ135 + MQ2
              </span>
            </div>
          </div>
        </div>

        {/* Preservation Card */}
        <div className={`${preservationMap.badgeBg} border-2 ${preservationMap.borderColor} rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-bold ${preservationMap.titleColor} uppercase tracking-wider`}>
                Kondisi Penyimpanan
              </h3>
              <span className={`text-2xl ${preservationMap.valueColor}`}>{preservationMap.icon}</span>
            </div>
            <p className={`text-3xl font-bold ${preservationMap.valueColor} mb-2`}>{preservationMap.label}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className={`px-2 py-1 ${preservationMap.titleColor} bg-white bg-opacity-60 rounded font-medium`}>
                Temp + Humidity
              </span>
            </div>
          </div>
        </div>

        {/* System Duration Card */}
        <div className="bg-gradient-to-br from-sky-50 to-sky-100 border-2 border-sky-300 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-sky-800 uppercase tracking-wider">
                Durasi Monitoring
              </h3>
              <span className="text-2xl text-sky-900">⏱</span>
            </div>
            <p className="text-3xl font-bold text-sky-900 font-mono mb-2">
              {mqttConnectedAt ? formatDuration(durationMs) : "00:00:00"}
            </p>
            {!mqttConnectedAt && (
              <p className="text-xs text-sky-700 mt-1 bg-white bg-opacity-60 px-2 py-1 rounded inline-block">
                Menunggu koneksi MQTT...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* AI Info Footer */}
      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-purple-900 mb-1">Tentang Klasifikasi</h4>
            <p className="text-xs text-purple-800 leading-relaxed">
              Sistem menggunakan <strong>Fuzzy Logic</strong> yang berjalan di mikrokontroler STM32.
              <strong> Kesegaran</strong> dihitung dari kadar gas (NH₃ & CH₄).
              <strong> Penyimpanan</strong> dievaluasi dari suhu dan kelembaban lingkungan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Status;
