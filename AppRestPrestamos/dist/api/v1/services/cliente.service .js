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
var _Cliente = _interopRequireDefault(require("../models/Cliente"));
var ClienteService = /*#__PURE__*/function () {
  function ClienteService() {
    (0, _classCallCheck2["default"])(this, ClienteService);
  }
  return (0, _createClass2["default"])(ClienteService, [{
    key: "getLastCliente",
    value: // Obtener el último cliente registrado para generar el próximo ID
    function () {
      var _getLastCliente = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _Cliente["default"].findOne().sort({
                id: -1
              }).exec();
            case 2:
              return _context.abrupt("return", _context.sent);
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function getLastCliente() {
        return _getLastCliente.apply(this, arguments);
      }
      return getLastCliente;
    }() // Listar todos los clientes de un usuario específico
  }, {
    key: "listAllByUserId",
    value: function () {
      var _listAllByUserId = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(userId) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _Cliente["default"].find({
                usuarioId: userId
              }).populate('prestamosActivos').populate('historialPrestamos');
            case 2:
              return _context2.abrupt("return", _context2.sent);
            case 3:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function listAllByUserId(_x) {
        return _listAllByUserId.apply(this, arguments);
      }
      return listAllByUserId;
    }() // Buscar cliente por ID (campo personalizado) y usuario específico
  }, {
    key: "findById",
    value: function () {
      var _findById = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(id, userId) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _Cliente["default"].findOne({
                id: id,
                usuarioId: userId
              }).populate('prestamosActivos').populate('historialPrestamos');
            case 2:
              return _context3.abrupt("return", _context3.sent);
            case 3:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function findById(_x2, _x3) {
        return _findById.apply(this, arguments);
      }
      return findById;
    }() // Crear un nuevo cliente asociado a un usuario
  }, {
    key: "create",
    value: function () {
      var _create = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(data) {
        var cliente;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              cliente = new _Cliente["default"](data);
              _context4.next = 3;
              return cliente.save();
            case 3:
              return _context4.abrupt("return", _context4.sent);
            case 4:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function create(_x4) {
        return _create.apply(this, arguments);
      }
      return create;
    }() // Actualizar un cliente por su ID y usuario
  }, {
    key: "update",
    value: function () {
      var _update = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(id, userId, data) {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _Cliente["default"].findOneAndUpdate({
                id: id,
                usuarioId: userId
              }, data, {
                "new": true
              });
            case 2:
              return _context5.abrupt("return", _context5.sent);
            case 3:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function update(_x5, _x6, _x7) {
        return _update.apply(this, arguments);
      }
      return update;
    }() // Eliminar un cliente por su ID y usuario
  }, {
    key: "delete",
    value: function () {
      var _delete2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(id, userId) {
        var cliente;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              console.log('Buscando cliente con id:', id, 'y usuarioId:', userId);
              _context6.next = 3;
              return _Cliente["default"].findOneAndDelete({
                id: id,
                usuarioId: userId
              });
            case 3:
              cliente = _context6.sent;
              console.log('Cliente encontrado para eliminar:', cliente);
              return _context6.abrupt("return", cliente);
            case 6:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function _delete(_x8, _x9) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }]);
}();
var _default = exports["default"] = new ClienteService();