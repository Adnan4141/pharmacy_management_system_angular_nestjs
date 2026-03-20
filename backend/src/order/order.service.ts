import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/order.dto';
import { MedicineService } from '../medicine/medicine.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
    private readonly medicineService: MedicineService,
  ) {}

  findAll(): Promise<Order[]> {
    return this.orderRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOneBy({ id });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    let subtotal = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const item of dto.items) {
      const medicine = await this.medicineService.findOne(item.medicineId);
      if (medicine.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}`,
        );
      }
      const lineTotal = Number(medicine.price) * item.quantity;
      subtotal += lineTotal;
      orderItems.push({
        medicineId: item.medicineId,
        quantity: item.quantity,
        unitPrice: medicine.price,
        lineTotal,
      });
    }

    const discount = dto.discount || 0;
    const total = subtotal - discount;

    const order = this.orderRepo.create({
      customerId: dto.customerId ?? undefined,
      subtotal,
      discount,
      total,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepo.save(order) as Order;

    for (const item of orderItems) {
      const orderItem = this.itemRepo.create({
        ...item,
        orderId: savedOrder.id,
      });
      await this.itemRepo.save(orderItem);
    }

    // Deduct stock
    for (const item of dto.items) {
      const medicine = await this.medicineService.findOne(item.medicineId);
      await this.medicineService.update(item.medicineId, {
        stock: medicine.stock - item.quantity,
      });
    }

    return this.findOne(savedOrder.id);
  }

  async addItem(orderId: number, medicineId: number, quantity: number): Promise<Order> {
    const order = await this.findOne(orderId);
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Cannot modify a non-pending order');
    }

    const medicine = await this.medicineService.findOne(medicineId);
    if (medicine.stock < quantity) {
      throw new BadRequestException(`Insufficient stock for ${medicine.name}`);
    }

    const existing = order.items.find((i) => i.medicineId === medicineId);
    if (existing) {
      existing.quantity += quantity;
      existing.lineTotal = Number(existing.unitPrice) * existing.quantity;
      await this.itemRepo.save(existing);
    } else {
      const lineTotal = Number(medicine.price) * quantity;
      const item = this.itemRepo.create({
        orderId,
        medicineId,
        quantity,
        unitPrice: medicine.price,
        lineTotal,
      });
      await this.itemRepo.save(item);
    }

    await this.recalculate(orderId);
    return this.findOne(orderId);
  }

  async removeItem(orderId: number, itemId: number): Promise<Order> {
    const order = await this.findOne(orderId);
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Cannot modify a non-pending order');
    }
    await this.itemRepo.delete(itemId);
    await this.recalculate(orderId);
    return this.findOne(orderId);
  }

  async cancel(id: number): Promise<Order> {
    const order = await this.findOne(id);
    order.status = OrderStatus.CANCELLED;
    return this.orderRepo.save(order);
  }

  private async recalculate(orderId: number): Promise<void> {
    const order = await this.findOne(orderId);
    const subtotal = order.items.reduce((sum, i) => sum + Number(i.lineTotal), 0);
    order.subtotal = subtotal;
    order.total = subtotal - Number(order.discount);
    await this.orderRepo.save(order);
  }
}
