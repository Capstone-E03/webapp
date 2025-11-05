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
        _id: item._id,
        timestamp: item.timestamp,
        freshnessResult: item.result,
        preservationResult: preservations[index]?.result || "??",
      };
    });

    return combinedData;

  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
}

function getFreshnessStyle(result) {
  const styleMap = {
    SS: {
      label: "Sangat Segar",
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      border: "border-emerald-300",
      icon: "✓"
    },
    S: {
      label: "Segar",
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
      icon: "✓"
    },
    KS: {
      label: "Kurang Segar",
      bg: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-300",
      icon: "⚠"
    },
    B: {
      label: "Busuk",
      bg: "bg-rose-100",
      text: "text-rose-800",
      border: "border-rose-300",
      icon: "✕"
    }
  };
  return styleMap[result] || { label: result, bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300", icon: "•" };
}

function getPreservationStyle(result) {
  const styleMap = {
    SB: {
      label: "Sangat Baik",
      bg: "bg-teal-100",
      text: "text-teal-800",
      border: "border-teal-300",
      icon: "✓"
    },
    B: {
      label: "Baik",
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-300",
      icon: "✓"
    },
    KB: {
      label: "Kurang Baik",
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-300",
      icon: "⚠"
    },
    BR: {
      label: "Buruk",
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-300",
      icon: "✕"
    }
  };
  return styleMap[result] || { label: result, bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300", icon: "•" };
}

function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const timeStr = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });
  return { dateStr, timeStr };
}

export default async function RiwayatPage() {
  const historyData = await getHistory();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Riwayat Klasifikasi</h1>
            <p className="text-sm text-blue-100 mt-1">
              Histori hasil analisis AI untuk kesegaran dan penyimpanan ikan
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards - Mobile Friendly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-blue-500 transition-colors">
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">Total Entries</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{historyData.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-emerald-500 transition-colors">
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">Segar (SS/S)</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            {historyData.filter(d => d.freshnessResult === "SS" || d.freshnessResult === "S").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-teal-500 transition-colors">
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">Penyimpanan Baik</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            {historyData.filter(d => d.preservationResult === "SB" || d.preservationResult === "B").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-purple-500 transition-colors">
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">Last Update</p>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-1">
            {historyData.length > 0 ? formatDateTime(historyData[0].timestamp).timeStr : "N/A"}
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Waktu
                </th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Kesegaran Ikan
                </th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Kondisi Penyimpanan
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {historyData.length > 0 ? (
                historyData.map((item) => {
                  const freshStyle = getFreshnessStyle(item.freshnessResult);
                  const presStyle = getPreservationStyle(item.preservationResult);
                  const { dateStr, timeStr } = formatDateTime(item.timestamp);

                  return (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{dateStr}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{timeStr}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${freshStyle.bg} ${freshStyle.text} ${freshStyle.border}`}>
                          <span>{freshStyle.icon}</span>
                          {freshStyle.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${presStyle.bg} ${presStyle.text} ${presStyle.border}`}>
                          <span>{presStyle.icon}</span>
                          {presStyle.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">Tidak ada data riwayat</p>
                      <p className="text-sm text-gray-400">Data akan muncul setelah sistem mulai merekam</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
          {historyData.length > 0 ? (
            historyData.map((item) => {
              const freshStyle = getFreshnessStyle(item.freshnessResult);
              const presStyle = getPreservationStyle(item.preservationResult);
              const { dateStr, timeStr } = formatDateTime(item.timestamp);

              return (
                <div key={item._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  {/* Timestamp */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{dateStr}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{timeStr}</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">Kesegaran:</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border-2 ${freshStyle.bg} ${freshStyle.text} ${freshStyle.border}`}>
                        <span>{freshStyle.icon}</span>
                        {freshStyle.label}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">Penyimpanan:</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border-2 ${presStyle.bg} ${presStyle.text} ${presStyle.border}`}>
                        <span>{presStyle.icon}</span>
                        {presStyle.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">Tidak ada data riwayat</p>
                <p className="text-sm text-gray-400">Data akan muncul setelah sistem mulai merekam</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}