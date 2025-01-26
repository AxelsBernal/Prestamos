"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var clienteController = _interopRequireWildcard(require("../controllers/cliente.controller.js"));
var _authMiddleware = require("../middlewares/auth.middleware.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var router = (0, _express.Router)();

// Rutas para clientes
router.get('/', _authMiddleware.authMiddleware, clienteController.getAllClientes);
router.get('/:id', _authMiddleware.authMiddleware, clienteController.getClienteById);
router.post('/', _authMiddleware.authMiddleware, clienteController.createCliente);
router.put('/:id', _authMiddleware.authMiddleware, clienteController.updateCliente);
router["delete"]('/:id', _authMiddleware.authMiddleware, clienteController.deleteCliente);
var _default = exports["default"] = router;