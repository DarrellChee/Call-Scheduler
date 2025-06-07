const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleGenAI } = require('@google/genai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const voiceAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

async function createChat() {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  return model.startChat();
}

async function generateResponse(chat, message) {
  const result = await chat.sendMessage(message || '');
  return result.response.text();
}

async function synthesizeSpeech(text, filePath) {
  const response = await voiceAI.models.generateContent({
    model: 'gemini-2.0-flash-live-001',
    contents: text,
    config: { responseMimeType: 'audio/mp3' }
  });

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, response.audio, 'binary');
}

module.exports = { createChat, generateResponse, synthesizeSpeech };
