"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _UserController = require("../controllers/User.controller.js");
var _authMiddleware = require("../middlewares/auth.middleware.js");
var router = _express["default"].Router();

// Ruta para registrar usuario
router.post("/register", _UserController.registerUser);

// Ruta para iniciar sesión
router.post("/login", _UserController.loginUser);

// Ruta para obtener información del usuario actual
router.get("/me", _authMiddleware.authMiddleware, _UserController.getCurrentUser);

// Ruta para cerrar sesión
router.post("/logout", _authMiddleware.authMiddleware, _UserController.logoutUser);
var _default = exports["default"] = router;