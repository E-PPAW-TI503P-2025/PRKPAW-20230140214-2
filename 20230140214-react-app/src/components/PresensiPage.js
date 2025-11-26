import React, { useState } from "react";
import axios from "axios";

function AttendancePage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleCheckIn = async () => {
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.msg || "Check-in berhasil!");
    } catch (err) {
      setError(err.response ? err.response.data.msg : "Check-in gagal!");
    }
  };

  const handleCheckOut = async () => {
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.msg || "Check-out berhasil!");
    } catch (err) {
      setError(err.response ? err.response.data.msg : "Check-out gagal!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Lakukan Presensi
        </h2>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700"
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700"
          >
            Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;
