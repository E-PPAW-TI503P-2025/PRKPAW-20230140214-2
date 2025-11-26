import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    checkedOut: 0,
    notCheckedOut: 0,
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const fetchDailyReport = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:3001/api/reports/daily",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data.data || [];
        setReports(data);

        const total = data.length;
        const checkedOut = data.filter((item) => item.checkOut).length;
        const notCheckedOut = total - checkedOut;

        setStats({ total, checkedOut, notCheckedOut });
      } catch (err) {
        console.error("Gagal ambil laporan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyReport();
  }, [navigate]);

  const percentage = (part, total) =>
    total === 0 ? 0 : Math.round((part / total) * 100);

  const checkedOutPercent = percentage(stats.checkedOut, stats.total);
  const notCheckedOutPercent = percentage(stats.notCheckedOut, stats.total);

  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const recentReports = reports.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-8 relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="w-[400px] h-[400px] bg-blue-500/30 blur-3xl rounded-full absolute -top-10 -left-10" />
        <div className="w-[450px] h-[450px] bg-purple-500/20 blur-3xl rounded-full absolute bottom-0 right-0" />
      </div>

      {/* Header */}
      <header className="relative flex justify-between items-center mb-10 z-10">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Admin Dashboard</h1>
          <p className="text-sm text-gray-300 mt-1">
            Ringkasan presensi mahasiswa • {today}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition shadow-lg"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 space-y-8">
        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
            <p className="text-sm text-gray-300 mb-1">Total Hadir Hari Ini</p>
            <p className="text-4xl font-extrabold text-blue-400">
              {stats.total}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Jumlah mahasiswa yang melakukan check-in.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
            <p className="text-sm text-gray-300 mb-1">Sudah Check-Out</p>
            <p className="text-4xl font-extrabold text-emerald-400">
              {stats.checkedOut}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {checkedOutPercent}% dari yang hadir sudah menyelesaikan presensi.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
            <p className="text-sm text-gray-300 mb-1">Belum Check-Out</p>
            <p className="text-4xl font-extrabold text-amber-400">
              {stats.notCheckedOut}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Mahasiswa yang masih tercatat di dalam kampus.
            </p>
          </div>
        </section>

        {/* Progress / Ratio Section */}
        <section className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-3">
            Rasio Check-Out Hari Ini
          </h2>
          <p className="text-sm text-gray-300 mb-4">
            Gambaran perbandingan antara mahasiswa yang sudah dan belum
            melakukan check-out.
          </p>

          <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
            <div
              className="h-4 bg-emerald-400"
              style={{ width: `${checkedOutPercent}%` }}
            />
            <div
              className="h-4 bg-amber-400 -mt-4"
              style={{ width: `${notCheckedOutPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-300 mt-2">
            <span>{checkedOutPercent}% sudah check-out</span>
            <span>{notCheckedOutPercent}% belum check-out</span>
          </div>
        </section>

        {/* Quick Actions + Recent */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1 bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Aksi Cepat</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/reports")}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-semibold shadow"
              >
                📄 Buka Laporan Lengkap
              </button>
              <button
                onClick={() => navigate("/presensi")}
                className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-sm font-semibold shadow"
              >
                🕒 Kelola Presensi
              </button>
              <button
                disabled
                className="w-full py-2 rounded-lg bg-white/10 text-gray-400 text-sm font-semibold border border-white/20 cursor-not-allowed"
              >
                ⚙️ Manajemen User (Coming Soon)
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              Aktivitas Presensi Terbaru
            </h2>

            {loading ? (
              <p className="text-gray-300 text-sm">Memuat data...</p>
            ) : recentReports.length === 0 ? (
              <p className="text-gray-400 text-sm">
                Belum ada presensi yang tercatat hari ini.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-300 border-b border-white/10">
                      <th className="py-2 pr-4">Nama</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Check-In</th>
                      <th className="py-2 pr-4">Check-Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-white/5 last:border-b-0"
                      >
                        <td className="py-2 pr-4">{item.nama}</td>
                        <td className="py-2 pr-4 text-gray-300">
                          {item.email}
                        </td>
                        <td className="py-2 pr-4 text-gray-300">
                          {item.checkIn}
                        </td>
                        <td className="py-2 pr-4 text-gray-300">
                          {item.checkOut || "Belum Check-Out"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
