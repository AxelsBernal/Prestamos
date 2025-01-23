"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var UserSchema = new _mongoose["default"].Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    "default": Date.now
  },
  lastLogout: {
    type: Date,
    "default": null
  } // Campo para manejar el cierre de sesión
});
var _default = exports["default"] = _mongoose["default"].model("User", UserSchema, "User");