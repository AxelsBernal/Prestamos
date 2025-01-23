"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _User = _interopRequireDefault(require("../models/User.js"));
var register = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(userData) {
    var newUser;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          newUser = new _User["default"](userData);
          _context.next = 3;
          return newUser.save();
        case 3:
          return _context.abrupt("return", _context.sent);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function register(_x) {
    return _ref.apply(this, arguments);
  };
}();
var findByEmail = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(email) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _User["default"].findOne({
            email: email
          });
        case 2:
          return _context2.abrupt("return", _context2.sent);
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function findByEmail(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var findById = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(id) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _User["default"].findById(id);
        case 2:
          return _context3.abrupt("return", _context3.sent);
        case 3:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function findById(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var _default = exports["default"] = {
  register: register,
  findByEmail: findByEmail,
  findById: findById
};