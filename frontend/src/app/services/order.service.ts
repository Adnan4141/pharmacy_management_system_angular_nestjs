import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly url = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.url);
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.url}/${id}`);
  }

  create(order: { customerId?: number; items: { medicineId: number; quantity: number }[]; discount?: number }): Observable<Order> {
    return this.http.post<Order>(this.url, order);
  }

  addItem(orderId: number, medicineId: number, quantity: number): Observable<Order> {
    return this.http.post<Order>(`${this.url}/${orderId}/items`, { medicineId, quantity });
  }

  removeItem(orderId: number, itemId: number): Observable<Order> {
    return this.http.delete<Order>(`${this.url}/${orderId}/items/${itemId}`);
  }

  cancel(orderId: number): Observable<Order> {
    return this.http.post<Order>(`${this.url}/${orderId}/cancel`, {});
  }
}
