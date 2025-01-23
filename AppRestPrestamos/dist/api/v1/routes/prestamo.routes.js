"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var prestamoController = _interopRequireWildcard(require("../controllers/prestamo.controller"));
var _authMiddleware = require("../middlewares/auth.middleware.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
// Importar el middleware

var router = (0, _express.Router)();
/************************************ PRESTAMOS ***************************************************** */
router.get('/', _authMiddleware.authMiddleware, prestamoController.getAllPrestamos); //Obtener todos los prestamis
router.get('/:id', _authMiddleware.authMiddleware, prestamoController.getPrestamoById); //Obtener prestamo por id
router.post('/', _authMiddleware.authMiddleware, prestamoController.createPrestamo); //agregar un prestamo 
router.put('/:id', _authMiddleware.authMiddleware, prestamoController.updatePrestamo); // Modificar un prestamo  
router["delete"]('/:id', _authMiddleware.authMiddleware, prestamoController.deletePrestamo); // Eliminar un prestamo 
/** ************************************************************************************************* */

/************************************** PRINCIPALES DE PAGO ********************************************* */
router.post('/:id/pagos', _authMiddleware.authMiddleware, prestamoController.addPago); // Agregar un pago a un prestamo
router["delete"]('/:id/pagos/:folio', _authMiddleware.authMiddleware, prestamoController.deletePago); // Eliminar Pago
router.put('/:id/pagos/:folio', _authMiddleware.authMiddleware, prestamoController.editPago); // Modificar Pago
/** ************************************************************************************************* */

router.get('/pagos/cliente/:clienteId', _authMiddleware.authMiddleware, prestamoController.getPagosPorCliente); //Obtener pagos por Cliente
router.get('/summary/cliente/:clienteId', _authMiddleware.authMiddleware, prestamoController.getLoanSummaryByClienteId); // Obtener un resumen de los préstamos asociados a un cliente específico
router.get('/resumen/prestamos', _authMiddleware.authMiddleware, prestamoController.obtenerResumenPrestamos); //Resumenes de los prestamos 
router.get('/pagos/prestamo/:prestamoId', _authMiddleware.authMiddleware, prestamoController.getPagosPorPrestamo); // Obtener pagos de un prestamo especifico 
router.get('/pagos/cliente/:clienteId/prestamo/:prestamoId', _authMiddleware.authMiddleware, prestamoController.getPagosPorClienteYPrestamo); // Obtener pagos de un prestamo y cliente 
router.get('/pagos/All', _authMiddleware.authMiddleware, prestamoController.getAllPagos);
var _default = exports["default"] = router;