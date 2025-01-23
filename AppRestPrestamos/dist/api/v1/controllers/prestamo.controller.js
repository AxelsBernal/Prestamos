"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePrestamo = exports.obtenerResumenPrestamos = exports.getPrestamoById = exports.getPagosPorPrestamo = exports.getPagosPorClienteYPrestamo = exports.getPagosPorCliente = exports.getLoanSummaryByClienteId = exports.getAllPrestamos = exports.getAllPagos = exports.editPago = exports.deletePrestamo = exports.deletePago = exports.createPrestamo = exports.addPago = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _prestamo = _interopRequireDefault(require("../services/prestamo.service"));
var _clienteService = _interopRequireDefault(require("../services/cliente.service .js"));
var _prestamoService = _interopRequireDefault(require("../services/prestamo.service.js"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
// Get all loans filtered by user
var getAllPrestamos = exports.getAllPrestamos = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var userId, prestamos, prestamosConClientes;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = req.user.userId; // Asegúrate de que `usuarioId` es lo que esperas
          // console.log("Fetching prestamos for userId:", userId);
          // Fetch all loans associated with the user
          _context2.next = 4;
          return _prestamo["default"].listAllByUserId(userId);
        case 4:
          prestamos = _context2.sent;
          _context2.next = 7;
          return Promise.all(prestamos.map(/*#__PURE__*/function () {
            var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(prestamo) {
              var cliente;
              return _regenerator["default"].wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return _clienteService["default"].findById(prestamo.clienteId, userId);
                  case 2:
                    cliente = _context.sent;
                    return _context.abrupt("return", _objectSpread(_objectSpread({}, prestamo._doc), {}, {
                      nombreCliente: cliente ? cliente.nombre : "No encontrado",
                      apellidosCliente: cliente ? cliente.apellidos : "No encontrado"
                    }));
                  case 4:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x3) {
              return _ref2.apply(this, arguments);
            };
          }()));
        case 7:
          prestamosConClientes = _context2.sent;
          res.status(200).json(prestamosConClientes);
          _context2.next = 15;
          break;
        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.error("Error en getAllPrestamos:", _context2.t0);
          res.status(500).json({
            message: "Error interno del servidor"
          });
        case 15:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 11]]);
  }));
  return function getAllPrestamos(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Get a specific loan by ID and user
// Obtener un préstamo específico por ID y usuario
var getPrestamoById = exports.getPrestamoById = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var id, userId, prestamo;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          userId = req.user.userId; // Usar el servicio para buscar el préstamo
          _context3.next = 5;
          return _prestamo["default"].findByIdAndUserId(Number(id), userId);
        case 5:
          prestamo = _context3.sent;
          if (prestamo) {
            _context3.next = 8;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            message: "Préstamo no encontrado"
          }));
        case 8:
          res.status(200).json(prestamo);
          _context3.next = 15;
          break;
        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          console.error("Error en getPrestamoById:", _context3.t0);
          res.status(500).json({
            message: "Error interno del servidor"
          });
        case 15:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 11]]);
  }));
  return function getPrestamoById(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

// Create a loan
var createPrestamo = exports.createPrestamo = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var _req$body, clienteId, tipo, montoPrestado, tasaInteres, fechaInicio, userId, cliente, lastPrestamo, newId, montoInteres, montoTotal, saldoRestante, totalPagos, prestamoData, prestamo;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body = req.body, clienteId = _req$body.clienteId, tipo = _req$body.tipo, montoPrestado = _req$body.montoPrestado, tasaInteres = _req$body.tasaInteres, fechaInicio = _req$body.fechaInicio;
          userId = req.user.userId; // Validar que el cliente existe y pertenece al usuario autenticado
          _context4.next = 5;
          return _clienteService["default"].findById(clienteId, userId);
        case 5:
          cliente = _context4.sent;
          if (cliente) {
            _context4.next = 8;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            message: "Cliente no encontrado o no pertenece al usuario"
          }));
        case 8:
          _context4.next = 10;
          return _prestamo["default"].findLastByUserId(userId);
        case 10:
          lastPrestamo = _context4.sent;
          console.log('UsuarioID: ', userId);
          console.log('newId: ', userId);
          newId = lastPrestamo ? lastPrestamo.id + 1 : 1;
          console.log('nuevo newId: ', userId);
          // Calcular montos según el tipo de préstamo
          montoInteres = 0;
          montoTotal = 0;
          saldoRestante = 0;
          totalPagos = 0;
          if (tipo === "semanal") {
            montoInteres = montoPrestado * tasaInteres;
            totalPagos = req.body.totalPagos || 0;
            montoTotal = montoInteres * totalPagos;
            saldoRestante = montoTotal;
          } else if (tipo === "mensual") {
            montoInteres = montoPrestado * tasaInteres;
            montoTotal = montoInteres;
            saldoRestante = montoTotal;
          }

          // Preparar datos para el préstamo
          prestamoData = {
            id: newId,
            clienteId: clienteId,
            tipo: tipo,
            montoPrestado: montoPrestado,
            tasaInteres: tasaInteres,
            montoInteres: montoInteres,
            montoTotal: montoTotal,
            saldoRestante: saldoRestante,
            totalPagos: tipo === "semanal" ? totalPagos : undefined,
            fechaInicio: fechaInicio,
            status: req.body.status || "activo",
            usuarioId: userId
          }; // Crear el préstamo
          _context4.next = 23;
          return _prestamo["default"].create(prestamoData);
        case 23:
          prestamo = _context4.sent;
          // Asociar el préstamo al cliente
          cliente.prestamosActivos.push(prestamo.id);
          _context4.next = 27;
          return _clienteService["default"].update(cliente.id, userId, cliente);
        case 27:
          res.status(201).json(prestamo);
          _context4.next = 34;
          break;
        case 30:
          _context4.prev = 30;
          _context4.t0 = _context4["catch"](0);
          console.error("Error en createPrestamo:", _context4.t0);
          res.status(500).json({
            message: "Error interno del servidor"
          });
        case 34:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 30]]);
  }));
  return function createPrestamo(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

// Update a loan
var updatePrestamo = exports.updatePrestamo = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var id, userId, updatedPrestamo;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id; // ID del préstamo
          userId = req.user.userId; // ID del usuario desde el token
          // console.log("ID del préstamo:", id);
          //console.log("User ID del token:", userId);
          // Llamada al servicio para actualizar el préstamo
          _context5.next = 5;
          return _prestamo["default"].update(Number(id), userId, req.body);
        case 5:
          updatedPrestamo = _context5.sent;
          if (updatedPrestamo) {
            _context5.next = 8;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            message: "Préstamo no encontrado"
          }));
        case 8:
          //console.log("Préstamo actualizado:", updatedPrestamo);

          res.status(200).json(updatedPrestamo);
          _context5.next = 15;
          break;
        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          console.error("Error en updatePrestamo:", _context5.t0);
          res.status(500).json({
            message: "Error interno del servidor"
          });
        case 15:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 11]]);
  }));
  return function updatePrestamo(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

// Delete a loan
var deletePrestamo = exports.deletePrestamo = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var id, userId, prestamo, cliente;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          id = req.params.id; // ID del préstamo a eliminar
          userId = req.user.userId; // ID del usuario autenticado
          // Buscar el préstamo por ID y usuario
          _context6.next = 5;
          return _prestamo["default"].findByIdAndUserId(Number(id), userId);
        case 5:
          prestamo = _context6.sent;
          if (prestamo) {
            _context6.next = 8;
            break;
          }
          return _context6.abrupt("return", res.status(404).json({
            message: "Préstamo no encontrado"
          }));
        case 8:
          _context6.next = 10;
          return _prestamo["default"]["delete"](Number(id), userId);
        case 10:
          _context6.next = 12;
          return _clienteService["default"].findById(prestamo.clienteId, userId);
        case 12:
          cliente = _context6.sent;
          if (!cliente) {
            _context6.next = 17;
            break;
          }
          // Actualizar el cliente para remover el préstamo de sus préstamos activos
          cliente.prestamosActivos = cliente.prestamosActivos.filter(function (p) {
            return p !== prestamo.id;
          });
          _context6.next = 17;
          return _clienteService["default"].update(cliente.id, userId, cliente);
        case 17:
          res.status(200).json({
            message: "Préstamo eliminado exitosamente"
          });
          _context6.next = 24;
          break;
        case 20:
          _context6.prev = 20;
          _context6.t0 = _context6["catch"](0);
          console.error("Error en deletePrestamo:", _context6.t0);
          res.status(500).json({
            message: "Error interno del servidor"
          });
        case 24:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 20]]);
  }));
  return function deletePrestamo(_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}();

