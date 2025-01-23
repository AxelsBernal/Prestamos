import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from '../../../config/config.js';

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            config.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Registro de usuario
export const registerUser = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear usuario
        const newUser = new User({
            nombre,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener información del usuario actual
import UserService from "../services/user.service.js";

export const getCurrentUser = async (req, res) => {
    try {
        // `req.user` es añadido por el middleware de autenticación
        const userId = req.user.userId; 

        const user = await UserService.findById(userId); // Buscar al usuario en la base de datos

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Opcional: Ocultar campos sensibles
        const { password, ...userWithoutPassword } = user.toObject();

        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error("Error en getCurrentUser:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Cerrar sesión del usuario
export const logoutUser = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Actualizar el campo lastLogout del usuario
        await User.findByIdAndUpdate(userId, { lastLogout: new Date() });

        res.status(200).json({ message: "Logout successful. Token invalidated." });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


