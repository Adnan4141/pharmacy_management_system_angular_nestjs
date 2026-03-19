import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../../order/entities/order.entity';

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_CARD = 'BANK_CARD',
  MFS = 'MFS',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  tendered: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  change: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  due: number;

  @Column({ nullable: true })
  transactionRef: string;

  @CreateDateColumn()
  createdAt: Date;
}
