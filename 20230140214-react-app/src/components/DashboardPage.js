import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-[500px] h-[500px] bg-purple-600/30 blur-3xl rounded-full absolute top-10 left-10"></div>
        <div className="w-[450px] h-[450px] bg-blue-500/20 blur-3xl rounded-full absolute bottom-10 right-10"></div>
      </div>

      {/* Header */}
      <header className="relative flex justify-between items-center mb-10 z-10">
        <h1 className="text-3xl font-bold tracking-wide">Dashboard</h1>

        <button
          onClick={handleLogout}
          className="px-5 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 transition shadow-md"
        >
          Logout
        </button>
      </header>

      {/* Main Card */}
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-2xl shadow-xl max-w-4xl mx-auto z-10">

        <h2 className="text-4xl font-extrabold mb-4 text-center">
          Selamat Datang! 👋
        </h2>

        <p className="text-center text-gray-300 mb-10 text-lg">
          Kamu berhasil login. Ini adalah dashboard futuristikmu.
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-white/10 border border-white/20 p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2">Status Akun</h3>
            <p className="text-gray-300">Aktif ✓</p>
          </div>

          <div className="bg-white/10 border border-white/20 p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2">Role</h3>
            <p className="text-gray-300">Mahasiswa/Admin</p>
          </div>

          <div className="bg-white/10 border border-white/20 p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2">Last Login</h3>
            <p className="text-gray-300">Baru saja</p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default DashboardPage;
