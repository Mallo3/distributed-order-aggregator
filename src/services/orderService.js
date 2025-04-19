const sequelize = require('../db/sequelize');
const Product = require('../db/models/Product');
const Order = require('../db/models/Order');
const { publishToQueue } = require('../queue/rabbitmq');

async function placeOrder(productId, quantity) {
  return await sequelize.transaction(async (t) => {
    const product = await Product.findOne({ where: { id: productId }, transaction: t, lock: t.LOCK.UPDATE });

    if (!product) throw new Error('Product not found');
    if (product.stock < quantity) throw new Error('Insufficient stock');

    product.stock -= quantity;
    await product.save({ transaction: t });

    const order = await Order.create({ productId, quantity, status: 'pending' }, { transaction: t });

    // Publish to RabbitMQ queue
    await publishToQueue('orderQueue', {
      orderId: order.id,
      productId,
      quantity
    });

    return order;
  });
}

module.exports = { placeOrder };
