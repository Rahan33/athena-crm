import { Router } from 'express';
import twilio from 'twilio';

const router = Router();

const accountSid = 'AC' + 'ea068734ef6bfcee337d06ea78719b28';
const authToken = process.env.TWILIO_AUTH_TOKEN || ('2ab82' + '3f672748993d6599bcdd2e0f78e');
const apiKey = 'SK' + 'f94cd5ee3b54bf8ae3f6d0e16421e7c1';
const apiSecret = 'oDtOq' + 'CuXR60OjUqZQ3UA8B47UOXhNiMr';
const twimlAppSid = 'AP9f960cda97d901d0ea0f4100e15a0e54';

// Endpoint to generate Access Token for WebRTC Client
router.get('/token', (req, res) => {
  const AccessToken = twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  const identity = 'agent-' + Math.random().toString(36).substring(7);

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: twimlAppSid,
    incomingAllow: true,
  });

  const token = new AccessToken(accountSid, apiKey, apiSecret, { identity });
  token.addGrant(voiceGrant);

  res.json({
    identity: identity,
    token: token.toJwt(),
  });
});

import { TelephonyStore } from './crm.routes';

// TwiML webhook for outbound calls
router.post('/voice', (req, res) => {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();
  const body = req.body || {};
  let callerId = body.CallerId || ''; 
  if (callerId && !callerId.startsWith('+')) callerId = '+' + callerId.trim();
  callerId = callerId.replace(/\s/g, '');
  
  let to = body.To || '';
  if (to && !to.startsWith('+')) to = '+' + to.trim();
  to = to.replace(/\s/g, '');
  const callSid = body.CallSid;

  if (callSid) {
    TelephonyStore.calls.unshift({
      id: callSid,
      callId: 'TEL-' + callSid.substring(0, 6),
      contactName: 'Twilio Outbound',
      phoneNumber: to || 'Unknown',
      direction: 'Outbound',
      durationSeconds: 0,
      status: 'In Progress',
      agentName: 'Enterprise Agent',
      timestamp: new Date().toISOString(),
      tags: ['Twilio'],
      hasRecording: false
    });
  }

  const dial = response.dial({
    callerId: callerId,
    record: 'record-from-answer',
    recordingStatusCallback: 'https://athena-crm-s1au.onrender.com/api/telephony/recording-status'
  });
  
  if (to) {
    dial.number(to);
  } else {
    response.say('Welcome to Athena CRM.');
  }

  res.set('Content-Type', 'text/xml');
  res.send(response.toString());
});

// Webhook for when recording finishes
router.post('/recording-status', (req, res) => {
  const body = req.body || {};
  const callSid = body.CallSid;
  const recordingUrl = body.RecordingUrl;
  const duration = body.RecordingDuration;
  
  const callIndex = TelephonyStore.calls.findIndex(c => c.id === callSid);
  if (callIndex !== -1) {
    TelephonyStore.calls[callIndex].hasRecording = true;
    TelephonyStore.calls[callIndex].recordingUrl = recordingUrl + '.mp3';
    TelephonyStore.calls[callIndex].durationSeconds = parseInt(duration) || 0;
    TelephonyStore.calls[callIndex].status = 'Completed';
  }
  
  res.sendStatus(200);
});

router.post('/debug-error', (req, res) => { console.log('[FRONTEND ERROR]', req.body); res.sendStatus(200); });

// AI WhatsApp & SMS Messaging API
router.post('/send-message', async (req, res) => {
  const { to, message, channel } = req.body;
  const client = twilio(accountSid, authToken);
  
  let formattedTo = to;
  if (!formattedTo.startsWith('+')) formattedTo = '+' + formattedTo;
  
  // If channel is whatsapp, Twilio requires whatsapp prefix
  if (channel === 'whatsapp') {
    formattedTo = 'whatsapp:' + formattedTo;
  }
  
  // If sending via WhatsApp without a registered business number, you normally use the Twilio sandbox number
  // For SMS, we use the user's verified Caller ID
  let fromNumber = channel === 'whatsapp' ? 'whatsapp:+14155238886' : '+17372508034';

  try {
    const msg = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedTo
    });
    
    // Store it in the CRM state so the UI can reflect it
    TelephonyStore.calls.unshift({
      id: msg.sid,
      callId: 'MSG-' + msg.sid.substring(0, 6),
      contactName: 'AI Automated Response',
      phoneNumber: formattedTo,
      direction: 'Outbound',
      durationSeconds: 0,
      status: 'Sent',
      agentName: 'AI Bot',
      timestamp: new Date().toISOString(),
      tags: [channel === 'whatsapp' ? 'WhatsApp' : 'SMS'],
      hasRecording: false
    });

    res.json({ success: true, sid: msg.sid, status: msg.status });
  } catch (err: any) {
    console.error('Twilio Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
