import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold">
          F
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">FinSight</h1>
          <p className="text-xs text-slate-500">Understand. Control. Grow.</p>
        </div>
      </Link>

      <Link
        to="/dashboard"
        className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-xl font-medium"
      >
        Buka Dashboard
      </Link>
    </nav>
  );
}

export default Navbar;