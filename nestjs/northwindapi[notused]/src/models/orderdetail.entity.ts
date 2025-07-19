import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('OrderDetails')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  OrderDetailID: number;

  OrderID: number;

  ProductID: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'OrderID' })
  Order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'ProductID' })
  Product: Product;

  @Column('decimal', { precision: 18, scale: 2 })
  UnitPrice: number;

  @Column('smallint')
  Quantity: number;

  @Column('real')
  Discount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
