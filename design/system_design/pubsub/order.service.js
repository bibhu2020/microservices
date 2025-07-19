const { createClient } = require('redis');
const pub = createClient();

async function connectClient() {
  if (!pub.isOpen) {
    await pub.connect();
  }
}

async function place_order(orderId, userId, amount) {
  console.log(`💳 Placing order ${orderId} for user ${userId} with amount ${amount}`);

  const order = { orderId: orderId, userId: userId, amount: amount };
  await pub.publish('order_placed', JSON.stringify(order));

  console.log('📣 Order event published!');
}

async function main() {
  await connectClient();

  for (let i = 0; i < 10; i++) {
    await place_order(i, 2000 + i, 100 + i * 10);
  }

  await pub.quit();
}

main().catch(console.error);