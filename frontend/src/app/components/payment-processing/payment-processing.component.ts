import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import { Order, Payment } from '../../models/models';

@Component({
  selector: 'app-payment-processing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-processing.component.html',
})
export class PaymentProcessingComponent {
  paymentMethod = signal<'CASH' | 'BANK_CARD' | 'MFS'>('CASH');
  tenderedAmount = signal<number>(0);
  transactionRef = signal('');
  processing = signal(false);
  currentOrder = signal<Order | null>(null);
  paymentResult = signal<Payment | null>(null);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private paymentService: PaymentService,
  ) {}

  get changeAmount(): number {
    if (this.paymentMethod() !== 'CASH') return 0;
    const tendered = this.tenderedAmount();
    const total = this.cartService.total();
    return Math.max(0, tendered - total);
  }

  get dueAmount(): number {
    if (this.paymentMethod() !== 'CASH') return 0;
    const tendered = this.tenderedAmount();
    const total = this.cartService.total();
    return Math.max(0, total - tendered);
  }

  setMethod(method: 'CASH' | 'BANK_CARD' | 'MFS'): void {
    this.paymentMethod.set(method);
    this.tenderedAmount.set(0);
    this.transactionRef.set('');
  }

  processPayment(): void {
    const items = this.cartService.items();
    if (items.length === 0) {
      this.errorMessage.set('Cart is empty');
      return;
    }

    this.processing.set(true);
    this.clearMessages();

    // Step 1: Create order
    const orderPayload = {
      customerId: this.cartService.customerId() || undefined,
      items: items.map(i => ({
        medicineId: i.medicine.id,
        quantity: i.quantity,
      })),
      discount: this.cartService.discount(),
    };

    this.orderService.create(orderPayload).subscribe({
      next: (order) => {
        this.currentOrder.set(order);
        // Step 2: Process payment
        const paymentPayload = {
          orderId: order.id,
          method: this.paymentMethod(),
          amount: Number(order.total),
          tendered: this.paymentMethod() === 'CASH' ? this.tenderedAmount() : Number(order.total),
          transactionRef: this.transactionRef() || undefined,
        };

        this.paymentService.create(paymentPayload).subscribe({
          next: (payment) => {
            this.paymentResult.set(payment);
            this.processing.set(false);
            this.successMessage.set('Payment processed successfully!');
            this.cartService.clear();
          },
          error: (err) => {
            this.processing.set(false);
            this.errorMessage.set(err.error?.message || 'Payment failed');
          },
        });
      },
      error: (err) => {
        this.processing.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to create order');
      },
    });
  }

  newTransaction(): void {
    this.currentOrder.set(null);
    this.paymentResult.set(null);
    this.tenderedAmount.set(0);
    this.transactionRef.set('');
    this.clearMessages();
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }
}
