import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicineService } from '../../services/medicine.service';
import { CartService } from '../../services/cart.service';
import { Medicine } from '../../models/models';

@Component({
  selector: 'app-medicine-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicine-catalog.component.html',
})
export class MedicineCatalogComponent implements OnInit {
  medicines = signal<Medicine[]>([]);
  searchQuery = signal('');
  loading = signal(false);

  constructor(
    private medicineService: MedicineService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(): void {
    this.loading.set(true);
    this.medicineService.getAll().subscribe({
      next: (data) => {
        this.medicines.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch(): void {
    const q = this.searchQuery();
    this.loading.set(true);
    if (q.trim()) {
      this.medicineService.search(q).subscribe({
        next: (data) => {
          this.medicines.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    } else {
      this.loadMedicines();
    }
  }

  addToCart(medicine: Medicine): void {
    this.cartService.addItem(medicine);
  }

  seedData(): void {
    this.medicineService.seed().subscribe({
      next: (data) => this.medicines.set(data),
    });
  }

  updateSearch(value: string): void {
    this.searchQuery.set(value);
    this.onSearch();
  }
}
