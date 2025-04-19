const { fetchAndSyncVendorStock } = require('../src/services/stockSync');
require('dotenv').config();
const app = require('../src/api/app');

const server = app.listen(3000, async () => {
  console.log('🔄 Syncing vendor stock...');
  await fetchAndSyncVendorStock();
  server.close();
});
