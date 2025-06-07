const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const textToSpeech = require('@google-cloud/text-to-speech');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const ttsClient = new textToSpeech.TextToSpeechClient();

async function createChat() {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  return model.startChat();
}

async function generateResponse(chat, message) {
  const result = await chat.sendMessage(message || '');
  return result.response.text();
}

async function synthesizeSpeech(text, filePath) {
  const [response] = await ttsClient.synthesizeSpeech({
    input: { text },
    voice: { languageCode: 'en-US' },
    audioConfig: { audioEncoding: 'MP3' }
  });
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, response.audioContent, 'binary');
}

module.exports = { createChat, generateResponse, synthesizeSpeech };
