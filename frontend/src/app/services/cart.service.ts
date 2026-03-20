import { Injectable, signal, computed } from '@angular/core';
import { Medicine, CartItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>([]);
  private readonly _discount = signal<number>(0);
  private readonly _customerId = signal<number | null>(null);

  readonly items = this._items.asReadonly();
  readonly discount = this._discount.asReadonly();
  readonly customerId = this._customerId.asReadonly();

  readonly subtotal = computed(() =>
    this._items().reduce((sum, item) => sum + item.lineTotal, 0)
  );

  readonly total = computed(() =>
    Math.max(0, this.subtotal() - this._discount())
  );

  readonly itemCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  addItem(medicine: Medicine, quantity: number = 1): void {
    const current = this._items();
    const existing = current.find(i => i.medicine.id === medicine.id);

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > medicine.stock) return;
      this._items.set(current.map(i =>
        i.medicine.id === medicine.id
          ? { ...i, quantity: newQty, lineTotal: i.unitPrice * newQty }
          : i
      ));
    } else {
      if (quantity > medicine.stock) return;
      this._items.set([...current, {
        medicine,
        quantity,
        unitPrice: medicine.price,
        lineTotal: medicine.price * quantity,
      }]);
    }
  }

  removeItem(medicineId: number): void {
    this._items.set(this._items().filter(i => i.medicine.id !== medicineId));
  }

  updateQuantity(medicineId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(medicineId);
      return;
    }
    this._items.set(this._items().map(i =>
      i.medicine.id === medicineId
        ? { ...i, quantity, lineTotal: i.unitPrice * quantity }
        : i
    ));
  }

  setDiscount(discount: number): void {
    this._discount.set(Math.max(0, discount));
  }

  setCustomerId(id: number | null): void {
    this._customerId.set(id);
  }

  clear(): void {
    this._items.set([]);
    this._discount.set(0);
    this._customerId.set(null);
  }
}
