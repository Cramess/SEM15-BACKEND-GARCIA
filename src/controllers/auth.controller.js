const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_dev_key';
const JWT_EXPIRES_IN = '7d';

exports.register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, email y contraseña son requeridos',
                data: null
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres',
                data: null
            });
        }

        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'El email ya está registrado',
                data: null
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ nombre, email, password: hashedPassword, rol: 'CUSTOMER' });

        const token = jwt.sign(
            { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            message: 'Usuario registrado correctamente',
            data: { token, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } }
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ success: false, message: 'Error al registrar usuario', data: null });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos',
                data: null
            });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas',
                data: null
            });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas',
                data: null
            });
        }

        const token = jwt.sign(
            { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            message: 'Login exitoso',
            data: { token, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ success: false, message: 'Error al iniciar sesión', data: null });
    }
};

exports.me = async (req, res) => {
    res.json({
        success: true,
        message: 'Usuario autenticado',
        data: req.user
    });
};
