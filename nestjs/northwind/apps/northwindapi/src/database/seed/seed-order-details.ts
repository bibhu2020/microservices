import { DataSource } from 'typeorm';
import { OrderDetail } from '@bpm/data/models/orderdetail.entity';
import { Order } from '@bpm/data/models/order.entity';
import { Product } from '@bpm/data/models/product.entity';

export async function orderDetailSeed(dataSource: DataSource) {
  const orderRepo = dataSource.getRepository(Order);
  const productRepo = dataSource.getRepository(Product);
  const orderDetailRepo = dataSource.getRepository(OrderDetail);

  const existing = await orderDetailRepo.count();
  if (existing > 0) {
    console.log('🛑 OrderDetail already exist. Skipping...');
    return;
  }

  const orders = await orderRepo.find();
  const products = await productRepo.find();

  if (orders.length === 0 || products.length === 0) {
    throw new Error(
      '🛑 Orders or Products must be seeded before OrderDetails.',
    );
  }

  // const orders = await orderRepo.find({ take: 10 }); // adjust as needed
  // const products = await productRepo.find({ take: 30 });

  const orderDetails: OrderDetail[] = [];

  for (let i = 0; i < 20; i++) {
    const order = orders[Math.floor(Math.random() * orders.length)];
    const product = products[Math.floor(Math.random() * products.length)];

    const detail = new OrderDetail();
    detail.Order = order;
    detail.OrderID = order.OrderID;
    detail.Product = product;
    detail.ProductID = product.ProductID;
    detail.UnitPrice = parseFloat((Math.random() * 100 + 10).toFixed(2));
    detail.Quantity = Math.floor(Math.random() * 10) + 1;
    detail.Discount = parseFloat((Math.random() * 0.5).toFixed(2));

    orderDetails.push(detail);
  }

  await orderDetailRepo.save(orderDetails);
  console.log('✅ Seeded OrderDetails with realistic product lines.');
}
