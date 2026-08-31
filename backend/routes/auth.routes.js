import express from 'express';
const router = express.Router();
import * as authController from '../controllers/auth.controller.js';
import { registerValidation, loginValidation  } from '../validations/auth.validation.js';
import { validate  } from '../middleware/validate.js';
import { verifyToken  } from '../middleware/auth.js';

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.get('/profile', verifyToken, authController.getProfile);

export default router;
