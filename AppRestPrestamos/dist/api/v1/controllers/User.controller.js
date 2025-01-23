"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUser = exports.logoutUser = exports.loginUser = exports.getCurrentUser = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _User = _interopRequireDefault(require("../models/User.js"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _config = _interopRequireDefault(require("../../../config/config.js"));
var _userService = _interopRequireDefault(require("../services/user.service.js"));
var _excluded = ["password"];
var loginUser = exports.loginUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, email, password, user, isPasswordValid, token;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, email = _req$body.email, password = _req$body.password;
          _context.next = 4;
          return _User["default"].findOne({
            email: email
          });
        case 4:
          user = _context.sent;
          if (user) {
            _context.next = 7;
            break;
          }
          return _context.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));
        case 7:
          _context.next = 9;
          return _bcryptjs["default"].compare(password, user.password);
        case 9:
          isPasswordValid = _context.sent;
          if (isPasswordValid) {
            _context.next = 12;
            break;
          }
          return _context.abrupt("return", res.status(401).json({
            message: 'Invalid credentials'
          }));
        case 12:
          token = _jsonwebtoken["default"].sign({
            userId: user._id,
            email: user.email
          }, _config["default"].JWT_SECRET, {
            expiresIn: '1h'
          });
          res.status(200).json({
            token: token,
            message: 'Login successful'
          });
          _context.next = 20;
          break;
        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          console.error('Error during login:', _context.t0);
          res.status(500).json({
            message: 'Internal server error'
          });
        case 20:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 16]]);
  }));
  return function loginUser(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Registro de usuario
var registerUser = exports.registerUser = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var _req$body2, nombre, email, password, existingUser, salt, hashedPassword, newUser;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, nombre = _req$body2.nombre, email = _req$body2.email, password = _req$body2.password; // Verificar si el usuario ya existe
          _context2.next = 4;
          return _User["default"].findOne({
            email: email
          });
        case 4:
          existingUser = _context2.sent;
          if (!existingUser) {
            _context2.next = 7;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            message: "El email ya está registrado"
          }));
        case 7:
          _context2.next = 9;
          return _bcryptjs["default"].genSalt(10);
        case 9:
          salt = _context2.sent;
          _context2.next = 12;
          return _bcryptjs["default"].hash(password, salt);
        case 12:
          hashedPassword = _context2.sent;
          // Crear usuario
          newUser = new _User["default"]({
            nombre: nombre,
            email: email,
            password: hashedPassword
          });
          _context2.next = 16;
          return newUser.save();
        case 16:
          res.status(201).json({
            message: "Usuario registrado exitosamente"
          });
          _context2.next = 23;
          break;
        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](0);
          console.error("Error al registrar usuario:", _context2.t0);
          res.status(500).json({
            message: "Error interno del servidor"
          });
        case 23:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 19]]);
  }));
  return function registerUser(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// Obtener información del usuario actual

var getCurrentUser = exports.getCurrentUser = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var userId, user, _user$toObject, password, userWithoutPassword;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          // `req.user` es añadido por el middleware de autenticación
          userId = req.user.userId;
          _context3.next = 4;
          return _userService["default"].findById(userId);
        case 4:
          user = _context3.sent;
          if (user) {
            _context3.next = 7;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            message: "Usuario no encontrado"
          }));
        case 7:
          // Opcional: Ocultar campos sensibles
          _user$toObject = user.toObject(), password = _user$toObject.password, userWithoutPassword = (0, _objectWithoutProperties2["default"])(_user$toObject, _excluded);
          res.status(200).json(userWithoutPassword);
          _context3.next = 15;
          break;
        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          console.error("Error en getCurrentUser:", _context3.t0);
          res.status(500).json({
            message: "Error interno del servidor"
          });
        case 15:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 11]]);
  }));
  return function getCurrentUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

// Cerrar sesión del usuario
var logoutUser = exports.logoutUser = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var userId;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = req.user.userId; // Actualizar el campo lastLogout del usuario
          _context4.next = 4;
          return _User["default"].findByIdAndUpdate(userId, {
            lastLogout: new Date()
          });
        case 4:
          res.status(200).json({
            message: "Logout successful. Token invalidated."
          });
          _context4.next = 11;
          break;
        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error("Error during logout:", _context4.t0);
          res.status(500).json({
            message: "Internal server error"
          });
        case 11:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 7]]);
  }));
  return function logoutUser(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();