// Add a payment to a loan
var addPago = exports.addPago = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var id, _req$body2, monto, fecha, userId, prestamo, folio, nuevoPago, prestamoActualizado;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          id = req.params.id; // ID del préstamo
          _req$body2 = req.body, monto = _req$body2.monto, fecha = _req$body2.fecha; // Datos del pago
          userId = req.user.userId; // ID del usuario autenticado
          // Buscar el préstamo por ID y usuario
          _context7.next = 6;
          return _prestamo["default"].findByIdAndUserId(Number(id), userId);
        case 6:
          prestamo = _context7.sent;
          if (prestamo) {
            _context7.next = 9;
            break;
          }
          return _context7.abrupt("return", res.status(404).json({
            message: "Préstamo no encontrado"
          }));
        case 9:
          // Calcular el folio del nuevo pago
          folio = prestamo.pagos.length + 1; // Crear el nuevo pago
          nuevoPago = {
            folio: folio,
            monto: monto,
            fecha: fecha
          };
          prestamo.pagos.push(nuevoPago);

          // Actualizar el saldo restante y el estado del préstamo
          if (prestamo.tipo === "semanal" && prestamo.saldoRestante > 0) {
            prestamo.saldoRestante -= monto;
            if (prestamo.saldoRestante <= 0) {
              prestamo.status = "liquidado"; // Cambiar estado a liquidado si se salda el préstamo
            }
          }
          prestamo.pagosRealizados += 1; // Incrementar pagos realizados

          // Actualizar el préstamo en la base de datos
          _context7.next = 16;
          return _prestamo["default"].update(prestamo.id, userId, prestamo);
        case 16:
          prestamoActualizado = _context7.sent;
          res.status(201).json({
            message: "Pago agregado exitosamente",
            prestamo: prestamoActualizado
          });
          _context7.next = 24;
          break;
        case 20:
          _context7.prev = 20;
          _context7.t0 = _context7["catch"](0);
          console.error("Error en addPago:", _context7.t0);
          res.status(500).json({
            message: "Error interno del servidor"
          });
        case 24:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 20]]);
  }));
  return function addPago(_x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}();
