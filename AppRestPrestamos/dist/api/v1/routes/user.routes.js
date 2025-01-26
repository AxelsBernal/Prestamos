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

// Rutas de usuarios
router.post('/register', _UserController.registerUser);
router.post('/login', _UserController.loginUser);
router.get('/me', _authMiddleware.authMiddleware, _UserController.getCurrentUser);
router.post('/logout', _authMiddleware.authMiddleware, _UserController.logoutUser);
var _default = exports["default"] = router;