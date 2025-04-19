const sequelize = require('../src/db/sequelize');
const Product = require('../src/db/models/Product');
const Order = require('../src/db/models/Order');

(async () => {
  try {
    await sequelize.sync({ force: true }); // Reset DB
    console.log('DB synced');

    // Seed products
    await Product.bulkCreate([
      { id: 1, name: 'Phone', stock: 50 },
      { id: 2, name: 'Laptop', stock: 30 },
    ]);

    console.log('Sample products added');
    process.exit();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
