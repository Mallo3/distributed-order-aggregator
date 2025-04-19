
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  name: { type: DataTypes.STRING },
  stock: { type: DataTypes.INTEGER },
}, { tableName: 'products', timestamps: false });

module.exports = Product;
