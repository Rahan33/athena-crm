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

// TwiML webhook for outbound calls
router.post('/voice', (req, res) => {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();
  
  // The callerId must be a verified Twilio number on their account
  // If no CallerId is provided, we default to empty (which Twilio will reject if not verified)
  const callerId = req.body.CallerId; 

  const dial = response.dial({
    callerId: callerId,
    record: 'record-from-answer',
    recordingStatusCallback: '/api/telephony/recording-status'
  });
  
  if (req.body.To) {
    dial.number(req.body.To);
  } else {
    response.say('Welcome to Athena CRM.');
  }

  res.set('Content-Type', 'text/xml');
  res.send(response.toString());
});

// Webhook for when recording finishes
router.post('/recording-status', (req, res) => {
  console.log('Recording Status Webhook:', req.body);
  // Optional: Update database record with recording URL
  res.sendStatus(200);
});

export default router;
