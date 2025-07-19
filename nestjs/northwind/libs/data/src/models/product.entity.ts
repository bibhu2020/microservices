import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { Category } from './category.entity';

@Entity('Products')
export class Product {
  @PrimaryGeneratedColumn()
  ProductID: number;

  @Column({ length: 40 })
  ProductName: string;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'SupplierID' })
  Supplier: Supplier;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'CategoryID' })
  Category: Category;

  @Column({ length: 20, nullable: true })
  QuantityPerUnit: string;

  @Column('decimal', { precision: 18, scale: 2, nullable: true })
  UnitPrice: number;

  @Column({ type: 'smallint', nullable: true })
  UnitsInStock: number;

  @Column({ type: 'smallint', nullable: true })
  UnitsOnOrder: number;

  @Column({ type: 'smallint', nullable: true })
  ReorderLevel: number;

  @Column()
  Discontinued: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
