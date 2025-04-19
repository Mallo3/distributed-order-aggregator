const axios = require('axios');
const Product = require('../db/models/Product');

const VENDORS = ['vendorA', 'vendorB'];
const BASE_URL = 'http://localhost:3000';

async function fetchAndSyncVendorStock() {
    for (const vendor of VENDORS) {
      let attempts = 0;
      let success = false;
  
      while (attempts < 3 && !success) {
        try {
          const res = await axios.get(`${BASE_URL}/vendor/${vendor}/stock`);
          console.log(res)
          const stockList = res.data;
  
          for (const item of stockList) {
            const local = await Product.findByPk(item.id);
            if (local) {
              local.stock = item.stock;
              await local.save();
            } else {
              await Product.create(item);
            }
          }
  
          console.log(`✅ Synced stock from ${vendor}`);
          success = true;
        } catch (err) {
          attempts++;
          console.warn(`⚠️ Retry ${attempts} for ${vendor}:`, err.message);
          if (attempts === 3) {
            console.error(`❌ Failed to sync ${vendor} after 3 retries`);
          }
        }
      }
    }
}
  

module.exports = { fetchAndSyncVendorStock };
