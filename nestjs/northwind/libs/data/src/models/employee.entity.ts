import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Employees')
export class Employee {
  @PrimaryGeneratedColumn()
  EmployeeID: number;

  @Column({ length: 20 })
  LastName: string;

  @Column({ length: 10 })
  FirstName: string;

  @Column({ length: 30, nullable: true })
  Title: string;

  @Column({ length: 25, nullable: true })
  TitleOfCourtesy: string;

  @Column({ type: 'timestamp', nullable: true })
  BirthDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  HireDate: Date;

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
  HomePhone: string;

  @Column({ length: 4, nullable: true })
  Extension: string;

  @Column({ type: 'text', nullable: true })
  Notes: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'ReportsTo' })
  ReportsTo: Employee;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
