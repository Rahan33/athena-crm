import { Router } from 'express';

const router = Router();

// In-memory database for demo purposes
// In production, this goes to PostgreSQL/SQLite
export const interactionLogs: any[] = [
  {
    id: 'mock-1',
    type: 'whatsapp',
    user: 'John Doe',
    phone: '+91 98765 43210',
    intent: 'Order Tracking',
    status: 'Resolved',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    messages: [
      { sender: 'user', text: 'Where is my order? It was supposed to be delivered yesterday. Order ID #4492.' },
      { sender: 'ai', text: 'I apologize for the delay, John! I just checked your tracking. The delivery partner attempted delivery yesterday but couldn\'t reach your location. It is out for delivery again today and will reach you by 4:00 PM. Tracking: zho.ink/trck4492' }
    ]
  }
];

// Mock Order Database
const ordersDB: Record<string, string> = {
  '4492': 'Out for delivery today by 4:00 PM via Delhivery.',
  '1234': 'Shipped. Arriving in 2 days via FedEx.',
  '9999': 'Processing. Will ship tomorrow.'
};

// --------------------------------------------------------
// WEBHOOK: INBOUND WHATSAPP MESSAGES
// --------------------------------------------------------
router.post('/webhook/whatsapp', async (req, res) => {
  try {
    const { Body, From, ProfileName } = req.body;
    
    if (!Body || !From) {
      return res.status(400).send('Missing Body or From');
    }

    const userMessage = Body.toLowerCase();
    const userName = ProfileName || 'Customer';
    let aiResponse = '';
    let intent = 'General Query';

    // Simple AI Intent Routing & Response Generation
    if (userMessage.includes('order') || userMessage.includes('track')) {
      intent = 'Order Tracking';
      // Extract a 4-digit order number if it exists
      const match = userMessage.match(/\b\d{4}\b/);
      if (match && ordersDB[match[0]]) {
        aiResponse = `Hello ${userName}! Checking Order #${match[0]}... Status: ${ordersDB[match[0]]}`;
      } else if (match) {
        aiResponse = `Hello ${userName}! I couldn't find order #${match[0]} in our system. Can you double check the number?`;
      } else {
        aiResponse = `Hi ${userName}! Please provide your 4-digit order number so I can track it for you.`;
      }
    } else if (userMessage.includes('hello') || userMessage.includes('hi')) {
      aiResponse = `Hello ${userName}! I am Athena, the AI assistant. You can ask me to track your order, check business hours, or ask about our products.`;
    } else {
      aiResponse = `Thanks for reaching out! I'm an AI assistant. I didn't quite catch that. Try saying "Track my order #1234".`;
    }

    // Log the interaction
    interactionLogs.unshift({
      id: Date.now().toString(),
      type: 'whatsapp',
      user: userName,
      phone: From,
      intent,
      status: 'Resolved',
      timestamp: new Date().toISOString(),
      messages: [
        { sender: 'user', text: Body },
        { sender: 'ai', text: aiResponse }
      ]
    });

    // Generate TwiML XML Response
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${aiResponse}</Message>
</Response>`;

    res.set('Content-Type', 'text/xml');
    res.send(twiml);

  } catch (error) {
    console.error('WhatsApp Webhook Error:', error);
    res.status(500).send('Server Error');
  }
});

// --------------------------------------------------------
// WEBHOOK: INBOUND VOICE CALLS
// --------------------------------------------------------
router.post('/webhook/voice', (req, res) => {
  const { From } = req.body;
  
  // Log the interaction
  interactionLogs.unshift({
    id: Date.now().toString(),
    type: 'voice',
    user: 'Caller',
    phone: From || 'Unknown',
    intent: 'Inbound Call',
    status: 'In Progress',
    timestamp: new Date().toISOString(),
    messages: [
      { sender: 'user', text: '[Voice Call Initiated]' },
      { sender: 'ai', text: '[AI Greeting Played]' }
    ]
  });

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna-Neural">
    Hello! You have reached the Athena AI Voice Engine. 
    We are currently processing your request. Please leave a message or text us on WhatsApp for order tracking.
  </Say>
  <Record maxLength="20" />
</Response>`;

  res.set('Content-Type', 'text/xml');
  res.send(twiml);
});

// --------------------------------------------------------
// API: GET LOGS FOR DASHBOARD
// --------------------------------------------------------
router.get('/logs', (req, res) => {
  res.json(interactionLogs);
});


// --------------------------------------------------------
// API: ACCOUNT INTEGRATIONS (WHATSAPP BUSINESS)
// --------------------------------------------------------
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

router.get('/accounts', async (req, res) => {
  try {
    const accounts = await prisma.whatsAppAccount.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, accounts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/accounts/connect', async (req, res) => {
  const { phoneNumber, businessName, provider, apiKey } = req.body;
  try {
    let account = await prisma.whatsAppAccount.findUnique({ where: { phoneNumber } });
    if (account) {
      account = await prisma.whatsAppAccount.update({
        where: { phoneNumber },
        data: { businessName, provider, apiKey, status: 'Connected', webhookUrl: 'https://api.athena.com/webhooks/whatsapp' }
      });
    } else {
      account = await prisma.whatsAppAccount.create({
        data: {
          phoneNumber,
          businessName,
          provider,
          apiKey,
          status: 'Connected',
          webhookUrl: 'https://api.athena.com/webhooks/whatsapp'
        }
      });
    }
    res.json({ success: true, account });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/accounts/:id/disconnect', async (req, res) => {
  try {
    const account = await prisma.whatsAppAccount.update({
      where: { id: req.params.id },
      data: { status: 'Disconnected', apiKey: null }
    });
    res.json({ success: true, account });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
export default router;