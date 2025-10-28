const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

// ✅ CHECK-IN
exports.CheckIn = async (req, res) => {
  try {
    const userId = req.body.userId || req.user.id;
    const userName = req.body.nama || req.user.nama;
    const waktuSekarang = new Date();

    // Cek apakah sudah check-in hari ini
    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    // Buat data baru
    const newRecord = await Presensi.create({
      userId: userId,
      nama: userName,
      checkIn: waktuSekarang,
    });

    const formattedData = {
      userId: newRecord.userId,
      nama: newRecord.nama,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: null,
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// ✅ CHECK-OUT
exports.CheckOut = async (req, res) => {
  try {
    const userId = req.body.userId || req.user.id;
    const userName = req.body.nama || req.user.nama;
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const formattedData = {
      userId: recordToUpdate.userId,
      nama: recordToUpdate.nama,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
