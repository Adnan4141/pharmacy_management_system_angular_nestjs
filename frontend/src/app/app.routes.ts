import { Routes } from '@angular/router';
import { MedicineCatalogComponent } from './components/medicine-catalog/medicine-catalog.component';
import { OrderCartComponent } from './components/order-cart/order-cart.component';
import { CustomerManagementComponent } from './components/customer-management/customer-management.component';
import { PaymentProcessingComponent } from './components/payment-processing/payment-processing.component';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog', component: MedicineCatalogComponent },
  { path: 'cart', component: OrderCartComponent },
  { path: 'customers', component: CustomerManagementComponent },
  { path: 'payment', component: PaymentProcessingComponent },
];
