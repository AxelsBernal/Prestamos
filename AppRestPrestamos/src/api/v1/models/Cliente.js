import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // ID único del cliente
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true },
    email: { type: String, required: true },
    prestamosActivos: [{ type: Number }], // Cambiado de ObjectId a Number
    historialPrestamos: [{ type: Number }], // Cambiado de ObjectId a Number
    fechaRegistro: { type: Date, default: Date.now }
});

export default mongoose.model('Cliente', clienteSchema, 'clientes');
