"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function LiveData() {
  const [data, setData] = useState({ gas: "-", suhu: "-", ph: "-" });

  useEffect(() => {
    const socket = io("http://127.0.0.1:3001");

    socket.on("connect", () => {
      console.log("✅ Connected to backend via socket.io");
    });

    socket.on("sensorData", (msg) => {
        console.log("📩 Received:", msg);
        setData({
            gas: msg.message.gas ?? "-",
            suhu: msg.message.suhu ?? "-",
            ph: msg.message.ph ?? "-",
        });
    });


    return () => socket.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-gray-200 rounded-md text-center">
        <h3 className="text-lg font-bold text-gray-700 mb-2">Gas</h3>
        <p className="text-2xl font-semibold text-gray-700">{data.gas}</p>
      </div>
      <div className="p-6 bg-gray-200 rounded-md text-center">
        <h3 className="text-lg font-bold text-gray-700 mb-2">Suhu</h3>
        <p className="text-2xl font-semibold text-gray-700">{data.suhu}</p>
      </div>
      <div className="p-6 bg-gray-200 rounded-md text-center">
        <h3 className="text-lg font-bold text-gray-700 mb-2">pH</h3>
        <p className="text-2xl font-semibold text-gray-700">{data.ph}</p>
      </div>
    </div>
  );
}
