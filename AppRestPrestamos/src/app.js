import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './config/config.js';
import routeAPI from './api/v1/routes/index.js';

const app = express();

// Configuración global de CORS
app.use(cors({
    origin: 'https://prestamos-0104.web.app', // Frontend en Firebase Hosting
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares generales
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas principales
const api = config.API_URL;
app.get(`${api}`, (req, res) => {
    res.send(
        `<h1>RESTful running in root</h1> <p>API documentation: <b>${api}/api-docs</b></p>`
    );
});

// Monta las rutas desde el archivo principal
routeAPI(app);

export default app;
