"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var clienteSchema = new _mongoose["default"].Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  // ID único del cliente
  nombre: {
    type: String,
    required: true
  },
  apellidos: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  prestamosActivos: [{
    type: Number
  }],
  // Cambiado de ObjectId a Number
  historialPrestamos: [{
    type: Number
  }],
  // Cambiado de ObjectId a Number
  fechaRegistro: {
    type: Date,
    "default": Date.now
  },
  usuarioId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'User',
    required: true
  } // Relación con el usuario
});
var _default = exports["default"] = _mongoose["default"].model('Cliente', clienteSchema, 'clientes');