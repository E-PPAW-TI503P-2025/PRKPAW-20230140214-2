import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Camera } from "react-camera-pro";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function AttendancePage() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

  const cameraRef = useRef(null);
  const token = localStorage.getItem("token");

  // GET LOCATION
  useEffect(() => {
    console.log("MINTA GEOLOCATION...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => setError("Gagal mendapatkan lokasi: " + err.message)
    );
  }, []);

  // HANDLE CHECK-IN WITH PHOTO
  const handleCheckIn = async () => {
    if (!coords || !image) {
      setError("Lokasi + Foto wajib ada!");
      return;
    }

    try {
      const blob = await (await fetch(image)).blob();
      const formData = new FormData();

      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", blob, "selfie.jpg");

      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message);
    } catch (err) {
      setError("Check-in gagal!");
    }
  };

  // HANDLE CHECK-OUT
  const handleCheckOut = async () => {
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

      setMessage(res.data.message);
    } catch (err) {
      setError("Check-out gagal!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">

        <h1 className="text-2xl font-bold mb-4">Presensi Lokasi</h1>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* MAP */}
        {coords && (
          <div className="mb-4 border rounded overflow-hidden">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={16}
              style={{ height: "250px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker icon={markerIcon} position={[coords.lat, coords.lng]}>
                <Popup>Lokasi Anda</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* CAMERA */}
        <div className="border rounded-lg overflow-hidden bg-black mb-4">
          {!image ? (
            <Camera ref={cameraRef} facingMode="user" aspectRatio={16 / 9} />
          ) : (
            <img src={image} alt="Selfie" className="w-full" />
          )}
        </div>

        <div className="mb-4">
          {!image ? (
            <button
              className="w-full bg-blue-600 text-white py-2 rounded"
              onClick={() => setImage(cameraRef.current.takePhoto())}
            >
              Ambil Foto 📸
            </button>
          ) : (
            <button
              className="w-full bg-gray-600 text-white py-2 rounded"
              onClick={() => setImage(null)}
            >
              Foto Ulang 🔄
            </button>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            className="flex-1 bg-green-600 text-white py-2 rounded"
            onClick={handleCheckIn}
          >
            Check-In
          </button>

          <button
            className="flex-1 bg-red-600 text-white py-2 rounded"
            onClick={handleCheckOut}
          >
            Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;
