import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { CartService } from '../../services/cart.service';
import { Customer } from '../../models/models';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-management.component.html',
})
export class CustomerManagementComponent {
  customers = signal<Customer[]>([]);
  searchQuery = signal('');
  showForm = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  formData = {
    name: '',
    phone: '',
    email: '',
    address: '',
  };

  constructor(
    private customerService: CustomerService,
    private cartService: CartService,
  ) {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (data) => this.customers.set(data),
    });
  }

  onSearch(): void {
    const q = this.searchQuery();
    if (q.trim()) {
      this.customerService.search(q).subscribe({
        next: (data) => this.customers.set(data),
      });
    } else {
      this.loadCustomers();
    }
  }

  updateSearch(value: string): void {
    this.searchQuery.set(value);
    this.onSearch();
  }

  toggleForm(): void {
    this.showForm.update(v => !v);
    this.clearMessages();
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) return;
    this.clearMessages();

    this.customerService.create(this.formData).subscribe({
      next: (customer) => {
        this.successMessage.set(`Customer "${customer.name}" added successfully!`);
        this.formData = { name: '', phone: '', email: '', address: '' };
        form.resetForm();
        this.showForm.set(false);
        this.loadCustomers();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to add customer');
      },
    });
  }

  selectCustomer(customer: Customer): void {
    this.cartService.setCustomerId(customer.id);
    this.successMessage.set(`Customer "${customer.name}" selected for current order`);
    setTimeout(() => this.clearMessages(), 3000);
  }

  deleteCustomer(id: number): void {
    this.customerService.delete(id).subscribe({
      next: () => this.loadCustomers(),
    });
  }

  private clearMessages(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
  }
}
