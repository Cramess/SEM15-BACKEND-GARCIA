const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json({ success: true, message: 'Categorías obtenidas', data: categories });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ success: false, message: 'Error al obtener categorías', data: null });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        if (!nombre) {
            return res.status(400).json({ success: false, message: 'El nombre es requerido', data: null });
        }
        const category = await Category.create({ nombre, descripcion });
        res.status(201).json({ success: true, message: 'Categoría creada', data: category });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ success: false, message: 'Error al crear categoría', data: null });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada', data: null });
        }
        const { nombre, descripcion } = req.body;
        await category.update({ nombre, descripcion });
        res.json({ success: true, message: 'Categoría actualizada', data: category });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar categoría', data: null });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada', data: null });
        }
        await category.destroy();
        res.json({ success: true, message: 'Categoría eliminada', data: null });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar categoría', data: null });
    }
};
