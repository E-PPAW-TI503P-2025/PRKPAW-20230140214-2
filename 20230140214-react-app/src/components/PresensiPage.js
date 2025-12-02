import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function AttendancePage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const token = localStorage.getItem("token");

  // ======================
  // GET USER LOCATION
  // ======================
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Browser tidak mendukung geolocation.");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoadingLocation(false);
      },
      (err) => {
        setError("Harap aktifkan GPS Anda: " + err.message);
        setLoadingLocation(false);
      }
    );
  }, []);

  // ======================
  // HANDLE CHECK-IN
  // ======================
  const handleCheckIn = async () => {
    setMessage("");
    setError("");

    if (!coords) {
      setError("Lokasi belum ditemukan. Nyalakan GPS.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message || "Check-in berhasil!");
    } catch (err) {
      setError(err.response?.data?.message || "Check-in gagal!");
    }
  };

  // ======================
  // HANDLE CHECK-OUT
  // ======================
  const handleCheckOut = async () => {
    setMessage("");
    setError("");

    if (!coords) {
      setError("Lokasi belum ditemukan. Nyalakan GPS.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message || "Check-out berhasil!");
    } catch (err) {
      setError(err.response?.data?.message || "Check-out gagal!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">

        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Lakukan Presensi
        </h2>

        {loadingLocation && <p className="text-gray-700 mb-4">Mengambil lokasi…</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {message && <p className="text-green-600 mb-4">{message}</p>}

        {/* MAP */}
        {coords && (
          <div className="mb-4 border rounded overflow-hidden">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={16}
              style={{ height: "250px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Lokasi Anda</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

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
