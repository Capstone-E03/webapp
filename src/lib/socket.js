// lib/socket.js
"use client";

import { io } from "socket.io-client";

let socket;

/** Buat / ambil singleton socket */
export function getSocket() {
  if (socket) return socket;

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://127.0.0.1:3001", {
    transports: ["websocket"],
    autoConnect: false,            // kita kontrol manual
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,        // 0.5s awal
    reconnectionDelayMax: 8000,    // max 8s
    randomizationFactor: 0.5,      // jitter
    timeout: 10000,                // 10s connect timeout
  });

  return socket;
}

/** Connect aman (idempotent) */
export function connectSocket() {
  const s = getSocket();
  if (!s.connected && !s.active) s.connect();
  return s;
}

/** Disconnect aman (idempotent) */
export function disconnectSocket() {
  if (!socket) return;
  if (socket.connected || socket.active) socket.disconnect();
}

/** Promise: tunggu sampai connect atau gagal dalam `ms` */
export function waitForConnect(ms = 5000) {
  return new Promise((resolve, reject) => {
    const s = connectSocket();

    if (s.connected) return resolve(true);

    const onConnect = () => {
      cleanup();
      resolve(true);
    };
    const onError = (err) => {
      // jangan reject langsung; biarkan timeout yang memutuskan
      // tetap kita log
      // console.warn("socket error", err);
    };

    s.once("connect", onConnect);
    s.once("connect_error", onError);

    const t = setTimeout(() => {
      cleanup();
      reject(new Error("Connect timeout"));
    }, ms);

    function cleanup() {
      clearTimeout(t);
      s.off("connect", onConnect);
      s.off("connect_error", onError);
    }
  });
}

/** Helpers status */
export const socketStatus = () => ({
  connected: !!socket?.connected,
  id: socket?.id ?? null,
});
