import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicine } from '../models/models';

@Injectable({ providedIn: 'root' })
export class MedicineService {
  private readonly url = 'http://localhost:3000/api/medicines';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.url);
  }

  search(query: string): Observable<Medicine[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Medicine[]>(this.url, { params });
  }

  getById(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.url}/${id}`);
  }

  seed(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.url}/seed`);
  }
}
