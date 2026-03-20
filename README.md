# Pharmacy Management System

A responsive Single-Page Application (SPA) for managing pharmacy operations including medicine catalog browsing, order management, customer profiles, and payment processing.

## Tech Stack

- **Frontend:** Angular 19+ with Tailwind CSS
- **Backend:** NestJS (RESTful API)
- **Database:** PostgreSQL with TypeORM

## Features

### Medicine Catalog
- Browse all medicines with a responsive card grid
- Search and filter by **name**, **generic name**, or **barcode**
- Real-time search as you type
- Stock status indicators (In Stock / Low Stock / Out of Stock)
- Seed button to populate sample medicine data

### Order Cart
- Add medicines to cart from the catalog
- Adjust quantities or remove items
- Automatic subtotal and line-total calculations
- Apply discounts to orders
- Persistent cart state during session

### Customer Management
- View all customers in a sortable table
- Search customers by name or phone
- Add new customer profiles with validation (name, phone required; email format check)
- Select a customer for the current order
- Delete customer records

### Payment Processing
- Supports three payment methods:
  - **Cash** — with automatic change/due calculation
  - **Bank/Card** — with transaction reference
  - **MFS (Mobile Financial Service)** — with transaction reference
- Order summary before payment
- Success confirmation with payment details

## Project Structure

```
pharmacy_management_system/
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── medicine/           # Medicine module (entity, service, controller, DTO)
│   │   ├── customer/           # Customer module
│   │   ├── order/              # Order module (with order items)
│   │   ├── payment/            # Payment module
│   │   ├── app.module.ts       # Root module with TypeORM config
│   │   └── main.ts             # Bootstrap with CORS & validation
│   ├── .env                    # Database configuration
│   └── package.json
├── frontend/                   # Angular SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Feature components
│   │   │   │   ├── medicine-catalog/
│   │   │   │   ├── order-cart/
│   │   │   │   ├── customer-management/
│   │   │   │   └── payment-processing/
│   │   │   ├── models/         # TypeScript interfaces
│   │   │   ├── services/       # HTTP & state services
│   │   │   ├── app.ts          # Root component with navigation
│   │   │   ├── app.routes.ts   # SPA routing
│   │   │   └── app.config.ts   # App configuration
│   │   └── styles.css          # Tailwind CSS imports
│   └── package.json
└── README.md
```

## Prerequisites

- **Node.js** >= 18
- **PostgreSQL** >= 14
- **npm** >= 9

## Setup & Running

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE pharmacy_db;
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure database (edit .env if needed)
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=postgres
# DB_NAME=pharmacy_db

# Start the API server (runs on port 3000)
npm run start:dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the Angular dev server (runs on port 4200)
npm start
```

### 4. Seed Sample Data

After both servers are running, visit the **Catalog** page and click the **"Seed Sample Data"** button, or call:

```
GET http://localhost:3000/api/medicines/seed
```

## API Endpoints

### Medicines
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medicines` | List all medicines |
| GET | `/api/medicines?q=search` | Search medicines |
| GET | `/api/medicines/seed` | Seed sample data |
| GET | `/api/medicines/:id` | Get medicine by ID |
| POST | `/api/medicines` | Create medicine |
| PUT | `/api/medicines/:id` | Update medicine |
| DELETE | `/api/medicines/:id` | Delete medicine |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | List all customers |
| GET | `/api/customers?q=search` | Search customers |
| GET | `/api/customers/:id` | Get customer by ID |
| POST | `/api/customers` | Create customer |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List all orders |
| GET | `/api/orders/:id` | Get order by ID |
| POST | `/api/orders` | Create order |
| POST | `/api/orders/:id/items` | Add item to order |
| DELETE | `/api/orders/:id/items/:itemId` | Remove item from order |
| POST | `/api/orders/:id/cancel` | Cancel order |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments` | Process payment |
| GET | `/api/payments/order/:orderId` | Get payments for order |
| GET | `/api/payments/:id` | Get payment by ID |

## Usage Workflow

1. **Browse Catalog** — Search for medicines and add items to cart
2. **Manage Cart** — Adjust quantities, apply discounts
3. **Select Customer** (optional) — Add or select an existing customer
4. **Process Payment** — Choose payment method (Cash/Card/MFS) and complete the transaction
