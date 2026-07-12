const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { registerValidation, loginValidation } = require('../validations/auth.validation');
const { validate } = require('../middleware/validate');
const { verifyToken } = require('../middleware/auth');

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;
