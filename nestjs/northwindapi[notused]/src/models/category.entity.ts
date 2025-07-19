import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Categories')
export class Category {
  @PrimaryGeneratedColumn()
  CategoryID: number;

  @Column({ length: 15 })
  CategoryName: string;

  @Column({ type: 'text', nullable: true })
  Description: string;

  @Column({ type: 'bytea', nullable: true }) // Use `blob` for MySQL
  Picture: Buffer;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
