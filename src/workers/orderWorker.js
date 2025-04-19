const amqp = require('amqplib');
const sequelize = require('../db/sequelize');
const Order = require('../db/models/Order');
require('dotenv').config();

async function connectAndConsume() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue('orderQueue', { durable: true });

  console.log('👷 Worker listening for orderQueue messages...');

  channel.consume('orderQueue', async (msg) => {
    if (msg !== null) {
      const orderData = JSON.parse(msg.content.toString());
      const { orderId, productId, quantity } = orderData;

      try {
        // Simulate processing (e.g., call vendor API)
        console.log(`📦 Processing Order ${orderId}...`);
        await processOrder(orderId);

        // Acknowledge on success
        channel.ack(msg);
      } catch (err) {
        console.error(`❌ Failed to process Order ${orderId}:`, err.message);

        // Requeue after delay (basic retry logic)
        setTimeout(() => {
          channel.nack(msg, false, true);
        }, 3000);
      }
    }
  });
}

async function processOrder(orderId) {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error('Order not found');

  // Simulate vendor confirmation
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate 1s delay

  // Simulate random failure
  if (Math.random() < 0.2) throw new Error('Vendor system error');

  order.status = 'success';
  await order.save();
  console.log(`✅ Order ${order.id} marked as success`);
}

connectAndConsume();
