# Deep API Documentation & Integration Guide

Comprehensive technical reference for integrating with the Global API System.

**Base URL:** `https://your-domain.com/api`

## Table of Contents
1. [Authentication & Security](#authentication--security)
2. [Data Schemas](#data-schemas)
3. [Error Handling](#error-handling)
4. [Endpoints Reference](#endpoints-reference)
5. [Webhook Integration](#webhook-integration)

---

## Authentication & Security

### Customer Authentication
The API uses `customerId` based authentication for order-related operations. This ID is returned when you create a customer.

- **Header/Query Parameter:** `customerId`
- **Scope:** Defines ownership of orders.

> **Security Note:** In a production environment, you should also implement API Key authentication for the public endpoints (Products, Categories) to prevent abuse.

---

## Data Schemas

### Product Object
```typescript
interface Product {
  _id: string;          // Unique ID (e.g., "j123...")
  name: string;         // Product name
  description: string;  // HTML description
  price: number;        // Price in base currency
  images: string[];     // Array of image URLs
  orgId: string;        // Organization ID owner
  categoryId: string;   // Category ID
  status: 'active' | 'inactive';
  sku?: string;         // Stock Keeping Unit
  stock: number;        // Current inventory count
}
```

### Order Object
```typescript
interface Order {
  _id: string;
  orderNumber: string;  // Human readable ID (e.g., "ORD-12345678")
  customerId: string;
  orgId: string;        // Seller Organization ID
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: number;    // Unix timestamp
  updatedAt?: number;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;    // Price at time of order
  totalPrice: number;   // quantity * unitPrice
}
```

### Customer Object
```typescript
interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  createdAt: number;
}
```

---

## Error Handling

The API returns standard HTTP status codes and a JSON error object.

**Error Response Format:**
```json
{
  "error": "Human readable error message",
  "code": "OPTIONAL_ERROR_CODE",
  "details": { ... } // Optional validation details
}
```

**Common Status Codes:**

| Code | Meaning | Description |
|------|---------|-------------|
| `200` | OK | Request succeeded. |
| `201` | Created | Resource successfully created. |
| `400` | Bad Request | Missing required fields or invalid data. |
| `401` | Unauthorized | Missing or invalid `customerId`. |
| `403` | Forbidden | Access denied (e.g., accessing another customer's order). |
| `404` | Not Found | Resource does not exist. |
| `500` | Server Error | Internal system error. |

---

## Endpoints Reference

### 1. Products API

**GET /api/products**
List products with advanced filtering.

**Parameters:**
- `page` (int, default: 1): Pagination cursor.
- `limit` (int, default: 20): Items per page.
- `search` (string): Fuzzy search on name, SKU, description.
- `status` (string, default: 'active'): Filter by status.
- `orgId` (string): Filter by organization.
- `categoryId` (string): Filter by category.

**Response:**
```json
{
  "data": [ ...Products ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 2. Customers API

**POST /api/customers**
Smart customer creation/retrieval.

**Logic:**
1. Allows passing `customerId`. If exists, returns it.
2. If `email` exists, updates the customer and returns it.
3. If new, creates a new customer.

**Body:**
```json
{
  "email": "user@example.com", // Required for new
  "name": "User Name",         // Required for new
  "phone": "+1234567890",      // Required for new
  "address": "123 St",
  "city": "City"
}
```

**Response:**
```json
{
  "customer": { ...Customer },
  "created": true // boolean: true if new record created
}
```

### 3. Orders API

**POST /api/orders**
Create a direct order.

**Body:**
```json
{
  "customerId": "cust_123",
  "orgId": "org_456",
  "items": [
    {
      "productId": "prod_789",
      "productName": "Item Name",
      "quantity": 1,
      "unitPrice": 100,
      "totalPrice": 100
    }
  ]
}
```

**GET /api/orders/[id]**
Get detailed order view.
*Required Query Param:* `?customerId=cust_123`

---

## Webhook Integration

### Order Processing Webhook
Endpoint: `POST /api/webhooks/orders`

This endpoint is designed for integration with external e-commerce platforms or marketplaces. It handles **Multi-Vendor Orders**.

**Features:**
- Automatically splits a single cart into multiple orders based on `orgId` (Seller).
- Finds or creates the customer automatically.
- Returns all created order IDs.

**Payload:**
```json
{
  "event": "order.created",
  "timestamp": 123456789,
  "customer": {
    "name": "Buyer Name",
    "email": "buyer@email.com",
    "phone": "+123"
  },
  "items": [
    { "productId": "p1", "orgId": "org_A", "quantity": 1, "unitPrice": 10 },
    { "productId": "p2", "orgId": "org_B", "quantity": 1, "unitPrice": 20 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "customerId": "cust_new_123",
  "orders": [
    { "orgId": "org_A", "orderId": "ord_1", "orderNumber": "ORD-1" },
    { "orgId": "org_B", "orderId": "ord_2", "orderNumber": "ORD-2" }
  ]
}
```

### Best Practices
- **Idempotency:** The webhook logic is currently capable of creating duplicate orders if sent multiple times. *Recommendation:* Implement an `externalId` field to dedup.
- **Security:** Ensure you trust the source of the webhook. Currently open; *Future:* Implement HMAC signature verification.