var deletePago = exports.deletePago = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var _req$params, id, folio, userId, prestamo, pagoIndex, montoEliminado, prestamoActualizado;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$params = req.params, id = _req$params.id, folio = _req$params.folio; // `id` is the loan ID, and `folio` is the payment identifier
          userId = req.user.userId; // Extract user ID from auth middleware
          // Fetch the loan associated with the user
          _context8.next = 5;
          return _prestamo["default"].findByIdAndUserId(Number(id), userId);
        case 5:
          prestamo = _context8.sent;
          if (prestamo) {
            _context8.next = 8;
            break;
          }
          return _context8.abrupt("return", res.status(404).json({
            message: "Préstamo no encontrado o no pertenece al usuario"
          }));
        case 8:
          // Find the index of the payment to delete
          pagoIndex = prestamo.pagos.findIndex(function (p) {
            return p.folio === Number(folio);
          });
          if (!(pagoIndex === -1)) {
            _context8.next = 11;
            break;
          }
          return _context8.abrupt("return", res.status(404).json({
            message: "Pago no encontrado"
          }));
        case 11:
          // Remove the payment and adjust loan details
          montoEliminado = prestamo.pagos[pagoIndex].monto; // Store the amount being removed
          prestamo.pagos.splice(pagoIndex, 1); // Remove the payment from the array

          // Update the loan details after payment removal
          prestamo.saldoRestante += montoEliminado; // Restore the amount to the remaining balance
          prestamo.pagosRealizados -= 1; // Decrement the count of completed payments

          // Change loan status if applicable
          if (prestamo.saldoRestante > 0 && prestamo.status === "liquidado") {
            prestamo.status = "activo"; // Revert the loan status to active
            prestamo.fechaTermino = null; // Remove the completion date
          }

          // Save the updated loan details
          _context8.next = 18;
          return _prestamo["default"].update(prestamo.id, userId, prestamo);
        case 18:
          prestamoActualizado = _context8.sent;
          // Respond with success
          res.status(200).json({
            message: "Pago eliminado exitosamente",
            prestamo: prestamoActualizado
          });
          _context8.next = 26;
          break;
        case 22:
          _context8.prev = 22;
          _context8.t0 = _context8["catch"](0);
          console.error("Error en deletePago:", _context8.t0);
          res.status(500).json({
            message: "Error interno del servidor"
          });
        case 26:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 22]]);
  }));
  return function deletePago(_x14, _x15) {
    return _ref8.apply(this, arguments);
  };
}();
var editPago = exports.editPago = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var _req$params2, id, folio, _req$body3, monto, fecha, userId, prestamo, pagoIndex, montoAnterior, prestamoActualizado;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _req$params2 = req.params, id = _req$params2.id, folio = _req$params2.folio;
          _req$body3 = req.body, monto = _req$body3.monto, fecha = _req$body3.fecha;
          userId = req.user.userId; // Asegura que solo afecta préstamos del usuario
          // Busca el préstamo por ID y usuario
          _context9.next = 6;
          return _prestamo["default"].findByIdAndUserId(Number(id), userId);
        case 6:
          prestamo = _context9.sent;
          if (prestamo) {
            _context9.next = 9;
            break;
          }
          return _context9.abrupt("return", res.status(404).json({
            message: "Préstamo no encontrado o no pertenece al usuario"
          }));
        case 9:
          // Encuentra el índice del pago específico
          pagoIndex = prestamo.pagos.findIndex(function (p) {
            return p.folio === Number(folio);
          });
          if (!(pagoIndex === -1)) {
            _context9.next = 12;
            break;
          }
          return _context9.abrupt("return", res.status(404).json({
            message: "Pago no encontrado"
          }));
        case 12:
          // Actualiza el pago y ajusta los montos en el préstamo
          montoAnterior = prestamo.pagos[pagoIndex].monto;
          prestamo.pagos[pagoIndex].monto = monto;
          prestamo.pagos[pagoIndex].fecha = fecha;
          if (monto > montoAnterior) {
            prestamo.saldoRestante -= monto - montoAnterior;
          } else if (monto < montoAnterior) {
            prestamo.saldoRestante += montoAnterior - monto;
          }

          // Ajusta el estado del préstamo según el saldo restante
          if (prestamo.saldoRestante === 0) {
            prestamo.status = "liquidado";
            prestamo.fechaTermino = new Date();
          } else if (prestamo.status === "liquidado" && prestamo.saldoRestante > 0) {
            prestamo.status = "activo";
            prestamo.fechaTermino = null;
          }

          // Actualiza el préstamo en la base de datos
          _context9.next = 19;
          return _prestamo["default"].update(prestamo.id, userId, prestamo);
        case 19:
          prestamoActualizado = _context9.sent;
          res.status(200).json({
            message: "Pago editado exitosamente",
            prestamo: prestamoActualizado
          });
          _context9.next = 27;
          break;
        case 23:
          _context9.prev = 23;
          _context9.t0 = _context9["catch"](0);
          console.error("Error en editPago:", _context9.t0);
          res.status(500).json({
            message: "Error interno del servidor"
          });
        case 27:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 23]]);
  }));
  return function editPago(_x16, _x17) {
    return _ref9.apply(this, arguments);
  };
}();
var getPagosPorCliente = exports.getPagosPorCliente = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var clienteId, userId, prestamos, clientePrestamos, pagos;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          clienteId = parseInt(req.params.clienteId, 10);
          userId = req.user.userId; // Obtener el ID del usuario autenticado
          // Buscar los préstamos asociados al cliente y usuario
          _context10.next = 5;
          return _prestamo["default"].listAllByUserId(userId);
        case 5:
          prestamos = _context10.sent;
          clientePrestamos = prestamos.filter(function (prestamo) {
            return prestamo.clienteId === clienteId;
          });
          if (!(clientePrestamos.length === 0)) {
            _context10.next = 9;
            break;
          }
          return _context10.abrupt("return", res.status(404).json({
            message: "No se encontraron préstamos para este cliente"
          }));
        case 9:
          // Obtener información detallada de los pagos
          pagos = clientePrestamos.flatMap(function (prestamo) {
            return prestamo.pagos.map(function (pago, index) {
              return {
                clienteId: prestamo.clienteId,
                prestamoId: prestamo.id,
                numeroPago: index + 1,
                montoPago: pago.monto,
                fechaPago: pago.fecha,
                saldoRestante: prestamo.saldoRestante
              };
            });
          });
          res.status(200).json(pagos);
          _context10.next = 17;
          break;
        case 13:
          _context10.prev = 13;
          _context10.t0 = _context10["catch"](0);
          console.error("Error en getPagosPorCliente:", _context10.t0);
          res.status(500).json({
            message: "Error interno del servidor"
          });
        case 17:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 13]]);
  }));
  return function getPagosPorCliente(_x18, _x19) {
    return _ref10.apply(this, arguments);
  };
}();
var getLoanSummaryByClienteId = exports.getLoanSummaryByClienteId = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res) {
    var clienteId, userId, prestamos, resumen;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          clienteId = req.params.clienteId; // ID del cliente desde los parámetros de la URL
          userId = req.user.userId; // ID del usuario autenticado desde el middleware de autenticación
          // Obtener los préstamos asociados al cliente y al usuario
          _context11.next = 5;
          return _prestamo["default"].getLoanSummaryByClienteId(clienteId, userId);
        case 5:
          prestamos = _context11.sent;
          if (!(!prestamos || prestamos.length === 0)) {
            _context11.next = 8;
            break;
          }
          return _context11.abrupt("return", res.status(404).json({
            message: "No se encontraron préstamos para el cliente especificado"
          }));
        case 8:
          // Crear un resumen con el total de préstamos y los detalles necesarios
          resumen = {
            clienteId: clienteId,
            totalPrestamos: prestamos.length,
            detallesPrestamos: prestamos.map(function (prestamo) {
              return {
                montoPrestado: prestamo.montoPrestado,
                tipo: prestamo.tipo
              };
            })
          };
          res.status(200).json(resumen);
          _context11.next = 16;
          break;
        case 12:
          _context11.prev = 12;
          _context11.t0 = _context11["catch"](0);
          console.error("Error en getLoanSummaryByClienteId:", _context11.t0);
          res.status(500).json({
            message: "Error interno del servidor"
          });
        case 16:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 12]]);
  }));
  return function getLoanSummaryByClienteId(_x20, _x21) {
    return _ref11.apply(this, arguments);
  };
}();
var obtenerResumenPrestamos = exports.obtenerResumenPrestamos = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res) {
    var userId, prestamos, totalCapital, totalGanancias, totalPrestamos;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          userId = req.user.userId; // Ensure the user ID is properly obtained
          _context12.next = 4;
          return _prestamoService["default"].listAllByUserId(userId);
        case 4:
          prestamos = _context12.sent;
          totalCapital = 0; // Suma del capital pendiente
          totalGanancias = 0; // Suma de las ganancias totales
          totalPrestamos = prestamos.length; // Total de préstamos registrados
          prestamos.forEach(function (prestamo) {
            if (prestamo.tipo === "semanal") {
              // Solo los primeros 10 pagos son capital
              var pagosCapital = Math.min(prestamo.totalPagos, 10);
              prestamo.pagos.forEach(function (pago, index) {
                if (index + 1 <= pagosCapital) {
                  // Los primeros 10 pagos se descuentan del capital
                  totalCapital -= pago.monto;
                } else {
                  // A partir del pago 11 son ganancias
                  totalGanancias += pago.monto;
                }
              });

              // Agregamos el monto inicial del préstamo al capital total
              totalCapital += prestamo.montoPrestado;
            } else if (prestamo.tipo === "mensual") {
              // Todos los pagos de préstamos mensuales son ganancias
              prestamo.pagos.forEach(function (pago) {
                totalGanancias += pago.monto;
              });

              // Si el préstamo no está liquidado, aún se suma el monto inicial al capital total
              if (prestamo.status !== "liquidado") {
                totalCapital += prestamo.montoPrestado;
              }
            }
          });
          res.status(200).json({
            totalPrestamos: totalPrestamos,
            totalCapital: totalCapital,
            totalGanancias: totalGanancias
          });
          _context12.next = 16;
          break;
        case 12:
          _context12.prev = 12;
          _context12.t0 = _context12["catch"](0);
          console.error("Error en obtenerResumenPrestamos:", _context12.t0);
          res.status(500).json({
            error: "Error interno del servidor."
          });
        case 16:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[0, 12]]);
  }));
  return function obtenerResumenPrestamos(_x22, _x23) {
    return _ref12.apply(this, arguments);
  };
}();
var getPagosPorPrestamo = exports.getPagosPorPrestamo = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res) {
    var prestamoId, userId, prestamo, pagos;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          prestamoId = req.params.prestamoId; // Se obtiene el ID del préstamo desde los parámetros
          userId = req.user.userId; // Se obtiene el ID del usuario autenticado
          // console.log("Buscando préstamo con ID:", prestamoId, "y usuario ID:", userId);
          // Busca el préstamo por ID y usuario
          _context13.next = 5;
          return _prestamo["default"].findByIdAndUserId(Number(prestamoId), userId);
        case 5:
          prestamo = _context13.sent;
          if (prestamo) {
            _context13.next = 8;
            break;
          }
          return _context13.abrupt("return", res.status(404).json({
            message: "Préstamo no encontrado o no pertenece al usuario"
          }));
        case 8:
          //console.log("Préstamo encontrado:", prestamo);
          // Obtén los pagos del préstamo
          pagos = prestamo.pagos.map(function (pago, index) {
            return {
              numeroPago: index + 1,
              montoPago: pago.monto,
              fechaPago: pago.fecha
            };
          }); //console.log("Pagos del préstamo:", pagos);
          res.status(200).json(pagos);
          _context13.next = 16;
          break;
        case 12:
          _context13.prev = 12;
          _context13.t0 = _context13["catch"](0);
          console.error("Error en getPagosPorPrestamo:", _context13.t0);
          res.status(500).json({
            message: "Error interno del servidor"
          });
        case 16:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[0, 12]]);
  }));
  return function getPagosPorPrestamo(_x24, _x25) {
    return _ref13.apply(this, arguments);
  };
}();
var getPagosPorClienteYPrestamo = exports.getPagosPorClienteYPrestamo = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res) {
    var clienteId, prestamoId, userId, prestamo, cliente, resultado;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          clienteId = parseInt(req.params.clienteId, 10);
          prestamoId = parseInt(req.params.prestamoId, 10);
          userId = req.user.userId; // console.log(`Buscando pagos para clienteId: ${clienteId}, prestamoId: ${prestamoId}`);
          // Busca el préstamo específico del cliente y usuario
          _context14.next = 6;
          return _prestamo["default"].findByIdAndUserId(prestamoId, userId);
        case 6:
          prestamo = _context14.sent;
          if (prestamo) {
            _context14.next = 9;
            break;
          }
          return _context14.abrupt("return", res.status(404).json({
            message: "Préstamo no encontrado"
          }));
        case 9:
          if (!(prestamo.clienteId !== clienteId)) {
            _context14.next = 11;
            break;
          }
          return _context14.abrupt("return", res.status(400).json({
            message: "El préstamo no pertenece al cliente especificado"
          }));
        case 11:
          _context14.next = 13;
          return _clienteService["default"].findById(clienteId, userId);
        case 13:
          cliente = _context14.sent;
          if (cliente) {
            _context14.next = 16;
            break;
          }
          return _context14.abrupt("return", res.status(404).json({
            message: "Cliente no encontrado"
          }));
        case 16:
          // Formatear la respuesta con la información del préstamo y los pagos
          resultado = {
            idPrestamo: prestamo.id,
            idCliente: prestamo.clienteId,
            nombreCliente: "".concat(cliente.nombre, " ").concat(cliente.apellidos),
            // Combinar nombre y apellidos del cliente
            montoPrestado: prestamo.montoPrestado,
            montoTotal: prestamo.montoTotal,
            saldoRestante: prestamo.saldoRestante,
            fechaInicio: new Date(prestamo.fechaInicio).toLocaleDateString("es-MX"),
            pagos: prestamo.pagos.map(function (pago, index) {
              return {
                numeroPago: index + 1,
                montoPago: pago.monto,
                fechaPago: new Date(pago.fecha).toLocaleDateString("es-MX")
              };
            })
          }; //console.log("Resultado para cliente y préstamo:", resultado);
          res.status(200).json(resultado);
          _context14.next = 24;
          break;
        case 20:
          _context14.prev = 20;
          _context14.t0 = _context14["catch"](0);
          console.error("Error en getPagosPorClienteYPrestamo:", _context14.t0);
          res.status(500).json({
            message: "Error interno del servidor"
          });
        case 24:
        case "end":
          return _context14.stop();
      }
    }, _callee14, null, [[0, 20]]);
  }));
  return function getPagosPorClienteYPrestamo(_x26, _x27) {
    return _ref14.apply(this, arguments);
  };
}();
var getAllPagos = exports.getAllPagos = /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res) {
    var userId, prestamos, allPagos;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          // Fetch all loans for the logged-in user
          userId = req.user.userId;
          _context16.next = 4;
          return _prestamo["default"].listAllByUserId(userId);
        case 4:
          prestamos = _context16.sent;
          if (!(!prestamos || prestamos.length === 0)) {
            _context16.next = 7;
            break;
          }
          return _context16.abrupt("return", res.status(404).json({
            message: "No se encontraron préstamos para el usuario especificado."
          }));
        case 7:
          _context16.next = 9;
          return Promise.all(prestamos.flatMap(/*#__PURE__*/function () {
            var _ref16 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee15(prestamo) {
              var cliente;
              return _regenerator["default"].wrap(function _callee15$(_context15) {
                while (1) switch (_context15.prev = _context15.next) {
                  case 0:
                    _context15.next = 2;
                    return _clienteService["default"].findById(prestamo.clienteId, userId);
                  case 2:
                    cliente = _context15.sent;
                    return _context15.abrupt("return", prestamo.pagos.map(function (pago) {
                      return {
                        prestamoId: prestamo.id,
                        nombreCliente: cliente ? "".concat(cliente.nombre, " ").concat(cliente.apellidos) : "No encontrado",
                        montoPrestado: prestamo.montoPrestado,
                        folio: pago.folio,
                        monto: pago.monto,
                        fecha: pago.fecha
                      };
                    }));
                  case 4:
                  case "end":
                    return _context15.stop();
                }
              }, _callee15);
            }));
            return function (_x30) {
              return _ref16.apply(this, arguments);
            };
          }()));
        case 9:
          allPagos = _context16.sent;
          // Flatten and return all payments
          res.status(200).json(allPagos.flat());
          _context16.next = 17;
          break;
        case 13:
          _context16.prev = 13;
          _context16.t0 = _context16["catch"](0);
          console.error("Error in getAllPagos:", _context16.t0);
          res.status(500).json({
            message: "Error interno del servidor."
          });
        case 17:
        case "end":
          return _context16.stop();
      }
    }, _callee16, null, [[0, 13]]);
  }));
  return function getAllPagos(_x28, _x29) {
    return _ref15.apply(this, arguments);
  };
}();