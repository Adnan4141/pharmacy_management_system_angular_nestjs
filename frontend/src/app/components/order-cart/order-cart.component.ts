import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-order-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-cart.component.html',
})
export class OrderCartComponent {
  constructor(public cartService: CartService) {}

  onQuantityChange(medicineId: number, event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.cartService.updateQuantity(medicineId, value);
  }

  onDiscountChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.cartService.setDiscount(value);
  }

  removeItem(medicineId: number): void {
    this.cartService.removeItem(medicineId);
  }

  clearCart(): void {
    this.cartService.clear();
  }
}
