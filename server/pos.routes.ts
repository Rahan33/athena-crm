import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Fetch all available products for POS
router.get('/products', async (req, res) => {
  try {
    let products = await prisma.posProduct.findMany();
    if (products.length === 0) {
      // Seed initial products
      const seedProducts = [
        { name: 'Wireless Noise-Cancelling Headphones', price: 299.99, stock: 45, category: 'Electronics', sku: 'HW-101', barcode: '101' },
        { name: 'Ergonomic Office Chair', price: 199.50, stock: 12, category: 'Furniture', sku: 'FC-202', barcode: '202' }
      ];
      await prisma.posProduct.createMany({ data: seedProducts });
      products = await prisma.posProduct.findMany();
    }
    res.json({ success: true, products });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// Create a new POS Product
router.post('/products', async (req, res) => {
  try {
    const product = await prisma.posProduct.create({
      data: req.body
    });
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update an existing POS Product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await prisma.posProduct.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete a POS Product
router.delete('/products/:id', async (req, res) => {
  try {
    await prisma.posProduct.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Process a POS Checkout
router.post('/checkout', async (req, res) => {
  const { items, paymentType, subtotal, tax, total, cashierId } = req.body;
  
  try {
    const receiptId = 'REC-' + Math.floor(Math.random() * 1000000);
    
    // Create the order using Prisma Transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.posOrder.create({
        data: {
          receiptId,
          cashierId: cashierId || 'SYSTEM',
          subtotal,
          tax,
          total,
          paymentType,
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.cartQty,
              priceAtSale: item.price
            }))
          }
        }
      });
      
      // Deduct inventory
      for (const item of items) {
        await tx.posProduct.update({
          where: { id: item.id },
          data: { stock: { decrement: item.cartQty } }
        });
      }
      
      return newOrder;
    });

    res.json({ success: true, receiptId: order.receiptId });
  } catch (err: any) {
    console.error('POS Checkout Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;