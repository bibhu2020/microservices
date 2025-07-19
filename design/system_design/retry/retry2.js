const axiosRetry = require('axios-retry');
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

axios.post('https://api.payment.com/charge', { userId: 123, amount: 25.00 })
  .then(res => console.log('Success:', res.data))
  .catch(err => console.error('Failed after retries:', err.message));
