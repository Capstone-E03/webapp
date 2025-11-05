// app/components/LiveData.jsx
"use client";

import { useSensorData } from "@/contexts/SensorDataContext";
import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from "recharts";

export default function LiveData() {
  const { data } = useSensorData();

  // Keep history of last 10 points for each metric
  const [history, setHistory] = useState({
    gasAmonia: [],
    gasMetana: [],
    suhu: [],
    humidity: [],
  });

  useEffect(() => {
    // Only update if we have valid numeric data
    const updateHistory = (key, value) => {
      if (value === "-" || value === null || value === undefined) return;
      const numValue = typeof value === "number" ? value : parseFloat(value);
      if (isNaN(numValue)) return;

      setHistory((prev) => {
        const newData = [...prev[key], numValue].slice(-10); // Keep last 10
        return { ...prev, [key]: newData };
      });
    };

    updateHistory("gasAmonia", data.gasAmonia);
    updateHistory("gasMetana", data.gasMetana);
    updateHistory("suhu", data.suhu);
    updateHistory("humidity", data.humidity);
  }, [data.gasAmonia, data.gasMetana, data.suhu, data.humidity]);

  // Format display value as integer, but keep decimal for chart
  const formatDisplay = (value) => {
    if (value === "-" || value === null || value === undefined) return "-";
    const num = typeof value === "number" ? value : parseFloat(value);
    return isNaN(num) ? "-" : Math.round(num);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          color="bg-gradient-to-br from-blue-50 to-blue-100"
          textColor="text-blue-800"
          valueColor="text-blue-900"
          title="Amonia (NH₃)"
          value={formatDisplay(data.gasAmonia)}
          unit="ppm"
          data={history.gasAmonia}
          lineColor="#3b82f6"
        />
        <MetricCard
          color="bg-gradient-to-br from-indigo-50 to-indigo-100"
          textColor="text-indigo-800"
          valueColor="text-indigo-900"
          title="Metana (CH₄)"
          value={formatDisplay(data.gasMetana)}
          unit="ppm"
          data={history.gasMetana}
          lineColor="#6366f1"
        />
        <MetricCard
          color="bg-gradient-to-br from-red-50 to-red-100"
          textColor="text-red-800"
          valueColor="text-red-900"
          title="Suhu"
          value={formatDisplay(data.suhu)}
          unit="°C"
          data={history.suhu}
          lineColor="#ef4444"
        />
        <MetricCard
          color="bg-gradient-to-br from-cyan-50 to-cyan-100"
          textColor="text-cyan-800"
          valueColor="text-cyan-900"
          title="Kelembaban"
          value={formatDisplay(data.humidity)}
          unit="%RH"
          data={history.humidity}
          lineColor="#06b6d4"
        />
      </div>
    </div>
  );
}

function MetricCard({ color, textColor, valueColor, title, value, unit, data, lineColor }) {
  // Transform data for chart (last 10 points)
  const chartData = data.map((val, idx) => ({ index: idx, value: val }));

  return (
    <div className={`${color} rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl border border-opacity-20`}>
      <div className="p-6">
        <h3 className={`text-sm font-semibold ${textColor} mb-2 uppercase tracking-wider`}>
          {title}
        </h3>
        <div className="flex items-baseline gap-2 mb-4">
          <p className={`text-4xl font-bold ${valueColor}`}>{value}</p>
          <span className={`text-lg ${textColor} font-medium`}>{unit}</span>
        </div>
        {chartData.length > 0 && (
          <div className="h-20 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                <XAxis dataKey="index" hide />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload || !payload[0]) return null;
                    return (
                      <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded shadow-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {payload[0].value.toFixed(2)} {unit}
                        </p>
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={lineColor}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
