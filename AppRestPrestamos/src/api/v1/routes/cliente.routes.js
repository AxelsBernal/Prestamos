import { Router } from 'express';
import * as clienteController from '../controllers/cliente.controller .js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas para clientes
router.get('/', authMiddleware, clienteController.getAllClientes);
router.get('/:id', authMiddleware, clienteController.getClienteById);
router.post('/', authMiddleware, clienteController.createCliente);
router.put('/:id', authMiddleware, clienteController.updateCliente);
router.delete('/:id', authMiddleware, clienteController.deleteCliente);

export default router;
