import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Shippers')
export class Shipper {
  @PrimaryGeneratedColumn()
  ShipperID: number;

  @Column({ length: 40 })
  CompanyName: string;

  @Column({ length: 24, nullable: true })
  Phone: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
