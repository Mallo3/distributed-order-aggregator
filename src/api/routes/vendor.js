const express = require('express');
const router = express.Router();

// Mock vendor data
const vendorStock = {
  vendorA: [
    { id: 1, name: 'Phone', stock: 100 },
    { id: 2, name: 'Laptop', stock: 50 },
  ],
  vendorB: [
    { id: 1, name: 'Phone', stock: 80 },
    { id: 2, name: 'Laptop', stock: 60 },
  ],
};

router.get('/:vendorId/stock', (req, res) => {
  const { vendorId } = req.params;
  const data = vendorStock[vendorId];
  if (!data) return res.status(404).json({ error: 'Vendor not found' });
  res.json(data);
});

// router.get('/:vendorId/stock', (req, res) => {
//     const { vendorId } = req.params;
  
//     // Simulate failure 20% of the time
//     if (Math.random() < 0.2) {
//       return res.status(503).json({ error: 'Vendor temporarily unavailable' });
//     }
  
//     const data = vendorStock[vendorId];
//     if (!data) return res.status(404).json({ error: 'Vendor not found' });
//     res.json(data);
//   });
  

module.exports = router;
