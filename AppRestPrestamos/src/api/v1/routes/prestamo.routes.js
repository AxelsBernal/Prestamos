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

export default router;
