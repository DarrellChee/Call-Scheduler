require('dotenv').config();
const express = require('express');
const scheduler = require('./scheduler');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

scheduler.loadCalls();

app.post('/schedule-call', (req, res) => {
  const { phoneNumber, callTime, topic, userName } = req.body;

  if (!phoneNumber || !callTime) {
    return res.status(400).json({ error: 'phoneNumber and callTime are required' });
  }

  try {
    const id = scheduler.scheduleCall({ phoneNumber, callTime, topic, userName });
    res.json({ status: 'scheduled', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to schedule call' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
