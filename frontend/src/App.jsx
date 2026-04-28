import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Transaksi from "./pages/Transaksi.jsx";
import Laporan from "./pages/Laporan.jsx";
import Insight from "./pages/Insight.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transaksi" element={<ProtectedRoute><Transaksi /></ProtectedRoute>} />
        <Route path="/laporan" element={<ProtectedRoute><Laporan /></ProtectedRoute>} />
        <Route path="/insight" element={<ProtectedRoute><Insight /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
