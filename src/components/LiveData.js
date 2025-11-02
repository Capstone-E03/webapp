"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

export default function LiveData() {
  const [data, setData] = useState({ gas: "-", suhu: "-", ph: "-" });

  useEffect(() => {
    const socket = io("http://127.0.0.1:3001");

    socket.on("connect", () => {
      console.log("✅ Connected to backend via socket.io");
      toast.success("Sistem terhubung!");
    });

    socket.on("sensorData", (msg) => {
        console.log("📩 Received:", msg);
        setData({
            gas: "-",
            suhu: msg.message.temp ?? "-",       
            ph: "-",
            humidity: msg.message.humidity ?? "-",
            gas2: "-"
        });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <div className="p-6 bg-blue-100 rounded-md text-center">
        <h3 className="text-lg font-bold text-gray-700 mb-2">Gas</h3>
        <p className="text-2xl font-semibold text-gray-700">{data.gas}</p>
      </div>
      <div className="p-6 bg-indigo-100 rounded-md text-center">
        <h3 className="text-lg font-bold text-gray-700 mb-2">Gas</h3>
        <p className="text-2xl font-semibold text-gray-700">{data.gas2}</p>
      </div>
      <div className="p-6 bg-red-100 rounded-md text-center">
        <h3 className="text-lg font-bold text-gray-700 mb-2">Suhu</h3>
        <p className="text-2xl font-semibold text-gray-700">{data.suhu}</p>
      </div>
      <div className="p-6 bg-orange-100 rounded-md text-center">
        <h3 className="text-lg font-bold text-gray-700 mb-2">Kelembaban</h3>
        <p className="text-2xl font-semibold text-gray-700">{data.humidity}</p>
      </div>
      <div className="p-6 bg-yellow-100 rounded-md text-center">
        <h3 className="text-lg font-bold text-gray-700 mb-2">pH</h3>
        <p className="text-2xl font-semibold text-gray-700">{data.ph}</p>
      </div>
    </div>
  );
}
