"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var pagoSchema = new _mongoose["default"].Schema({
  folio: {
    type: Number,
    required: true
  },
  // Folio único incremental
  monto: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  }
});
var prestamoSchema = new _mongoose["default"].Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  clienteId: {
    type: Number,
    required: true
  },
  usuarioId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Relación con el usuario
  tipo: {
    type: String,
    required: true
  },
  montoPrestado: {
    type: Number,
    required: true
  },
  tasaInteres: {
    type: Number,
    required: true
  },
  montoInteres: {
    type: Number,
    required: true
  },
  montoTotal: {
    type: Number,
    required: true
  },
  saldoRestante: {
    type: Number,
    required: false
  },
  totalPagos: {
    type: Number,
    required: false
  },
  pagosRealizados: {
    type: Number,
    required: true,
    "default": 0
  },
  pagos: [pagoSchema],
  // Subdocumento para pagos
  fechaInicio: {
    type: Date,
    "default": Date.now
  },
  fechaTermino: {
    type: Date
  },
  status: {
    type: String,
    "enum": ['activo', 'liquidado', 'cancelado'],
    "default": 'activo'
  }
});
var _default = exports["default"] = _mongoose["default"].model('Prestamo', prestamoSchema, 'prestamos');