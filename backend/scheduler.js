const telephony = require('./telephony');

const VOICE_ENDPOINT = `${process.env.PUBLIC_HOST}/voice`;

async function scheduleCall(callData) {
  const id = Date.now().toString();
  await telephony.makeCallUrl(callData.phoneNumber, VOICE_ENDPOINT);
async function scheduleCall(callData) {
  const id = Date.now().toString();
  const twiml = tts.generateHelloTwiML(callData.userName);
  await telephony.makeCall(callData.phoneNumber, twiml);
  return id;
}

function loadCalls() {
  // no-op left for backward compatibility
}

module.exports = { scheduleCall, loadCalls };
