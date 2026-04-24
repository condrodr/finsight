function HealthScoreCard({ score }) {
  let status = "Tidak Sehat";
  let color = "text-red-500";

  if (score >= 80) {
    status = "Sehat";
    color = "text-green-500";
  } else if (score >= 60) {
    status = "Cukup Sehat";
    color = "text-sky-500";
  } else if (score >= 40) {
    status = "Kurang Sehat";
    color = "text-yellow-500";
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-slate-500">Financial Health Score</p>

      <div className="flex items-end gap-2 mt-3">
        <h2 className="text-5xl font-bold text-slate-900">{score}</h2>
        <span className="text-slate-500 mb-2">/100</span>
      </div>

      <p className={`font-semibold mt-4 ${color}`}>{status}</p>

      <div className="w-full h-3 bg-slate-100 rounded-full mt-4">
        <div
          className="h-3 rounded-full bg-sky-500"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default HealthScoreCard;