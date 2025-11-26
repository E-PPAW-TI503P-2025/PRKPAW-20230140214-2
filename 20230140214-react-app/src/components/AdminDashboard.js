import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [report, setReport] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3001/api/reports/daily", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setReport(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-8 relative overflow-hidden">

      <div className="absolute inset-0 opacity-40">
        <div className="w-[400px] h-[400px] bg-blue-500/30 blur-3xl rounded-full absolute -top-10 -left-10"></div>
        <div className="w-[450px] h-[450px] bg-purple-500/20 blur-3xl rounded-full absolute bottom-0 right-0"></div>
      </div>

      <header className="relative flex justify-between items-center mb-10 z-10">
        <h1 className="text-3xl font-bold tracking-wide">Admin Dashboard</h1>

        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition shadow-lg"
        >
          Logout
        </button>
      </header>

      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-2xl shadow-2xl z-10">

        <h2 className="text-2xl font-bold mb-6">Laporan Presensi Hari Ini</h2>

        <div className="overflow-x-auto">
          <table className="w-full bg-white/5 border border-white/20 rounded-lg">
            <thead>
              <tr className="text-left bg-white/10">
                <th className="p-4">Nama</th>
                <th className="p-4">Email</th>
                <th className="p-4">Check-In</th>
                <th className="p-4">Check-Out</th>
              </tr>
            </thead>

            <tbody>
              {report.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-400">
                    Tidak ada data presensi.
                  </td>
                </tr>
              ) : (
                report.map((item, index) => (
                  <tr key={index} className="border-t border-white/10 hover:bg-white/10 transition">
                    <td className="p-4">{item.nama}</td>
                    <td className="p-4">{item.email}</td>
                    <td className="p-4">{item.checkIn}</td>
                    <td className="p-4">{item.checkOut || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
