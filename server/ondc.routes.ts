import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Fetch ONDC Catalog (Combines WebProduct + OndcListing)
router.get('/catalog', async (req, res) => {
  try {
    const products = await prisma.webProduct.findMany({
      include: { ondcListing: true }
    });
    res.json({ success: true, products });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Toggle a product's ONDC status
router.post('/catalog/toggle', async (req, res) => {
  const { webProductId, publish, networkPrice } = req.body;
  
  try {
    let ondcListing = await prisma.ondcListing.findUnique({ where: { webProductId } });
    
    // Fallback networkPrice if not provided
    const product = await prisma.webProduct.findUnique({ where: { id: webProductId } });
    const price = networkPrice || product?.onlinePrice || 0;

    if (publish) {
      if (ondcListing) {
        ondcListing = await prisma.ondcListing.update({
          where: { webProductId },
          data: { isPublished: true, networkPrice: price }
        });
      } else {
        ondcListing = await prisma.ondcListing.create({
          data: { webProductId, isPublished: true, networkPrice: price, networkFee: 3.0 }
        });
      }
    } else {
      if (ondcListing) {
        ondcListing = await prisma.ondcListing.update({
          where: { webProductId },
          data: { isPublished: false }
        });
      }
    }
    
    res.json({ success: true, ondcListing });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch ONDC Orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.ondcOrder.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, orders });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Simulate an incoming ONDC Order
router.post('/simulate-order', async (req, res) => {
  try {
    const buyerApps = ["Paytm", "Pincode", "Magicpin", "Mystore", "Craftsvilla"];
    const buyerApp = buyerApps[Math.floor(Math.random() * buyerApps.length)];
    const networkOrderId = "ONDC-" + Math.floor(Math.random() * 1000000000);

    // Pick a random published product
    const published = await prisma.ondcListing.findMany({
      where: { isPublished: true },
      include: { webProduct: { include: { posProduct: true } } }
    });

    if (published.length === 0) {
      return res.status(400).json({ success: false, error: "No products published to ONDC. Publish a product first!" });
    }

    const randomOndc = published[Math.floor(Math.random() * published.length)];
    const qty = Math.floor(Math.random() * 2) + 1; // 1 or 2
    const itemTotal = randomOndc.networkPrice * qty;

    await prisma.$transaction(async (tx) => {
      // 1. Create ONDC Order
      await tx.ondcOrder.create({
        data: {
          networkOrderId,
          buyerApp,
          customerName: "Sneha " + Math.floor(Math.random() * 100),
          totalAmount: itemTotal,
          items: JSON.stringify([{
            name: randomOndc.webProduct.title,
            quantity: qty,
            price: randomOndc.networkPrice
          }])
        }
      });

      // 2. Deduct PosProduct stock (Omnichannel)
      if (randomOndc.webProduct.posProductId) {
        await tx.posProduct.update({
          where: { id: randomOndc.webProduct.posProductId },
          data: { stock: { decrement: qty } }
        });
      }
    });

    res.json({ success: true, networkOrderId, buyerApp });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
