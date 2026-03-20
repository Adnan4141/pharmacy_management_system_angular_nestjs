import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Pharmacy Management System');
  mobileMenuOpen = signal(false);

  constructor(public cartService: CartService) {}

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }
}
