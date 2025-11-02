import LiveData from "@/components/LiveData";

export default function Home() {
  return (
    <>
      {/* Notifikasi Section */}
      {/* <section className="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Notifikasi</h2>
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg" role="alert">
          <p className="font-bold">Informasi</p>
          <p className="text-sm">Semua sistem berjalan normal.</p>
        </div>
      </section> */}

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
          {/* Placeholder Kondisi 1 - misal status kesegaran (Hijau Emerald) */}
          <div className="p-6 bg-emerald-100 rounded-lg shadow text-center">
            <h3 className="text-lg font-bold text-emerald-800 mb-2">Status Kesegaran</h3>
            <p className="text-2xl font-semibold text-emerald-900">Segar</p>
          </div>
          {/* Placeholder Kondisi 2 - misal rekomendasi (Hijau Teal) */}
          <div className="p-6 bg-teal-100 rounded-lg shadow text-center">
            <h3 className="text-lg font-bold text-teal-800 mb-2">Status Pengawetan</h3>
            <p className="text-2xl font-semibold text-teal-900">Aman</p>
          </div>
        </div>
      </section>
    </>
  );
}