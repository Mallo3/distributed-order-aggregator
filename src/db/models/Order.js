const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  productId: { type: DataTypes.INTEGER },
  quantity: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING }, // pending, success, failed
}, { tableName: 'orders', timestamps: true });

module.exports = Order;
