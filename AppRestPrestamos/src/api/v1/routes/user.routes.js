import express from 'express';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../controllers/User.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas de usuarios
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getCurrentUser);
router.post('/logout', authMiddleware, logoutUser);

export default router;
