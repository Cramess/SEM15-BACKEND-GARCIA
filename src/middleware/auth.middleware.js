const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_dev_key';

/**
 * Verifica que el request tenga un JWT válido en el header Authorization.
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Token requerido',
            data: null
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado',
            data: null
        });
    }
};

/**
 * Verifica que el usuario tenga uno de los roles permitidos.
 * Debe usarse después de verifyToken.
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para realizar esta acción',
                data: null
            });
        }
        next();
    };
};

module.exports = { verifyToken, requireRole };
