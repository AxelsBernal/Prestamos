import dotenv from 'dotenv';
dotenv.config();

export default {
    HOST: process.env.HOST || 'NO ENCONTRO VAR DE ENTORNO',
    PORT: process.env.PORT || 3020,
    API_URL: process.env.API_URL || '/api/v1',
    CONNECTION_STRING: process.env.CONNECTION_STRING || 'mongodb+srv://axsandovalbe:sABA020401HNENRXA3.@prestamos.alp3d.mongodb.net/',
    DATABASE: process.env.DATABASE || 'Prestamos',
    DB_USER: process.env.DB_USER || 'axsandovalbe',
    DB_PASSWORD: process.env.DB_PASSWORD || 'sABA020401HNENRXA3.',
    JWT_SECRET: process.env.JWT_SECRET || 'sABA020401HNENRXA3.',
};
