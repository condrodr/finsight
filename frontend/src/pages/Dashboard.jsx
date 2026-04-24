// import { useEffect } from "react";
// import { getDashboard } from "../services/financeService";

// const Dashboard = () => {

//   const fetchDashboard = async () => {
//     try {
//       const res = await getDashboard(1);
//       console.log(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   return <h1>Dashboard FinSight</h1>;
// };

// export default Dashboard;
import Sidebar from "../components/Sidebar.jsx";
import StatCard from "../components/StatCard.jsx";
import HealthScoreCard from "../components/HealthScoreCard.jsx";

function Dashboard() {
  const dataDashboard = {
    totalPendapatan: 10000000,
    totalPengeluaran: 2825000,
    saldoAkhir: 7175000,
    skorKesehatan: 82,
    insight: [
      "Kondisi keuangan Anda berada dalam kategori sehat.",
      "Pengeluaran masih lebih rendah dari pemasukan.",
      "Tabungan dan investasi sudah cukup baik."
    ],
    warning: [
      "Tetap batasi pengeluaran konsumtif agar cash flow tetap positif."
    ]
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(angka);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <p className="text-sky-500 font-semibold">Dashboard</p>
          <h1 className="text-3xl font-bold text-slate-900">
            Ringkasan Keuangan
          </h1>
          <p className="text-slate-500 mt-2">
            Understand. Control. Grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            title="Total Pendapatan"
            value={formatRupiah(dataDashboard.totalPendapatan)}
            description="Total pemasukan periode ini"
          />

          <StatCard
            title="Total Pengeluaran"
            value={formatRupiah(dataDashboard.totalPengeluaran)}
            description="Total pengeluaran periode ini"
          />

          <StatCard
            title="Saldo Akhir"
            value={formatRupiah(dataDashboard.saldoAkhir)}
            description="Pendapatan dikurangi pengeluaran"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <HealthScoreCard score={dataDashboard.skorKesehatan} />

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Insight Otomatis
            </h2>

            <div className="mt-4 space-y-3">
              {dataDashboard.insight.map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-sky-50 text-slate-700">
                  {item}
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-8">
              Peringatan
            </h2>

            <div className="mt-4 space-y-3">
              {dataDashboard.warning.map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-yellow-50 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;