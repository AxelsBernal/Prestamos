import { Router } from 'express';
import config from '../../../config/config.js';
import prestamoRoutes from './prestamo.routes.js';
import clienteRoutes from './cliente.routes.js';
import userRoutes from './user.routes.js';

const routerAPI = (app) => {
    const router = Router();
    const api = config.API_URL;

    app.use(api, router);

    router.use('/users', userRoutes);
    router.use('/prestamos', prestamoRoutes);
    router.use('/clientes', clienteRoutes);

    return router;
};

export default routerAPI;
