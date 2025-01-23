import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastLogout: { type: Date, default: null }, // Campo para manejar el cierre de sesión
});

export default mongoose.model("User", UserSchema, "User");
