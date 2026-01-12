const router = require('express').Router();
const { authenticateToken } = require('../middlewares/auth.middleware.js');
const apiController = require('../controllers/api.controller.js');

router.get('/me', authenticateToken, apiController.me);

module.exports = router;