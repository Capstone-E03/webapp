// contexts/SensorDataContext.jsx
"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import { toast } from "react-hot-toast";

/** Bentuk state yang konsisten ke seluruh UI */
const defaultData = Object.freeze({
  gasAmonia: "-",
  gasMetana: "-",
  suhu: "-",
  humidity: "-",
  ph: "-",
});

const SensorDataContext = createContext({
  data: defaultData,
  lastMessageRaw: null,
  connected: false,
});

/** Normalisasi payload dari backend → state UI */
function normalize(msg) {
  // Terima dua kemungkinan bentuk: { message: {...} } atau flat {...}
  const p = msg?.message ?? msg ?? {};

  return {
    gasAmonia: p.mq135_ppm ?? p.gasAmonia ?? "-",
    gasMetana: p.mq2_ppm ?? p.gasMetana ?? "-",
    suhu: p.T ?? p.suhu ?? "-",
    humidity: p.RH ?? p.humidity ?? "-",
    ph: p.pH ?? p.ph ?? "-",
  };
}

export function SensorDataProvider({ children }) {
  const [data, setData] = useState(defaultData);
  const [connected, setConnected] = useState(false);
  const [lastMessageRaw, setLastMessageRaw] = useState(null);

  const connectedToastShown = useRef(false);

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      setConnected(true);
      if (!connectedToastShown.current) {
        toast.success("Sistem terhubung!");
        connectedToastShown.current = true;
      }
    };
    const onDisconnect = () => {
      setConnected(false);
      toast.error("Koneksi terputus.");
    };
    const onSensor = (msg) => {
      setLastMessageRaw(msg);
      setData((prev) => ({ ...prev, ...normalize(msg) }));
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("sensorData", onSensor);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("sensorData", onSensor);
    };
  }, []);

  const value = useMemo(() => ({ data, connected, lastMessageRaw }), [data, connected, lastMessageRaw]);

  return (
    <SensorDataContext.Provider value={value}>
      {children}
    </SensorDataContext.Provider>
  );
}

/** Hook konsumsi data sensor */
export function useSensorData() {
  return useContext(SensorDataContext);
}
