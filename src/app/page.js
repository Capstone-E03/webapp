import LiveData from "@/components/LiveData";
import Status from "@/components/Status";
import Connection from "@/components/Connection";

export default function Home() {
  return (
    <>
      {/* Status Section */}
      <Connection />

      {/* Sensor Section */}
      <section className="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Sensor</h2>
        <LiveData />
      </section>

      {/* Kondisi Section (placeholder) */}
      <Status />
    </>
  );
}
