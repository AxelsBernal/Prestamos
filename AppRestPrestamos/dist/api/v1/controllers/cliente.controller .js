"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCliente = exports.getClienteById = exports.getAllClientes = exports.deleteCliente = exports.createCliente = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _cliente = _interopRequireDefault(require("../services/cliente.service "));
var _clienteService = _interopRequireDefault(require("../services/cliente.service .js"));
var getAllClientes = exports.getAllClientes = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var userId, clientes;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = req.user.userId; // Obtén el ID del usuario desde el middleware de autenticación
          _context.next = 4;
          return _cliente["default"].listAllByUserId(userId);
        case 4:
          clientes = _context.sent;
          // Usa el nombre correcto del método
          res.status(200).json(clientes);
          _context.next = 12;
          break;
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error('Error en getAllClientes:', _context.t0);
          res.status(500).json({
            message: 'Error interno del servidor'
          });
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 8]]);
  }));
  return function getAllClientes(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Otros métodos del controlador permanecen sin cambios

var getClienteById = exports.getClienteById = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var id, userId, cliente;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          id = req.params.id; // Obtener el ID del cliente desde los parámetros
          userId = req.user.userId; // Obtener el userId desde el middleware de autenticación
          // Llamar al método correcto del servicio
          _context2.next = 5;
          return _cliente["default"].findById(Number(id), userId);
        case 5:
          cliente = _context2.sent;
          if (cliente) {
            _context2.next = 8;
            break;
          }
          return _context2.abrupt("return", res.status(404).json({
            message: 'Cliente no encontrado'
          }));
        case 8:
          res.status(200).json(cliente);
          _context2.next = 15;
          break;
        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.error('Error en getClienteById:', _context2.t0);
          res.status(500).json({
            message: 'Error interno del servidor'
          });
        case 15:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 11]]);
  }));
  return function getClienteById(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var createCliente = exports.createCliente = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var _req$body, nombre, apellidos, telefono, direccion, email, usuarioId, lastCliente, nextId, newCliente, cliente;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, nombre = _req$body.nombre, apellidos = _req$body.apellidos, telefono = _req$body.telefono, direccion = _req$body.direccion, email = _req$body.email; // Obtener el usuario autenticado desde req.user
          usuarioId = req.user.userId; // Obtener el último cliente registrado
          _context3.next = 5;
          return _clienteService["default"].getLastCliente();
        case 5:
          lastCliente = _context3.sent;
          nextId = lastCliente ? lastCliente.id + 1 : 1; // Crear un nuevo cliente
          newCliente = {
            id: nextId,
            nombre: nombre,
            apellidos: apellidos,
            telefono: telefono,
            direccion: direccion,
            email: email,
            usuarioId: usuarioId
          };
          _context3.next = 10;
          return _clienteService["default"].create(newCliente);
        case 10:
          cliente = _context3.sent;
          res.status(201).json({
            message: 'Cliente creado exitosamente',
            cliente: cliente
          });
          _context3.next = 18;
          break;
        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](0);
          console.error('Error en createCliente:', _context3.t0);
          res.status(500).json({
            message: 'Error interno del servidor'
          });
        case 18:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 14]]);
  }));
  return function createCliente(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var updateCliente = exports.updateCliente = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var id, userId, updatedCliente;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          userId = req.user.userId; // userId extraído del middleware de autenticación
          //  console.log('Actualizando cliente con ID:', id, 'y userId:', userId);
          _context4.next = 5;
          return _cliente["default"].update(Number(id), userId, req.body);
        case 5:
          updatedCliente = _context4.sent;
          if (updatedCliente) {
            _context4.next = 8;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            message: 'Cliente no encontrado'
          }));
        case 8:
          res.status(200).json(updatedCliente);
          _context4.next = 15;
          break;
        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          console.error('Error en updateCliente:', _context4.t0);
          res.status(500).json({
            message: 'Error interno del servidor'
          });
        case 15:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 11]]);
  }));
  return function updateCliente(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var deleteCliente = exports.deleteCliente = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var userId, clienteId, clienteEliminado;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = req.user.userId; // Extraer el `userId` del middleware
          clienteId = parseInt(req.params.id, 10);
          if (userId) {
            _context5.next = 5;
            break;
          }
          return _context5.abrupt("return", res.status(400).json({
            message: 'Usuario no autorizado'
          }));
        case 5:
          _context5.next = 7;
          return _cliente["default"]["delete"](clienteId, userId);
        case 7:
          clienteEliminado = _context5.sent;
          if (clienteEliminado) {
            _context5.next = 10;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            message: 'Cliente no encontrado'
          }));
        case 10:
          res.status(200).json({
            message: 'Cliente eliminado exitosamente'
          });
          _context5.next = 17;
          break;
        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](0);
          console.error('Error en deleteCliente:', _context5.t0);
          res.status(500).json({
            message: 'Error interno del servidor'
          });
        case 17:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 13]]);
  }));
  return function deleteCliente(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();