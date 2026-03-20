export interface Medicine {
  id: number;
  name: string;
  genericName: string;
  barcode: string;
  price: number;
  stock: number;
  manufacturer?: string;
  dosageForm?: string;
  strength?: string;
  expiryDate?: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface OrderItem {
  id?: number;
  medicineId: number;
  medicine?: Medicine;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  customerId?: number;
  customer?: Customer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  payments?: Payment[];
  createdAt: string;
}

export interface Payment {
  id: number;
  orderId: number;
  method: 'CASH' | 'BANK_CARD' | 'MFS';
  amount: number;
  tendered: number;
  change: number;
  due: number;
  transactionRef?: string;
  createdAt: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}
