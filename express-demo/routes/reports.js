const express = require('express');
const router = express.Router();

const reportController = require('../../controllers/reportController');
const { authenticateToken } = require('../../middleware/authenticateToken');
const { isAdmin } = require('../../middleware/permissionMiddleware');

router.get('/daily', [authenticateToken, isAdmin], reportController.getDailyReport);

module.exports = router;
