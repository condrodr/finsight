function StatCard({ title, value, description }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="text-2xl font-bold text-slate-900 mt-2">{value}</h2>
      <p className="text-sm text-slate-500 mt-2">{description}</p>
    </div>
  );
}

export default StatCard;