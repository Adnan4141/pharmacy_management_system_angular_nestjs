import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentMethod } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/payment.dto';
import { OrderService } from '../order/order.service';
import { OrderStatus } from '../order/entities/order.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,
    private readonly orderService: OrderService,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const order = await this.orderService.findOne(dto.orderId);

    if (order.status === OrderStatus.COMPLETED) {
      throw new BadRequestException('Order is already paid');
    }
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot pay for a cancelled order');
    }

    const existingPayments = order.payments || [];
    const alreadyPaid = existingPayments.reduce((s, p) => s + Number(p.amount), 0);
    const remaining = Number(order.total) - alreadyPaid;

    if (remaining <= 0) {
      throw new BadRequestException('Order is fully paid');
    }

    const amount = Math.min(dto.amount, remaining);
    let change = 0;
    let due = 0;

    if (dto.method === PaymentMethod.CASH) {
      const tendered = dto.tendered ?? dto.amount;
      if (tendered < amount) {
        due = amount - tendered;
        change = 0;
      } else {
        change = tendered - amount;
        due = 0;
      }
    } else {
      // Bank/Card or MFS — exact amount
      due = 0;
      change = 0;
    }

    const payment = this.repo.create({
      orderId: dto.orderId,
      method: dto.method,
      amount,
      tendered: dto.tendered ?? amount,
      change,
      due,
      transactionRef: dto.transactionRef,
    });

    const saved = await this.repo.save(payment);

    // Check if order is fully paid
    const totalPaid = alreadyPaid + amount;
    if (totalPaid >= Number(order.total) && due === 0) {
      order.status = OrderStatus.COMPLETED;
      await this.orderService.findOne(order.id); // reload
      // We need direct repo access to update status
      await this.repo.manager.getRepository('orders').update(order.id, {
        status: OrderStatus.COMPLETED,
      });
    }

    return saved;
  }

  findByOrder(orderId: number): Promise<Payment[]> {
    return this.repo.find({ where: { orderId }, order: { createdAt: 'ASC' } });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.repo.findOneBy({ id });
    if (!payment) throw new NotFoundException(`Payment #${id} not found`);
    return payment;
  }
}
