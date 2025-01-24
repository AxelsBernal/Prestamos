import { Router } from 'express';
import * as prestamoController from '../controllers/prestamo.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, prestamoController.getAllPrestamos);  //Obtener todos los prestamis
router.get('/:id', authMiddleware, prestamoController.getPrestamoById);  //Obtener prestamo por id
router.post('/', authMiddleware, prestamoController.createPrestamo); //agregar un prestamo 
router.put('/:id', authMiddleware, prestamoController.updatePrestamo); // Modificar un prestamo  
router.delete('/:id', authMiddleware, prestamoController.deletePrestamo); // Eliminar un prestamo 
/** ************************************************************************************************* */

/************************************** PRINCIPALES DE PAGO ********************************************* */
router.post('/:id/pagos', authMiddleware, prestamoController.addPago); // Agregar un pago a un prestamo
router.delete('/:id/pagos/:folio', authMiddleware, prestamoController.deletePago); // Eliminar Pago
router.put('/:id/pagos/:folio', authMiddleware, prestamoController.editPago);  // Modificar Pago
/** ************************************************************************************************* */

router.get('/pagos/cliente/:clienteId', authMiddleware, prestamoController.getPagosPorCliente); //Obtener pagos por Cliente
router.get('/summary/cliente/:clienteId', authMiddleware, prestamoController.getLoanSummaryByClienteId); // Obtener un resumen de los préstamos asociados a un cliente específico
router.get('/resumen/prestamos', authMiddleware, prestamoController.obtenerResumenPrestamos); //Resumenes de los prestamos 
router.get('/pagos/prestamo/:prestamoId', authMiddleware, prestamoController.getPagosPorPrestamo);  // Obtener pagos de un prestamo especifico 
router.get('/pagos/cliente/:clienteId/prestamo/:prestamoId', authMiddleware, prestamoController.getPagosPorClienteYPrestamo); // Obtener pagos de un prestamo y cliente 
router.get('/pagos/All', authMiddleware, prestamoController.getAllPagos);


export default router;
