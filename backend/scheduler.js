const telephony = require('./telephony');
const tts = require('./tts');

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
