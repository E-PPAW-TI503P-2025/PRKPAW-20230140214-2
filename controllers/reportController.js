const { Presensi } = require("../models");
const { Op } = require("sequelize");
const { format } = require("date-fns-tz");



const timeZone = "Asia/Jakarta";

exports.getDailyReport = async (req, res) => {
  try {
    console.log("Controller: Mengambil data laporan harian dari database...");

    const { nama } = req.query; 
    const today = new Date();
    const formattedDate = format(today, "dd/MM/yyyy", { timeZone });


    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));


    const whereCondition = {
      checkIn: {
        [Op.between]: [startOfDay, endOfDay],
      },
    };


    if (nama) {
      whereCondition.nama = {
        [Op.like]: `%${nama}%`,
      };
    }


    const dataPresensi = await Presensi.findAll({
      where: whereCondition,
      order: [["checkIn", "ASC"]],
    });

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
