const app = require('./src/api/app');
const { connect } = require('./src/queue/rabbitmq');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connect();
  console.log(`🚀 Server running on port ${PORT}`);
});
