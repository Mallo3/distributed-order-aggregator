const amqp = require('amqplib');
require('dotenv').config();

let channel;

async function connect() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await conn.createChannel();
  await channel.assertQueue('orderQueue', { durable: true });
  console.log('📦 Connected to RabbitMQ');
}

async function publishToQueue(queue, data) {
  if (!channel) await connect();
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
}

module.exports = { connect, publishToQueue };
