const express = require('express');
const router = express.Router();
const orderService = require('../../services/orderService');
const Order = require('../../db/models/Order');

router.post('/', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const result = await orderService.placeOrder(productId, quantity);
    res.status(200).json({ message: 'Order placed successfully', orderId: result.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  });

module.exports = router;
