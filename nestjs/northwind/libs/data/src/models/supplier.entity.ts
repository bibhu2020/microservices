import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Suppliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  SupplierID: number;

  @Column({ length: 40 })
  CompanyName: string;

  @Column({ length: 30, nullable: true })
  ContactName: string;

  @Column({ length: 30, nullable: true })
  ContactTitle: string;

  @Column({ length: 60, nullable: true })
  Address: string;

  @Column({ length: 15, nullable: true })
  City: string;

  @Column({ length: 15, nullable: true })
  Region: string;

  @Column({ length: 10, nullable: true })
  PostalCode: string;

  @Column({ length: 15, nullable: true })
  Country: string;

  @Column({ length: 24, nullable: true })
  Phone: string;

  @Column({ length: 24, nullable: true })
  Fax: string;

  @Column({ type: 'text', nullable: true })
  HomePage: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
