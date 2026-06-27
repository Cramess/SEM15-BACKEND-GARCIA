const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: true }
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'categories', key: 'id' }
    }
}, {
    tableName: 'products',
    timestamps: true
});

// Asociaciones
Product.belongsTo(Category, { foreignKey: 'CategoryId', as: 'Category' });
Category.hasMany(Product, { foreignKey: 'CategoryId' });

module.exports = Product;