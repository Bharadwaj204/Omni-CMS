const express = require('express');
const router = express.Router();
const { loginAdmin, getMe } = require('../controllers/authController');
const protectRoute = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.get('/me', protectRoute, getMe);

module.exports = router;
