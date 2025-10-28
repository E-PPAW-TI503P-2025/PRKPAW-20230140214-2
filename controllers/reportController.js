const { Presensi } = require("../models");
const { Op } = require("sequelize");
const { format } = require("date-fns-tz");

const timeZone = "Asia/Jakarta";

exports.getDailyReport = async (req, res) => {
  try {
    console.log("Controller: Mengambil data laporan harian dari database...");

    const today = new Date();
    const formattedDate = format(today, "dd/MM/yyyy", { timeZone });

    // Batas waktu hari ini (00:00 - 23:59)
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Ambil data dari tabel presensi
    const dataPresensi = await Presensi.findAll({
      where: {
        checkIn: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      order: [["checkIn", "ASC"]],
    });

    // Format hasil agar lebih rapi
    const result = dataPresensi.map((item) => ({
      userId: item.userId,
      nama: item.nama,
      checkIn: format(item.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: item.checkOut
        ? format(item.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone })
        : null,
    }));

    res.status(200).json({
      reportDate: formattedDate,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error saat ambil laporan:", error);
    res.status(500).json({
      message: "Gagal mengambil laporan harian",
      error: error.message,
    });
  }
};
