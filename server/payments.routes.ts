import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Fetch all transactions
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await prisma.paymentTransaction.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, transactions });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Refund a transaction
router.post('/transactions/:id/refund', async (req, res) => {
  try {
    const transaction = await prisma.paymentTransaction.update({
      where: { id: req.params.id },
      data: { status: 'Refunded' }
    });
    res.json({ success: true, transaction });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch all payment links
router.get('/links', async (req, res) => {
  try {
    const links = await prisma.paymentLink.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, links });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create a new payment link
router.post('/links', async (req, res) => {
  const { amount, description } = req.body;
  try {
    const linkId = 'plink_' + Math.floor(Math.random() * 100000000);
    const link = await prisma.paymentLink.create({
      data: {
        linkId,
        amount: parseFloat(amount),
        description,
        url: `https://pay.athena.com/checkout/${linkId}`
      }
    });
    res.json({ success: true, link });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Simulate a random incoming payment
router.post('/simulate', async (req, res) => {
  try {
    const sources = ["POS Terminal", "eCommerce Checkout", "ONDC Network", "Payment Link"];
    const names = ["Alice Walker", "Bob Smith", "Charlie Davis", "Diana Prince", "Ethan Hunt"];
    
    const transactionId = 'txn_' + Math.floor(Math.random() * 1000000000);
    const amount = parseFloat((Math.random() * 500 + 10).toFixed(2));
    
    const transaction = await prisma.paymentTransaction.create({
      data: {
        transactionId,
        amount,
        source: sources[Math.floor(Math.random() * sources.length)],
        customerName: names[Math.floor(Math.random() * names.length)],
        status: "Success"
      }
    });

    res.json({ success: true, transaction });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
