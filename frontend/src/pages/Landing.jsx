import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-6xl mx-auto px-8 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sky-500 font-semibold mb-4">
            Sistem Keuangan Pribadi Berbasis Web
          </p>

          <h1 className="text-5xl font-bold text-slate-900 leading-tight">
            Know Your Habits. Master Your Money.
          </h1>

          <p className="text-lg text-slate-600 mt-6">
            FinSight membantu pengguna mencatat transaksi, mengevaluasi
            kesehatan finansial, dan memahami pola perilaku konsumtif.
          </p>

          <p className="text-slate-500 mt-4">
            Masalah keuangan bukan cuma angka, tapi perilaku — dan platform ini
            membantu memperbaikinya.
          </p>

          <div className="flex gap-4 mt-8">
            <Link
              to="/dashboard"
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Mulai Sekarang
            </Link>

            <a
              href="#fitur"
              className="border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold"
            >
              Lihat Fitur
            </a>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Understand. Control. Grow.
          </h2>

          <div className="mt-8 space-y-4">
            <div className="p-4 rounded-2xl bg-sky-50">
              <p className="font-semibold text-slate-900">
                Financial Health Score
              </p>
              <p className="text-sm text-slate-500">
                Evaluasi kondisi keuangan dengan skor 0–100.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-green-50">
              <p className="font-semibold text-slate-900">Insight Otomatis</p>
              <p className="text-sm text-slate-500">
                Pahami pola pengeluaran tanpa membaca angka mentah.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-yellow-50">
              <p className="font-semibold text-slate-900">Warning System</p>
              <p className="text-sm text-slate-500">
                Dapatkan peringatan jika kondisi finansial mulai berisiko.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="max-w-6xl mx-auto px-8 pb-24">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">
          Fitur Utama FinSight
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900">Pencatatan Transaksi</h3>
            <p className="text-slate-500 mt-2">
              Catat pemasukan dan pengeluaran harian secara terstruktur.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900">
              Evaluasi Kesehatan Finansial
            </h3>
            <p className="text-slate-500 mt-2">
              Analisis saving ratio, expense ratio, cash flow, dan konsumtif.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900">
              Rekomendasi Penghematan
            </h3>
            <p className="text-slate-500 mt-2">
              Dapatkan saran sederhana untuk memperbaiki kondisi keuangan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;