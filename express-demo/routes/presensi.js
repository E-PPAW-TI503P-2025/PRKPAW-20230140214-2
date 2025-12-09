const express = require('express');
const router = express.Router();
const presensiController = require('../../controllers/presensiController');
const authenticateToken = require('../../middleware/authenticateToken');

// ROUTE CHECK-IN (DENGAN FOTO)
router.post(
  '/check-in',
  authenticateToken.authenticateToken,
  presensiController.upload.single('image'),
  presensiController.CheckIn
);

// ROUTE CHECK-OUT
router.post(
  '/check-out',
  authenticateToken.authenticateToken,
  presensiController.CheckOut
);

// UPDATE PRESENSI
router.put(
  '/:id',
  authenticateToken.authenticateToken,
  presensiController.updatePresensi
);

// DELETE PRESENSI
router.delete(
  '/:id',
  authenticateToken.authenticateToken,
  presensiController.deletePresensi
);

module.exports = router;
