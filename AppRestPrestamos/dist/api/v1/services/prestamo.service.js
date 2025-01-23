"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _Prestamo = _interopRequireDefault(require("../models/Prestamo"));
var PrestamoService = /*#__PURE__*/function () {
  function PrestamoService() {
    (0, _classCallCheck2["default"])(this, PrestamoService);
  }
  return (0, _createClass2["default"])(PrestamoService, [{
    key: "listAllByUserId",
    value: // Listar todos los préstamos de un usuario específico
    function () {
      var _listAllByUserId = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(usuarioId) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _Prestamo["default"].find({
                usuarioId: usuarioId
              });
            case 2:
              return _context.abrupt("return", _context.sent);
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function listAllByUserId(_x) {
        return _listAllByUserId.apply(this, arguments);
      }
      return listAllByUserId;
    }() // Buscar un préstamo por ID y usuario
  }, {
    key: "findById",
    value: function () {
      var _findById = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(id, userId) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _Prestamo["default"].findOne({
                id: id,
                userId: userId
              });
            case 2:
              return _context2.abrupt("return", _context2.sent);
            case 3:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function findById(_x2, _x3) {
        return _findById.apply(this, arguments);
      }
      return findById;
    }() // Crear un nuevo préstamo asociado a un usuario
  }, {
    key: "create",
    value: function () {
      var _create = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(data) {
        var prestamo;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              prestamo = new _Prestamo["default"](data);
              _context3.next = 3;
              return prestamo.save();
            case 3:
              return _context3.abrupt("return", _context3.sent);
            case 4:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function create(_x4) {
        return _create.apply(this, arguments);
      }
      return create;
    }() // Actualizar un préstamo por su ID y usuario
  }, {
    key: "update",
    value: function () {
      var _update = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(id, userId, data) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _Prestamo["default"].findOneAndUpdate({
                id: id,
                usuarioId: userId
              }, data, {
                "new": true
              });
            case 2:
              return _context4.abrupt("return", _context4.sent);
            case 3:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function update(_x5, _x6, _x7) {
        return _update.apply(this, arguments);
      }
      return update;
    }() // Eliminar un préstamo por su ID y usuario
  }, {
    key: "delete",
    value: function () {
      var _delete2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(id, userId) {
        var result;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return _Prestamo["default"].findOneAndDelete({
                id: id,
                usuarioId: userId
              });
            case 3:
              result = _context5.sent;
              return _context5.abrupt("return", result);
            case 7:
              _context5.prev = 7;
              _context5.t0 = _context5["catch"](0);
              console.error("Error en delete:", _context5.t0);
              throw _context5.t0;
            case 11:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[0, 7]]);
      }));
      function _delete(_x8, _x9) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }() // Obtener el último ID disponible
  }, {
    key: "getLastPrestamoId",
    value: function () {
      var _getLastPrestamoId = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(userId) {
        var lastPrestamo;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return _Prestamo["default"].find({
                userId: userId
              }).sort({
                id: -1
              }).limit(1);
            case 3:
              lastPrestamo = _context6.sent;
              return _context6.abrupt("return", lastPrestamo.length > 0 ? lastPrestamo[0].id : 0);
            case 7:
              _context6.prev = 7;
              _context6.t0 = _context6["catch"](0);
              console.error("Error in getLastPrestamoId:", _context6.t0);
              throw _context6.t0;
            case 11:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[0, 7]]);
      }));
      function getLastPrestamoId(_x10) {
        return _getLastPrestamoId.apply(this, arguments);
      }
      return getLastPrestamoId;
    }() // Buscar el último préstamo de un usuario
  }, {
    key: "findLastByUserId",
    value: function () {
      var _findLastByUserId = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(userId) {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return _Prestamo["default"].findOne({
                usuarioId: userId
              }).sort({
                id: -1
              });
            case 3:
              return _context7.abrupt("return", _context7.sent);
            case 6:
              _context7.prev = 6;
              _context7.t0 = _context7["catch"](0);
              console.error("Error in findLastByUserId:", _context7.t0);
              throw _context7.t0;
            case 10:
            case "end":
              return _context7.stop();
          }
        }, _callee7, null, [[0, 6]]);
      }));
      function findLastByUserId(_x11) {
        return _findLastByUserId.apply(this, arguments);
      }
      return findLastByUserId;
    }() // Buscar un préstamo por ID y usuarioId
  }, {
    key: "findByIdAndUserId",
    value: function () {
      var _findByIdAndUserId = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(id, usuarioId) {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              _context8.next = 3;
              return _Prestamo["default"].findOne({
                id: id,
                usuarioId: usuarioId
              });
            case 3:
              return _context8.abrupt("return", _context8.sent);
            case 6:
              _context8.prev = 6;
              _context8.t0 = _context8["catch"](0);
              console.error("Error in findByIdAndUserId:", _context8.t0);
              throw _context8.t0;
            case 10:
            case "end":
              return _context8.stop();
          }
        }, _callee8, null, [[0, 6]]);
      }));
      function findByIdAndUserId(_x12, _x13) {
        return _findByIdAndUserId.apply(this, arguments);
      }
      return findByIdAndUserId;
    }() // Obtener un resumen de préstamos por cliente y usuario
    // Obtener un resumen de préstamos por cliente y usuario
  }, {
    key: "getLoanSummaryByClienteId",
    value: function () {
      var _getLoanSummaryByClienteId = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9(clienteId, userId) {
        var parsedClienteId, prestamos;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              // Asegurarse de que clienteId y userId estén en el formato correcto
              parsedClienteId = typeof clienteId === "string" ? parseInt(clienteId, 10) : clienteId;
              if (!isNaN(parsedClienteId)) {
                _context9.next = 4;
                break;
              }
              throw new Error("clienteId debe ser un número válido");
            case 4:
              _context9.next = 6;
              return _Prestamo["default"].find({
                clienteId: parsedClienteId,
                usuarioId: userId
              }, {
                montoPrestado: 1,
                tipo: 1
              } // Seleccionar solo los campos necesarios
              );
            case 6:
              prestamos = _context9.sent;
              if (!(!prestamos || prestamos.length === 0)) {
                _context9.next = 10;
                break;
              }
              console.log("No se encontraron pr\xE9stamos para clienteId: ".concat(parsedClienteId, " y usuarioId: ").concat(userId));
              return _context9.abrupt("return", []);
            case 10:
              return _context9.abrupt("return", prestamos);
            case 13:
              _context9.prev = 13;
              _context9.t0 = _context9["catch"](0);
              console.error("Error in getLoanSummaryByClienteId:", _context9.t0.message);
              throw _context9.t0;
            case 17:
            case "end":
              return _context9.stop();
          }
        }, _callee9, null, [[0, 13]]);
      }));
      function getLoanSummaryByClienteId(_x14, _x15) {
        return _getLoanSummaryByClienteId.apply(this, arguments);
      }
      return getLoanSummaryByClienteId;
    }()
  }]);
}();
var _default = exports["default"] = new PrestamoService();