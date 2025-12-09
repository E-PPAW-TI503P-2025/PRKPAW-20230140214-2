const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
const multer = require('multer');
const path = require('path');
const fs = require("fs");

// === KONFIGURASI MULTER ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}.jpg`);
  },
});

exports.upload = multer({ storage });


// ✅ CHECK-IN
exports.CheckIn = async (req, res) => { 
  try {
    const userId = req.user.id;
    const userName = req.user.nama; // dari payload JWT
    const waktuSekarang = new Date();
    const { latitude, longitude } = req.body;
    const buktiFoto = req.file ? req.file.path : null; 

    // ✅ Cek apakah user sudah check-in hari ini (belum check-out)
    const existingRecord = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    // ✅ Buat record baru
    const newRecord = await Presensi.create({
      nama: userName,
      userId,
      checkIn: waktuSekarang,
       latitude,      
      longitude,
      buktiFoto, // Simpan path foto jika ada
    });

    // ✅ Format data sebelum dikirim ke client
    const formattedData = {
      userId,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: null,
    };

    // ✅ Kirim response
    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(waktuSekarang, "HH:mm:ss", { timeZone })} WIB`,
      data: formattedData,
    });

  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message
    });
  }
};


// ✅ CHECK-OUT
exports.CheckOut = async (req, res) => {
  try {
    const userId = req.user.id; // ambil dari payload JWT
    const userName = req.user.nama; // ambil dari JWT
    const waktuSekarang = new Date();
    const { latitude, longitude } = req.body;


    // ✅ Cari record check-in yang belum di-check-out
    const recordToUpdate = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    // ✅ Update waktu check-out
    recordToUpdate.checkOut = waktuSekarang;
    recordToUpdate.latitude = latitude;       
    recordToUpdate.longitude = longitude;
    await recordToUpdate.save();

    // ✅ Format data untuk respon
    const formattedData = {
      userId,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
    };

    // ✅ Kirim respon sukses
    res.status(200).json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });

  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId, nama } = req.user || {}; // Tambahkan nama, handle kalau req.user kosong
    const presensiId = req.params.id;
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    // ✅ Tambahkan pengecualian untuk admin
    if (nama !== "Admin User" && recordToDelete.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }

    await recordToDelete.destroy();
    res.status(200).send({
      message: "Presensi telah dihapus."
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut, nama } = req.body;
    if (checkIn === undefined && checkOut === undefined && nama === undefined) {
      return res.status(400).json({
        message:
          "Request body tidak berisi data yang valid untuk diupdate (checkIn, checkOut, atau nama).",
      });
    }
    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    recordToUpdate.nama = nama || recordToUpdate.nama;
    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

