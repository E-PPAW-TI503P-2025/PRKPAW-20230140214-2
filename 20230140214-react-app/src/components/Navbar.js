import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Ambil token & role user dari localStorage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); 
  const nama = localStorage.getItem("nama");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nama");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">

      <div className="text-xl font-bold">
        <Link to="/">🚀 PAW App</Link>
      </div>

      <div className="flex items-center space-x-6">

        {/* === Jika belum login === */}
        {!token && (
          <>
            <Link to="/login" className="hover:text-green-400">Login</Link>
            <Link to="/register" className="hover:text-green-400">Register</Link>
          </>
        )}

        {/* === Jika sudah login === */}
        {token && (
          <>
            <Link to="/dashboard" className="hover:text-green-400">Dashboard</Link>

            {/* Semua user bisa presensi */}
            <Link to="/presensi" className="hover:text-green-400">Presensi</Link>

            <Link to="/monitoring" className="...">Monitoring Suhu</Link>

            {/* Khusus admin */}
            {role === "admin" && (
              <Link to="/reports" className="hover:text-green-400">Laporan</Link>
            )}

            {/* Nama user */}
            <span className="text-gray-300">Hi, {nama || "User"}</span>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>

    </nav>
  );
}

export default Navbar;
