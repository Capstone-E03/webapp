// lib/socket.js
"use client";

import { io } from "socket.io-client";

let socket;

/** Pastikan hanya ada satu koneksi socket di seluruh app */
export function getSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://127.0.0.1:3001", {
      autoConnect: true,
      transports: ["websocket"],
    });
  }
  return socket;
}
