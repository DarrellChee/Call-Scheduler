const telephony = require('./telephony');
const tts = require('./tts');

// Use a TwiML voice endpoint if PUBLIC_HOST is set
const VOICE_ENDPOINT = process.env.PUBLIC_HOST
  ? `${process.env.PUBLIC_HOST}/voice`
  : null;

/**
 * Schedule a call, using Gemini TTS for realistic voice.
 * If PUBLIC_HOST is provided, Twilio will fetch TwiML from /voice;
 * otherwise, generate TwiML inline via Gemini API.
 *
 * @param {{ phoneNumber: string, userName?: string }} callData
 * @returns {string} id of the scheduled call
 */
async function scheduleCall(callData) {
  const id = Date.now().toString();

  if (VOICE_ENDPOINT) {
    // Twilio will fetch your /voice endpoint
    await telephony.makeCallUrl(callData.phoneNumber, VOICE_ENDPOINT);
  } else {
    // Inline TwiML generation using Gemini TTS
    const twiml = await tts.generateHelloTwiML(callData.userName);
    await telephony.makeCall(callData.phoneNumber, twiml);
  }

  return id;
}

function loadCalls() {
  // no-op for backward compatibility
}

module.exports = { scheduleCall, loadCalls };
