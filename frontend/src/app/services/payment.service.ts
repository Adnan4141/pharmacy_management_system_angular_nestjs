import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly url = 'http://localhost:3000/api/payments';

  constructor(private http: HttpClient) {}

  create(payment: { orderId: number; method: string; amount: number; tendered?: number; transactionRef?: string }): Observable<Payment> {
    return this.http.post<Payment>(this.url, payment);
  }

  getByOrder(orderId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.url}/order/${orderId}`);
  }
}
