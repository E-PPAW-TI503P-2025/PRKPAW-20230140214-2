import React from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-8 relative overflow-hidden">

      <div className="absolute inset-0 opacity-40">
        <div className="w-[450px] h-[450px] bg-pink-500/20 blur-3xl rounded-full absolute -top-10 -left-10"></div>
        <div className="w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full absolute bottom-0 right-0"></div>
      </div>

      <header className="relative flex justify-between items-center mb-10 z-10">
        <h1 className="text-3xl font-bold tracking-wide">Mahasiswa Dashboard</h1>

        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition shadow-lg"
        >
          Logout
        </button>
      </header>

      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-2xl shadow-2xl z-10">

        <h2 className="text-4xl font-extrabold mb-6 text-center">
          Selamat Datang 👋
        </h2>

        <p className="text-lg text-center text-gray-300 mb-10">
          Ini adalah dashboard mahasiswa. Silakan melakukan presensi atau melihat status akunmu.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <div className="bg-white/10 p-6 rounded-xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition">
            <h3 className="text-xl font-semibold mb-2">Status Akun</h3>
            <p className="text-gray-300">Aktif ✓</p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition">
            <h3 className="text-xl font-semibold mb-2">Role</h3>
            <p className="text-gray-300">Mahasiswa</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
