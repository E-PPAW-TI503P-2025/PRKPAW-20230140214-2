const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Gunakan key yang sama seperti di authController.js
const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN';

exports.authenticateToken = async (req, res, next) => {
  try {
    // Ambil token dari header Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Token tidak ditemukan. Silakan login terlebih dahulu.',
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Cari user di database berdasarkan ID dari payload token
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({
        message: 'User tidak ditemukan.',
      });
    }

    // Simpan data user ke req.user (biar bisa dipakai di controller)
    req.user = user;
    next();
  } catch (error) {
    console.error('Token error:', error.message);
    return res.status(403).json({
      message: 'Token tidak valid atau sudah kedaluwarsa.',
      error: error.message,
    });
  }
};
