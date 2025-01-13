import { Router } from 'express';
import * as prestamoController from '../controllers/prestamo.controller';


const router = Router();

router.get('/', prestamoController.getAllPrestamos);
router.get('/:id', prestamoController.getPrestamoById);
router.post('/', prestamoController.createPrestamo);
router.put('/:id', prestamoController.updatePrestamo);
router.delete('/:id', prestamoController.deletePrestamo);
router.post('/:id/pagos', prestamoController.addPago); 
router.delete('/:id/pagos/:folio', prestamoController.deletePago);
router.put('/:id/pagos/:folio', prestamoController.editPago);
router.get('/pagos/cliente/:clienteId', prestamoController.getPagosPorCliente);
router.get('/summary/cliente/:clienteId', prestamoController.getLoanSummaryByClienteId);
router.get("/resumen/prestamos", prestamoController.obtenerResumenPrestamos);
router.get('/pagos/prestamo/:prestamoId', prestamoController.getPagosPorPrestamo);
router.get('/pagos/cliente/:clienteId/prestamo/:prestamoId', prestamoController.getPagosPorClienteYPrestamo);

export default router;
