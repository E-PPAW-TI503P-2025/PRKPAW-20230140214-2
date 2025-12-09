import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // Modal Foto
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const navigate = useNavigate();

  const fetchReports = async (query = "") => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/api/reports/daily${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReports(response.data.data);
      setError(null);

    } catch (err) {
      setReports([]);
      setError(
        err.response ? err.response.data.message : "Gagal mengambil data"
      );
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    let params = [];
    if (searchTerm) params.push(`nama=${searchTerm}`);

    const queryString = params.length > 0 ? `?${params.join("&")}` : "";
    fetchReports(queryString);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);

  const currentData = reports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Laporan Presensi Harian
      </h1>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Cari
        </button>
      </form>

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">
          {error}
        </p>
      )}

      {/* Tabel */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Nama</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Check-In</th>
              <th className="px-4 py-3 text-left font-semibold">Check-Out</th>
              <th className="px-4 py-3 text-left font-semibold">Latitude</th>
              <th className="px-4 py-3 text-left font-semibold">Longitude</th>
              <th className="px-4 py-3 text-left font-semibold">Bukti Foto</th>
            </tr>
          </thead>

          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-3">{item.nama}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.checkIn}</td>
                  <td className="px-4 py-3">
                    {item.checkOut || "Belum Check-Out"}
                  </td>
                  <td className="px-4 py-3">{item.latitude}</td>
                  <td className="px-4 py-3">{item.longitude}</td>

                  {/* Thumbnail Foto */}
                  <td className="px-4 py-3">
                    {item.buktiFoto ? (
                      <img
                        src={`http://localhost:3001/${item.buktiFoto}`}
                        alt="bukti"
                        className="w-16 h-16 object-cover rounded cursor-pointer hover:scale-105 transition"
                        onClick={() => {
                          setSelectedImage(
                            `http://localhost:3001/${item.buktiFoto}`
                          );
                          setShowModal(true);
                        }}
                      />
                    ) : (
                      <span className="text-gray-400">Tidak ada foto</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                  Tidak ada data presensi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => goToPage(currentPage - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === idx + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* MAP CARD SECTION */}
      <div className="space-y-6 mt-8">
        {currentData.map((item, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">
              Detail Lokasi Presensi — {item.nama}
            </h2>

            {/* Lokasi Check-In */}
            <div>
              <h3 className="font-semibold mb-2">Lokasi Check-In</h3>

              <MapContainer
                center={[item.latitude, item.longitude]}
                zoom={16}
                style={{ height: "250px", width: "100%" }}
                className="rounded-md overflow-hidden"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[item.latitude, item.longitude]}>
                  <Popup>Lokasi Check-In</Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Lokasi Check-Out jika ada */}
            {item.checkOutLatitude && item.checkOutLongitude && (
              <div>
                <h3 className="font-semibold mt-4 mb-2">Lokasi Check-Out</h3>

                <MapContainer
                  center={[item.checkOutLatitude, item.checkOutLongitude]}
                  zoom={16}
                  style={{ height: "250px", width: "100%" }}
                  className="rounded-md overflow-hidden"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={[
                      item.checkOutLatitude,
                      item.checkOutLongitude,
                    ]}
                  >
                    <Popup>Lokasi Check-Out</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL FOTO */}
      {showModal && (
  <div
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]"
    onClick={() => setShowModal(false)}
  >
    <img
      src={selectedImage}
      alt="full"
      className="max-w-3xl max-h-[90vh] rounded-lg shadow-lg z-[10000]"
    />
  </div>
)}

    </div>
  );
}

export default ReportPage;
