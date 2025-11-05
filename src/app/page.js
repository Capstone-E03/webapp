import LiveData from "@/components/LiveData";
import Status from "@/components/Status";
import Connection from "@/components/Connection";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Connection Status */}
      <Connection />

      {/* AI Classification Section */}
      <Status />

      {/* Live Sensor Data Section */}
      <section className="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg transition-colors">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Data Sensor Real-time</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Menampilkan pembacaan sensor terkini dengan riwayat 10 titik data terakhir
          </p>
        </div>
        <LiveData />
      </section>
    </div>
  );
}
