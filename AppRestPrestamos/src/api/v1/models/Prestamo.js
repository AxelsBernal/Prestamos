import mongoose from 'mongoose';

const pagoSchema = new mongoose.Schema({
    folio: { type: Number, required: true }, // Folio único incremental
    monto: { type: Number, required: true },
    fecha: { type: Date, required: true },
});

const prestamoSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    clienteId: { type: Number, required: true },
    tipo: { type: String, required: true },
    montoPrestado: { type: Number, required: true },
    tasaInteres: { type: Number, required: true },
    montoInteres: { type: Number, required: true },
    montoTotal: { type: Number, required: true },
    saldoRestante: { type: Number, required: false },
    totalPagos: { type: Number, required: false },
    pagosRealizados: { type: Number, required: true, default: 0 },
    pagos: [pagoSchema], // Subdocumento para pagos
    fechaInicio: { type: Date, default: Date.now },
    fechaTermino: { type: Date },
    status: { type: String, enum: ['activo', 'liquidado', 'cancelado'], default: 'activo' },
});

export default mongoose.model('Prestamo', prestamoSchema, 'prestamos');
