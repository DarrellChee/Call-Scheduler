function generateHelloTwiML(name) {
  const message = `Hello ${name || ''}, this is your scheduled call.`;
  return `<Response><Say>${message}</Say></Response>`;
}

module.exports = { generateHelloTwiML };
