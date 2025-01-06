import { Router } from 'express';
import * as clienteController from '../controllers/cliente.controller ';

const router = Router();

router.get('/', clienteController.getAllClientes);
router.get('/:id', clienteController.getClienteById);
router.post('/', clienteController.createCliente);
router.put('/:id', clienteController.updateCliente);
router.delete('/:id', clienteController.deleteCliente);

export default router;
