const telephony = require('./telephony');

const VOICE_ENDPOINT = `${process.env.PUBLIC_HOST}/voice`;

async function scheduleCall(callData) {
  const id = Date.now().toString();
  await telephony.makeCallUrl(callData.phoneNumber, VOICE_ENDPOINT);
  return id;
}

function loadCalls() {
  // no-op left for backward compatibility
}

module.exports = { scheduleCall, loadCalls };
