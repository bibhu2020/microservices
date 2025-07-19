const express = require('express');
const axios = require('axios');
const CircuitBreaker = require('./circuitbraker');

const app = express();
const PORT = 3000;

// Simulated request to an unstable API
async function unstableApiCall() {
  const res = await axios.get('https://srepoc-ai-classifier.azurewebsites.net/'); // use any real or test endpoint
  return res.data;
}

// Simulated flaky API
async function flakyApi() {
  if (Math.random() < 0.5) {
    throw new Error('Simulated service failure');
  }
  return { message: 'External API success' };
}

// Wrap the function in our custom circuit breaker
const breaker = new CircuitBreaker(unstableApiCall, {
  failureThreshold: 3,
  successThreshold: 2,
  timeout: 10000 // 10 seconds before retry
});

const breaker2 = new CircuitBreaker(flakyApi, {
  failureThreshold: 3,
  successThreshold: 2,
  timeout: 10000 // 10 seconds before retry
});

app.get('/data', async (req, res) => {
  try {
    const data = await breaker.call();
    res.json(data);
  } catch (err) {
    res.status(503).json({ message: 'Service unavailable', reason: err.message });
  }
});

app.get('/data2', async (req, res) => {
  try {
    const data = await breaker2.call();
    res.json(data);
  } catch (err) {
    res.status(503).json({ message: 'Service unavailable', reason: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`⚙️  Server running at http://localhost:${PORT}`);
});
