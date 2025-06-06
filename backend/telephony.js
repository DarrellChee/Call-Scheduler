require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

const client = twilio(accountSid, authToken);

async function makeCall(to, twiml) {
  if (!accountSid || !authToken || !fromNumber) {
    console.error('Twilio credentials are not set');
    return;
  }
  return client.calls.create({
    to,
    from: fromNumber,
    twiml
  });
}

module.exports = { makeCall };
