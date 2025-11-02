// contexts/SensorDataContext.jsx
"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getSocket, connectSocket, disconnectSocket } from "@/lib/socket";
import { toast } from "react-hot-toast";

const defaultData = Object.freeze({
  gasAmonia: "-",
  gasMetana: "-",
  suhu: "-",
  humidity: "-",
  ph: "-",
  fresh: "-",      
  preservation: "-",
});

const Ctx = createContext({
  data: defaultData,
  connected: false,
  reconnecting: false,
  lastSeenAt: null,
  lastDisconnectReason: null,
  connectNow: () => {},
  disconnectNow: () => {},
});

function normalize(msg) {
  const p = msg?.message ?? msg ?? {};
  return {
    gasAmonia: p.mq135_ppm ?? p.gasAmonia ?? "-",
    gasMetana: p.mq2_ppm ?? p.gasMetana ?? "-",
    suhu: p.T ?? p.suhu ?? "-",
    humidity: p.RH ?? p.humidity ?? "-",
    ph: p.pH ?? p.ph ?? "-",
    fresh: p.fresh ?? "-",   
    preservation: p.preservation ?? "-",
  };
}

export function SensorDataProvider({ children }) {
  const [data, setData] = useState(defaultData);
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [lastSeenAt, setLastSeenAt] = useState(null);
  const [lastDisconnectReason, setLastDisconnectReason] = useState(null);

  const toastOnce = useRef({ up: false });

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      setConnected(true);
      setReconnecting(false);
      setLastDisconnectReason(null);
      if (!toastOnce.current.up) {
        toast.success("Sistem terhubung!");
        toastOnce.current.up = true;
      }
    };

    const onDisconnect = (reason) => {
      setConnected(false);
      setReconnecting(false);
      setLastDisconnectReason(reason || "unknown");
      setLastSeenAt(new Date());
      toast.error("Koneksi terputus.");
      toastOnce.current.up = false;
      // socket.io akan auto-reconnect; flag kita atur saat 'reconnect_attempt'
    };
    

    const onReconnectAttempt = () => setReconnecting(true);
    const onReconnect = () => setReconnecting(false);

    const onSensor = (msg) => {
      setData((prev) => ({
      ...prev,
      gasAmonia: msg?.message?.mq135_ppm ?? msg?.mq135_ppm ?? prev.gasAmonia,
      gasMetana: msg?.message?.mq2_ppm ?? msg?.mq2_ppm ?? prev.gasMetana,
      suhu: msg?.message?.T ?? msg?.T ?? prev.suhu,
      humidity: msg?.message?.RH ?? msg?.RH ?? prev.humidity,
      ph: msg?.message?.pH ?? msg?.pH ?? prev.ph,
      }));
      setLastSeenAt(new Date());
    };

    const onFreshness = (msg) => {
      setData((prev) => ({
      ...prev,
      fresh: msg?.fresh ?? msg?.message?.fresh ?? prev.fresh
      }));
      setLastSeenAt(new Date());
    };

    const onPreservation = (msg) => {
      setData((prev) => ({
      ...prev,
      preservation: msg?.preservation ?? msg?.message?.preservation ?? prev.preservation
      }));
      setLastSeenAt(new Date());
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("reconnect_attempt", onReconnectAttempt);
    socket.on("reconnect", onReconnect);
    socket.on("sensorData", onSensor);
    socket.on("freshness", onFreshness);
    socket.on("preservation", onPreservation);


    // Mulai koneksi awal:
    connectSocket();

    // Reaksi ke online/offline browser:
    const goOnline = () => connectSocket();
    const goOffline = () => {
      setReconnecting(false);
      // biarkan socket yg memutus / handle sendiri; info UI cukup
    };
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("reconnect_attempt", onReconnectAttempt);
      socket.off("reconnect", onReconnect);
      socket.off("sensorData", onSensor);
      socket.off("freshness", onFreshness);
      socket.off("preservation", onPreservation);
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      // jangan disconnect di unmount provider (biasanya provider hidup sepanjang app)
    };
  }, []);

  const connectNow = () => connectSocket();
  const disconnectNow = () => {
    setReconnecting(false);
    disconnectSocket();
  };

  const value = useMemo(
    () => ({
      data,
      connected,
      reconnecting,
      lastSeenAt,
      lastDisconnectReason,
      connectNow,
      disconnectNow,
    }),
    [data, connected, reconnecting, lastSeenAt, lastDisconnectReason]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSensorData() {
  return useContext(Ctx);
}
