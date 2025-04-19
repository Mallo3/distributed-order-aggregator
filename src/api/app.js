const express = require('express');
require('dotenv').config();

const orderRoutes = require('./routes/order');
const vendorRoutes = require('./routes/vendor');

const app = express();
app.use(express.json());

app.use('/order', orderRoutes);
app.use('/vendor', vendorRoutes);

module.exports = app;
