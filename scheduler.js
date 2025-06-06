const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const telephony = require('./telephony');
const tts = require('./tts');

const DATA_FILE = path.join(__dirname, 'calls.json');
let scheduledCalls = {};

function loadCalls() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      scheduledCalls = JSON.parse(fs.readFileSync(DATA_FILE));
    } catch (err) {
      console.error('Failed to parse calls.json', err);
      scheduledCalls = {};
    }
  }
}

function saveCalls() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(scheduledCalls, null, 2));
}

function scheduleCall(callData) {
  const id = Date.now().toString();
  const date = new Date(callData.callTime);
  const cronExp = `${date.getUTCSeconds()} ${date.getUTCMinutes()} ${date.getUTCHours()} ${date.getUTCDate()} ${date.getUTCMonth() + 1} *`;

  const job = cron.schedule(cronExp, async () => {
    try {
      const twiml = tts.generateHelloTwiML(callData.userName);
      await telephony.makeCall(callData.phoneNumber, twiml);
    } catch (err) {
      console.error('Error making call:', err);
    }
    job.stop();
    delete scheduledCalls[id];
    saveCalls();
  }, { timezone: 'UTC' });

  scheduledCalls[id] = { ...callData, cronExp };
  saveCalls();
  return id;
}

module.exports = { scheduleCall, loadCalls };
