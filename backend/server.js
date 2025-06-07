require('dotenv').config();
const express = require('express');
const path = require('path');
const scheduler = require('./scheduler');
const gemini = require('./gemini');

const sessions = {}; // callSid -> { chat, turns }

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for Twilio webhooks
app.use(express.static('frontend'));
app.use('/audio', express.static(path.join(__dirname, 'audio')));

scheduler.loadCalls();

app.post('/schedule-call', async (req, res) => {
  const { phoneNumber, topic, userName } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'phoneNumber is required' });
  }

  try {
    const id = await scheduler.scheduleCall({ phoneNumber, topic, userName });
    res.json({ status: 'initiated', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to initiate call' });
  }
});

app.post('/voice', async (req, res) => {
  const callSid = req.body.CallSid;
  const chat = await gemini.createChat();
  sessions[callSid] = { chat, turns: 0 };
  const fileName = `${callSid}-welcome.mp3`;
  const filePath = path.join(__dirname, 'audio', fileName);
  await gemini.synthesizeSpeech('Hello, how can I help you today?', filePath);
  const fileUrl = `${process.env.PUBLIC_HOST}/audio/${fileName}`;
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Play>${fileUrl}</Play>\n  <Gather input="speech" action="/conversation" method="POST" timeout="5" />\n</Response>`;
  res.type('text/xml').send(twiml);
});

app.post('/conversation', async (req, res) => {
  const callSid = req.body.CallSid;
  const userText = req.body.SpeechResult || '';
  if (!sessions[callSid]) {
    sessions[callSid] = { chat: await gemini.createChat(), turns: 0 };
  }
  const session = sessions[callSid];
  session.turns += 1;
  const responseText = await gemini.generateResponse(session.chat, userText);

  const fileName = `${callSid}-${Date.now()}.mp3`;
  const filePath = path.join(__dirname, 'audio', fileName);
  await gemini.synthesizeSpeech(responseText, filePath);
  const fileUrl = `${process.env.PUBLIC_HOST}/audio/${fileName}`;

  const shouldHangup = /goodbye/i.test(userText) || session.turns >= 5;
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Play>${fileUrl}</Play>\n  ${shouldHangup ? '<Hangup/>' : '<Gather input="speech" action="/conversation" method="POST" timeout="5" />'}\n</Response>`;
  if (shouldHangup) delete sessions[callSid];
  res.type('text/xml').send(twiml);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
