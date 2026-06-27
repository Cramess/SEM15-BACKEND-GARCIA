const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const categoriesRouter = require('./routes/categories');

const app = express();

// Orígenes permitidos: localhost en desarrollo + dominio Vercel en producción
const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
].filter(Boolean); // elimina valores undefined/null

app.use(cors({
    origin: (origin, callback) => {
        // Permitir requests sin origin (Postman, mobile, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origen no permitido → ${origin}`));
    },
    credentials: true,
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({ message: 'API E-commerce funcionando' });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
