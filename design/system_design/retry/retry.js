const axios = require('axios');

async function chargeCustomer(data, maxRetries = 3, delay = 1000) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await axios.post('https://api.payment.com/charge', data);
      console.log('Charge successful:', response.data);
      return response.data;
    } catch (error) {
      attempt++;
      console.warn(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt >= maxRetries) {
        console.error('All retries failed.');
        throw new Error('Charge failed after retries');
      }

      // Wait before next retry (exponential backoff could be better)
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

chargeCustomer({ userId: 123, amount: 25.00 })
  .then(result => console.log('Payment result:', result))
  .catch(err => console.error('Final Error:', err.message));

