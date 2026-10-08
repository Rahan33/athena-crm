import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// --- Web Product CRUD ---

router.get('/products', async (req, res) => {
  try {
    let products = await prisma.webProduct.findMany({ orderBy: { createdAt: 'desc' } });
    if (products.length === 0) {
      const seedProducts = [
        { name: 'Ultra HD Smart TV', price: 899.99, compareAtPrice: 999.99, stock: 15, category: 'Electronics', sku: 'TV-001', status: 'Active' },
        { name: 'Coffee Maker Pro', price: 149.00, stock: 50, category: 'Home Appliances', sku: 'CM-002', status: 'Active' }
      ];
      await prisma.webProduct.createMany({ data: seedProducts });
      products = await prisma.webProduct.findMany({ orderBy: { createdAt: 'desc' } });
    }
    res.json({ success: true, products });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/products', async (req, res) => {
  try {
    const product = await prisma.webProduct.create({ data: req.body });
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await prisma.webProduct.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await prisma.webProduct.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Web Orders ---
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.webOrder.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, orders });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mark Order as Shipped
router.put('/orders/:id/ship', async (req, res) => {
  try {
    const trackingNumber = 'TRK' + Math.floor(Math.random() * 100000000);
    const order = await prisma.webOrder.update({
      where: { id: req.params.id },
      data: { status: 'Shipped', trackingNumber }
    });
    res.json({ success: true, trackingNumber });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Simulate Public Website Checkout (Omnichannel Sync)
router.post('/checkout', async (req, res) => {
  const { customerName, customerEmail, shippingAddress, items, totalAmount } = req.body;
  try {
    const orderNumber = 'WEB-' + Math.floor(Math.random() * 1000000);
    
    // Create WebOrder and Deduct PosProduct Stock using a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Log WebOrder
      await tx.webOrder.create({
        data: {
          orderNumber,
          customerName,
          customerEmail,
          shippingAddress,
          totalAmount,
          items: JSON.stringify(items),
          status: 'Processing'
        }
      });
      
      // 2. Sync Omnichannel Inventory
      for (const item of items) {
        // If there's a matching POS product, deduct inventory
        const posProduct = await tx.posProduct.findUnique({ where: { sku: item.sku } });
        if (posProduct) {
          await tx.posProduct.update({
            where: { id: posProduct.id },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }
    });

    res.json({ success: true, orderNumber });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Seed some dummy items if needed
router.post('/seed-dummy-order', async (req, res) => {
  try {
     const orderNumber = 'WEB-' + Math.floor(Math.random() * 1000000);
     const order = await prisma.webOrder.create({
        data: {
          orderNumber,
          customerName: "Jane Doe",
          customerEmail: "jane.doe@example.com",
          shippingAddress: "123 Main St, New York, NY",
          totalAmount: 299.99,
          items: JSON.stringify([{name: "Wireless Headphones", quantity: 1, sku: "HW-101", price: 299.99}]),
        }
     });
     res.json({ success: true, order });
  } catch (err: any) {
     res.status(500).json({ success: false, error: err.message });
  }
});

export default router;