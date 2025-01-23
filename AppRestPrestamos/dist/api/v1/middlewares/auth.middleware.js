"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authMiddleware = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _User = _interopRequireDefault(require("../models/User.js"));
var authMiddleware = exports.authMiddleware = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var authHeader, token, decoded, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          authHeader = req.headers.authorization;
          if (authHeader) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", res.status(401).json({
            message: "No se proporcionó un token"
          }));
        case 3:
          token = authHeader.split(" ")[1];
          _context.prev = 4;
          decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET); // Buscar al usuario en la base de datos
          _context.next = 8;
          return _User["default"].findById(decoded.userId);
        case 8:
          user = _context.sent;
          if (user) {
            _context.next = 11;
            break;
          }
          return _context.abrupt("return", res.status(404).json({
            message: "Usuario no encontrado"
          }));
        case 11:
          if (!(user.lastLogout && new Date(decoded.iat * 1000) < user.lastLogout)) {
            _context.next = 13;
            break;
          }
          return _context.abrupt("return", res.status(401).json({
            message: "Token inválido o expirado"
          }));
        case 13:
          req.user = decoded;
          next();
          _context.next = 20;
          break;
        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](4);
          return _context.abrupt("return", res.status(401).json({
            message: "Token inválido"
          }));
        case 20:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[4, 17]]);
  }));
  return function authMiddleware(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();