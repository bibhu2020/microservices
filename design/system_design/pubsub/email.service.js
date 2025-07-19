const { createClient } = require('redis');
const sub = createClient();

(async () => {
  await sub.connect();

  await sub.subscribe('order_placed', (message) => {
    const order = JSON.parse(message);
    console.log(`📧 Sending confirmation email for order ${order.orderId}`);
  });
})();
