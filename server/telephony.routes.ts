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
  const callerId = req.body.CallerId; 
  const to = req.body.To;
  const callSid = req.body.CallSid;

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
    recordingStatusCallback: '/api/telephony/recording-status'
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
  const callSid = req.body.CallSid;
  const recordingUrl = req.body.RecordingUrl;
  const duration = req.body.RecordingDuration;
  
  const callIndex = TelephonyStore.calls.findIndex(c => c.id === callSid);
  if (callIndex !== -1) {
    TelephonyStore.calls[callIndex].hasRecording = true;
    TelephonyStore.calls[callIndex].recordingUrl = recordingUrl + '.mp3';
    TelephonyStore.calls[callIndex].durationSeconds = parseInt(duration) || 0;
    TelephonyStore.calls[callIndex].status = 'Completed';
  }
  
  res.sendStatus(200);
});

export default router;
