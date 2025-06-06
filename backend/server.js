require('dotenv').config();
const express = require('express');
const scheduler = require('./scheduler');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('frontend'));

scheduler.loadCalls();

app.post('/schedule-call', async (req, res) => {
  const { phoneNumber, topic, userName } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'phoneNumber is required' });
  }

  try {
    const id = await scheduler.scheduleCall({ phoneNumber, topic, userName });
    res.json({ status: 'initiated', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to initiate call' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
