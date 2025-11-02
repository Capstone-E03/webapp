// app/components/LiveData.jsx
"use client";

import { useSensorData } from "@/contexts/SensorDataContext";

export default function LiveData() {
  const { data, connected } = useSensorData();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card color="bg-blue-100" title="Amonia" value={data.gasAmonia} />
        <Card color="bg-indigo-100" title="Gas Metana" value={data.gasMetana} />
        <Card color="bg-red-100" title="Suhu" value={data.suhu} />
        <Card color="bg-orange-100" title="Kelembaban" value={data.humidity} />
        <Card color="bg-yellow-100" title="pH" value={data.ph} />
      </div>
    </div>
  );
}

function Card({ color, title, value }) {
  return (
    <div className={`p-6 ${color} rounded-md text-center`}>
      <h3 className="text-lg font-bold text-gray-700 mb-2">{title}</h3>
      <p className="text-2xl font-semibold text-gray-700">{value}</p>
    </div>
  );
}
