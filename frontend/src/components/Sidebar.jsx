import { LayoutDashboard, ReceiptText, BarChart3, Lightbulb } from "lucide-react";

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-10">
        <div className="w-12 h-12 rounded-2xl bg-sky-400 flex items-center justify-center text-slate-900 font-bold text-xl">
          F
        </div>
        <h1 className="text-2xl font-bold mt-4">FinSight</h1>
        <p className="text-sm text-slate-400 mt-1">
          Know Your Habits. Master Your Money.
        </p>
      </div>

      <nav className="space-y-3">
        <a className="flex items-center gap-3 bg-sky-500 text-white px-4 py-3 rounded-xl">
          <LayoutDashboard size={20} />
          Dashboard
        </a>

        <a className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 px-4 py-3 rounded-xl">
          <ReceiptText size={20} />
          Transaksi
        </a>

        <a className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 px-4 py-3 rounded-xl">
          <BarChart3 size={20} />
          Laporan
        </a>

        <a className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 px-4 py-3 rounded-xl">
          <Lightbulb size={20} />
          Insight
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;