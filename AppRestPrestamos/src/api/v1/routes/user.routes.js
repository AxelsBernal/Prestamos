import express from "express";
import { registerUser, loginUser, getCurrentUser } from "../controllers/User.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Ruta para registrar usuario
router.post("/register", registerUser);

// Ruta para iniciar sesión
router.post("/login", loginUser);

// Ruta para obtener información del usuario actual
router.get("/me", authMiddleware, getCurrentUser);

export default router;
