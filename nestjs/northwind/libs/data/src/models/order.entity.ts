import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Employee } from './employee.entity';
import { Shipper } from './shipper.entity';
import { OrderDetail } from './orderdetail.entity';

@Entity('Orders')
export class Order {
  @PrimaryGeneratedColumn()
  OrderID: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'CustomerID' })
  Customer: Customer;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'EmployeeID' })
  Employee: Employee;

  @OneToMany(() => OrderDetail, (OrderDetail) => OrderDetail.Order)
  OrderDetails: OrderDetail[];

  @Column({ type: 'timestamp', nullable: true })
  OrderDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  RequiredDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  ShippedDate: Date;

  @ManyToOne(() => Shipper)
  @JoinColumn({ name: 'ShipVia' })
  ShipVia: Shipper;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  Freight: number;

  @Column({ length: 60, nullable: true })
  ShipName: string;

  @Column({ length: 60, nullable: true })
  ShipAddress: string;

  @Column({ length: 15, nullable: true })
  ShipCity: string;

  @Column({ length: 15, nullable: true })
  ShipRegion: string;

  @Column({ length: 10, nullable: true })
  ShipPostalCode: string;

  @Column({ length: 15, nullable: true })
  ShipCountry: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
