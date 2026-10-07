import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Fetch all available products for POS
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.posProduct.findMany({
      where: { stock: { gt: 0 } }
    });
    res.json({ success: true, products });
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