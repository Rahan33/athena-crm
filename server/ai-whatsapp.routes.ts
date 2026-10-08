import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import pino from 'pino';

const router = Router();
const prisma = new PrismaClient();

// --------------------------------------------------------
// IN-MEMORY STATE FOR WHATSAPP WEB CONNECTION
// --------------------------------------------------------
let waSocket: any = null;
let currentQR: string | null = null;
let connectionStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
let activeUserNumber: string | null = null;

// Fake interaction logs for the UI dashboard (same as before)
let interactionLogs = [
  { customerName: "Sarah Jenkins", channel: "WhatsApp", timestamp: new Date(Date.now() - 120000).toISOString(), inboundMessage: "Hey, do you have any ergonomic chairs in stock?", aiResponse: "Hello Sarah! Yes, we have the 'Ergonomic Office Chair' in stock for $199.50. Would you like me to reserve one for you?" },
  { customerName: "Michael Chang", channel: "WhatsApp", timestamp: new Date(Date.now() - 360000).toISOString(), inboundMessage: "My order #1024 hasn't arrived yet.", aiResponse: "Hi Michael, let me check that for you. It looks like Order #1024 is out for delivery today and should arrive by 5 PM." }
];

async function startWhatsAppWeb() {
  if (connectionStatus === 'connected' || connectionStatus === 'connecting') return;
  
  connectionStatus = 'connecting';
  currentQR = null;

  try {
    const { state, saveCreds } = await useMultiFileAuthState('whatsapp_auth_info');
    const { version } = await fetchLatestBaileysVersion();

    waSocket = makeWASocket({
      version,
      logger: pino({ level: 'silent' }) as any,
      printQRInTerminal: false,
      auth: state,
      generateHighQualityLinkPreview: true,
    });

    waSocket.ev.on('creds.update', saveCreds);

    waSocket.ev.on('connection.update', async (update: any) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        // Generate QR Data URL to send to frontend
        currentQR = await QRCode.toDataURL(qr);
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('WhatsApp connection closed. Reconnecting:', shouldReconnect);
        connectionStatus = 'disconnected';
        currentQR = null;
        waSocket = null;
        if (shouldReconnect) {
          startWhatsAppWeb();
        }
      } else if (connection === 'open') {
        console.log('WhatsApp Web Connected!');
        connectionStatus = 'connected';
        currentQR = null;
        activeUserNumber = waSocket?.user?.id?.split(':')[0] || 'Unknown';
      }
    });

    waSocket.ev.on('messages.upsert', async (m: any) => {
      const msg = m.messages[0];
      if (!msg.message || msg.key.fromMe) return;

      const senderNumber = msg.key.remoteJid?.split('@')[0];
      const textMessage = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';

      if (textMessage) {
        // Mock AI Response
        const aiResponse = `(Automated AI Reply) Thanks for reaching out! We received your message: "${textMessage}". Our team will follow up soon!`;

        // Update Dashboard Logs
        interactionLogs.unshift({
          customerName: "WhatsApp User (" + senderNumber + ")",
          channel: "WhatsApp",
          timestamp: new Date().toISOString(),
          inboundMessage: textMessage,
          aiResponse: aiResponse
        });

        // Send actual reply via WhatsApp Web
        if (waSocket && connectionStatus === 'connected') {
          try {
            await waSocket.sendMessage(msg.key.remoteJid!, { text: aiResponse });
          } catch (err) {
            console.error('Error sending reply via Baileys:', err);
          }
        }
      }
    });

  } catch (err) {
    console.error("Error starting WhatsApp Web:", err);
    connectionStatus = 'disconnected';
  }
}

// --------------------------------------------------------
// API ENDPOINTS FOR FRONTEND INTEGRATION
// --------------------------------------------------------

router.get('/web-status', async (req, res) => {
  res.json({
    success: true,
    status: connectionStatus,
    qrCode: currentQR,
    activeNumber: activeUserNumber
  });
});

router.post('/web-connect', async (req, res) => {
  if (connectionStatus === 'disconnected') {
    startWhatsAppWeb();
  }
  res.json({ success: true, message: "Connection started" });
});

router.post('/web-disconnect', async (req, res) => {
  if (waSocket) {
    waSocket.logout();
    waSocket = null;
  }
  connectionStatus = 'disconnected';
  currentQR = null;
  res.json({ success: true, message: "Logged out" });
});

router.get('/logs', (req, res) => {
  res.json(interactionLogs);
});

// Original Meta/Twilio Accounts DB Routes (kept for backward compatibility)
router.get('/accounts', async (req, res) => {
  try {
    const accounts = await prisma.whatsAppAccount.findMany({ orderBy: { createdAt: 'desc' } });
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
      account = await prisma.whatsAppAccount.create({ data: { phoneNumber, businessName, provider, apiKey, status: 'Connected', webhookUrl: 'https://api.athena.com/webhooks/whatsapp' } });
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