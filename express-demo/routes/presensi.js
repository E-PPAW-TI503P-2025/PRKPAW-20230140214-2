const express = require('express');
const router = express.Router();
const presensiController = require('../../controllers/presensiController');
const authenticateToken = require('../../middleware/authenticateToken');
router.post('/check-in', authenticateToken.authenticateToken, presensiController.CheckIn);
router.post('/check-out', authenticateToken.authenticateToken, presensiController.CheckOut);
router.put('/:id', authenticateToken.authenticateToken, presensiController.updatePresensi);
router.delete('/:id', authenticateToken.authenticateToken, presensiController.deletePresensi);
module.exports = router;
