import { Router } from 'express';
import config from '../../../config/config';
import prestamoRoutes from './prestamo.routes';
import clienteRoutes from './cliente.routes';

const routerAPI = (app) => {
    const router = Router();
    const api = config.API_URL; // '/api/v1'

    app.use(api, router);

    // Rutas para préstamos
    router.use('/prestamos', prestamoRoutes);

    // Rutas para clientes
   router.use('/clientes', clienteRoutes);

    return router;
};

module.exports = routerAPI;
