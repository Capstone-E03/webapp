// src/app/riwayat/page.js

export default function RiwayatPage() {
  // Sample data for the table
  const historyData = [
    { time: "2023-10-27 10:30:00", freshness: "Segar", preservation: "Ya" },
    { time: "2023-10-27 09:15:00", freshness: "Segar", preservation: "Ya" },
    { time: "2023-10-26 18:00:00", freshness: "Kurang Segar", preservation: "Tidak" },
    { time: "2023-10-26 15:45:00", freshness: "Segar", preservation: "Ya" },
    { time: "2023-10-25 12:00:00", freshness: "Busuk", preservation: "Tidak" },
  ];

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs uppercase bg-gray-100 text-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold text-center">
                Waktu
              </th>
              <th scope="col" className="px-6 py-3 font-semibold text-center">
                Kesegaran
              </th>
              <th scope="col" className="px-6 py-3 font-semibold text-center">
                Pengawetan
              </th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((item, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-center">{item.time}</td>
                <td className="px-6 py-4 text-center">{item.freshness}</td>
                <td className="px-6 py-4 text-center">{item.preservation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}