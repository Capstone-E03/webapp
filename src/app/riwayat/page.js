async function getHistory() {
  try {
    // Fetch both datasets in parallel
    const [classRes, presRes] = await Promise.all([
      fetch("http://localhost:3001/api/classifications", { cache: "no-store" }),
      fetch("http://localhost:3001/api/preservations", { cache: "no-store" })
    ]);

    if (!classRes.ok) throw new Error("Failed to fetch classifications");
    if (!presRes.ok) throw new Error("Failed to fetch preservations");

    const classifications = await classRes.json();
    const preservations = await presRes.json();

    const combinedData = classifications.map((item, index) => {
      return {
        _id: item._id, // Use classification's ID as the key
        timestamp: item.timestamp,
        freshnessResult: item.result,
        // Get the matching preservation result. Use '?.' for safety.
        preservationResult: preservations[index]?.result || "??", // Show '??' if no matching data
      };
    });

    return combinedData;

  } catch (error) {
    console.error("Error fetching history:", error);
    return []; // Return an empty array on error
  }
}

function mapFreshness(result) {
  const freshnessMap = {
    KS: "Kurang Segar",
    SS: "Sangat Segar",
    S: "Segar",
    B: "Busuk",
  };
  return freshnessMap[result] || result;
}

function mapPreservation(result) {
  const preservationMap = {
    BR: "Buruk",
    KB: "Kurang Baik",
    B: "Baik",
    SB: "Sangat Baik",
  };
  return preservationMap[result] || result;
}

export default async function RiwayatPage() {
  // Sample data for the table
  const historyData = await getHistory();

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
            {historyData.length > 0 ? (
              historyData.map((item) => (
                <tr
                  key={item._id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-center">
                    {/* Column 1: Waktu */}
                    {new Date(item.timestamp).toLocaleString("id-ID", {
                      dateStyle: "long",
                      timeStyle: "medium",
                    })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* Column 2: Kesegaran */}
                    {mapFreshness(item.freshnessResult)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* Column 3: Pengawetan */}
                    {mapPreservation(item.preservationResult)}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b">
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data riwayat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}