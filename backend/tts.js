const path = require('path');
const gemini = require('./gemini');

async function generateHelloTwiML(name, callSid, gather) {
  const message = `Hello ${name || ''}, this is your scheduled call.`;
  const fileName = `${callSid || 'hello'}-${Date.now()}.mp3`;
  const filePath = path.join(__dirname, 'audio', fileName);
  await gemini.synthesizeSpeech(message, filePath);
  const fileUrl = `${process.env.PUBLIC_HOST}/audio/${fileName}`;
  const gatherTag = gather
    ? '<Gather input="speech" action="/conversation" method="POST" timeout="5" />'
    : '';
  return `<Response><Play>${fileUrl}</Play>${gatherTag}</Response>`;
}

module.exports = { generateHelloTwiML };
