import LiveData from "@/components/LiveData";

export default function Home() {
  return (
    <>
      {/* Notifikasi Section */}
      <section className="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Notifikasi</h2>
        <div className="bg-gray-200 h-16 rounded-md"></div>
      </section>

      {/* Sensor Section */}
      <section className="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Sensor</h2>
        {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-200 h-32 rounded-md"></div>
          <div className="bg-gray-200 h-32 rounded-md"></div>
          <div className="bg-gray-200 h-32 rounded-md"></div>
        </div>*/}
        <LiveData/>
      </section>

      {/* Kondisi Section */}
      <section className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Kondisi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-200 h-40 rounded-md"></div>
          <div className="bg-gray-200 h-40 rounded-md"></div>
        </div>
      </section>
    </>
  );
}