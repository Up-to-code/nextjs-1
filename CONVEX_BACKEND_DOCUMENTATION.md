# Antig - Convex Backend Documentation for LLM

Complete backend implementation guide using Convex for the Antig furniture management platform.

---

## 🚀 CONVEX SETUP & INSTALLATION

### Initial Setup
```bash
# Install Convex
npm install convex

# Initialize Convex in your project
npx convex dev

# This creates:
# - convex/ directory
# - convex.json configuration
# - .env.local with CONVEX_URL and CONVEX_DEPLOY_KEY
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOY_KEY=your-deploy-key
```

### Convex Provider Setup
```typescript
// src/app/providers.tsx
'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

```typescript
// src/app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## 📊 CONVEX SCHEMA DEFINITION

### Main Schema File
```typescript
// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // ============================================
  // USERS / PARTNERS TABLE
  // ============================================
  users: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    password: v.string(), // Hashed
    avatar: v.optional(v.string()),
    businessName: v.string(),
    businessDescription: v.optional(v.string()),
    address: v.string(),
    city: v.optional(v.string()),
    commercialRegistration: v.optional(v.string()),
    taxId: v.optional(v.string()),
    
    // Bank Account Information
    bankAccount: v.optional(
      v.object({
        accountNumber: v.string(),
        bankName: v.string(),
        iban: v.string(),
      })
    ),
    
    // User Settings
    settings: v.object({
      language: v.union(v.literal('ar'), v.literal('en')),
      timezone: v.string(),
      currency: v.string(),
      emailNotifications: v.boolean(),
      smsNotifications: v.boolean(),
      inAppNotifications: v.boolean(),
    }),
    
    verified: v.boolean(),
    status: v.union(v.literal('active'), v.literal('inactive')),
    
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index('by_email', ['email'])
    .index('by_phone', ['phone'])
    .index('by_status', ['status']),

  // ============================================
  // CATEGORIES TABLE
  // ============================================
  categories: defineTable({
    name: v.string(), // Arabic name
    nameEn: v.string(), // English name
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    parentId: v.optional(v.id('categories')), // For nested categories
    order: v.number(), // Display order
    status: v.union(v.literal('active'), v.literal('inactive')),
    
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index('by_status', ['status'])
    .index('by_parent', ['parentId'])
    .index('by_order', ['order']),

  // ============================================
  // PRODUCTS TABLE
  // ============================================
  products: defineTable({
    userId: v.id('users'), // Partner who owns this product
    
    name: v.string(), // Arabic name
    nameEn: v.string(), // English name
    description: v.string(),
    descriptionEn: v.optional(v.string()),
    
    categoryId: v.id('categories'),
    
    price: v.number(),
    originalPrice: v.optional(v.number()), // For discounts
    stock: v.number(),
    sku: v.string(), // Stock Keeping Unit
    
    images: v.array(v.string()), // Array of image URLs
    
    // Optional product details
    weight: v.optional(v.number()), // in kg
    dimensions: v.optional(
      v.object({
        length: v.number(),
        width: v.number(),
        height: v.number(),
      })
    ),
    
    tags: v.optional(v.array(v.string())),
    
    status: v.union(v.literal('active'), v.literal('inactive')),
    
    // Metrics
    viewCount: v.number(),
    orderCount: v.number(),
    
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index('by_user', ['userId'])
    .index('by_category', ['categoryId'])
    .index('by_status', ['status'])
    .index('by_sku', ['sku'])
    .index('by_user_and_status', ['userId', 'status'])
    .index('by_category_and_status', ['categoryId', 'status']),

  // ============================================
  // CUSTOMERS TABLE
  // ============================================
  customers: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    postalCode: v.optional(v.string()),
    
    // Metrics
    totalOrders: v.number(),
    totalSpent: v.number(),
    lastOrderDate: v.optional(v.number()),
    
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index('by_email', ['email'])
    .index('by_phone', ['phone']),

  // ============================================
  // ORDERS TABLE
  // ============================================
  orders: defineTable({
    orderNumber: v.string(), // e.g., "12345"
    userId: v.id('users'), // Partner who owns this order
    customerId: v.id('customers'),
    
    // Order Items (denormalized for performance)
    items: v.array(
      v.object({
        productId: v.id('products'),
        productName: v.string(),
        productImage: v.string(),
        sku: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        totalPrice: v.number(),
      })
    ),
    
    // Pricing
    subtotal: v.number(),
    shippingCost: v.number(),
    tax: v.number(),
    discount: v.number(),
    total: v.number(),
    
    // Payment Information
    paymentMethod: v.union(
      v.literal('cash'),
      v.literal('card'),
      v.literal('bank_transfer')
    ),
    paymentStatus: v.union(
      v.literal('paid'),
      v.literal('unpaid'),
      v.literal('refunded')
    ),
    
    // Order Status
    orderStatus: v.union(
      v.literal('pending'),
      v.literal('processing'),
      v.literal('shipping'),
      v.literal('delivered'),
      v.literal('completed'),
      v.literal('cancelled'),
      v.literal('returning'),
      v.literal('returned')
    ),
    
    // Shipping Information
    shippingMethod: v.optional(v.string()),
    trackingNumber: v.optional(v.string()),
    
    notes: v.optional(v.string()),
    
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index('by_user', ['userId'])
    .index('by_customer', ['customerId'])
    .index('by_order_number', ['orderNumber'])
    .index('by_status', ['orderStatus'])
    .index('by_payment_status', ['paymentStatus'])
    .index('by_user_and_status', ['userId', 'orderStatus'])
    .index('by_created_at', ['createdAt']),

  // ============================================
  // ORDER STATUS HISTORY TABLE
  // ============================================
  orderStatusHistory: defineTable({
    orderId: v.id('orders'),
    status: v.union(
      v.literal('pending'),
      v.literal('processing'),
      v.literal('shipping'),
      v.literal('delivered'),
      v.literal('completed'),
      v.literal('cancelled'),
      v.literal('returning'),
      v.literal('returned')
    ),
    note: v.optional(v.string()),
    updatedBy: v.id('users'),
    
    createdAt: v.number(),
  })
    .index('by_order', ['orderId'])
    .index('by_order_and_created', ['orderId', 'createdAt']),

  // ============================================
  // NOTIFICATIONS TABLE
  // ============================================
  notifications: defineTable({
    userId: v.id('users'), // Partner receiving the notification
    
    type: v.union(
      v.literal('order'),
      v.literal('product'),
      v.literal('message'),
      v.literal('system')
    ),
    
    title: v.string(),
    message: v.string(),
    
    // Related entity
    relatedId: v.optional(v.string()), // ID of related order/product/etc
    link: v.optional(v.string()), // Link to navigate to
    
    read: v.boolean(),
    
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_read', ['userId', 'read'])
    .index('by_user_and_created', ['userId', 'createdAt']),

  // ============================================
  // DOCUMENTS/FILES TABLE (for business documents)
  // ============================================
  documents: defineTable({
    userId: v.id('users'),
    
    type: v.union(
      v.literal('commercial_registration'),
      v.literal('tax_card'),
      v.literal('national_id'),
      v.literal('other')
    ),
    
    fileName: v.string(),
    fileUrl: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
    
    status: v.union(
      v.literal('pending'),
      v.literal('approved'),
      v.literal('rejected')
    ),
    
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index('by_user', ['userId'])
    .index('by_type', ['type'])
    .index('by_status', ['status']),
});
```

---

## 📖 CONVEX QUERIES (Read Operations)

### User/Auth Queries
```typescript
// convex/users.ts
import { query } from './_generated/server';
import { v } from 'convex/values';

// Get current user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .unique();
  },
});

// Get user by ID
export const getUserById = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});
```

### Product Queries
```typescript
// convex/products.ts
import { query } from './_generated/server';
import { v } from 'convex/values';

// Get all products for a user
export const getProductsByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('products')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect();
  },
});

// Get products by category
export const getProductsByCategory = query({
  args: { categoryId: v.id('categories') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('products')
      .withIndex('by_category', (q) => q.eq('categoryId', args.categoryId))
      .filter((q) => q.eq(q.field('status'), 'active'))
      .collect();
  },
});

// Get single product
export const getProduct = query({
  args: { productId: v.id('products') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});

// Search products
export const searchProducts = query({
  args: { 
    userId: v.id('users'),
    searchTerm: v.optional(v.string()),
    categoryId: v.optional(v.id('categories')),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query('products')
      .withIndex('by_user', (q) => q.eq('userId', args.userId));

    const products = await query.collect();

    // Filter by search term
    let filtered = products;
    if (args.searchTerm) {
      const term = args.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.nameEn.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (args.categoryId) {
      filtered = filtered.filter((p) => p.categoryId === args.categoryId);
    }

    // Filter by status
    if (args.status) {
      filtered = filtered.filter((p) => p.status === args.status);
    }

    return filtered;
  },
});

// Get low stock products
export const getLowStockProducts = query({
  args: { 
    userId: v.id('users'),
    threshold: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const threshold = args.threshold ?? 5;
    
    const products = await ctx.db
      .query('products')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('status'), 'active'))
      .collect();

    return products.filter((p) => p.stock <= threshold);
  },
});
```

### Category Queries
```typescript
// convex/categories.ts
import { query } from './_generated/server';
import { v } from 'convex/values';

// Get all active categories
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('categories')
      .withIndex('by_status', (q) => q.eq('status', 'active'))
      .order('asc')
      .collect();
  },
});

// Get category with product count
export const getCategoryWithCount = query({
  args: { categoryId: v.id('categories') },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.categoryId);
    if (!category) return null;

    const productCount = await ctx.db
      .query('products')
      .withIndex('by_category', (q) => q.eq('categoryId', args.categoryId))
      .filter((q) => q.eq(q.field('status'), 'active'))
      .collect();

    return {
      ...category,
      productCount: productCount.length,
    };
  },
});
```

### Order Queries
```typescript
// convex/orders.ts
import { query } from './_generated/server';
import { v } from 'convex/values';

// Get all orders for a user
export const getOrdersByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query('orders')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect();

    // Get customer info for each order
    const ordersWithCustomers = await Promise.all(
      orders.map(async (order) => {
        const customer = await ctx.db.get(order.customerId);
        return { ...order, customer };
      })
    );

    return ordersWithCustomers;
  },
});

// Get orders by status
export const getOrdersByStatus = query({
  args: { 
    userId: v.id('users'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query('orders')
      .withIndex('by_user_and_status', (q) => 
        q.eq('userId', args.userId).eq('orderStatus', args.status)
      )
      .collect();

    const ordersWithCustomers = await Promise.all(
      orders.map(async (order) => {
        const customer = await ctx.db.get(order.customerId);
        return { ...order, customer };
      })
    );

    return ordersWithCustomers;
  },
});

// Get single order with full details
export const getOrder = query({
  args: { orderId: v.id('orders') },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) return null;

    const customer = await ctx.db.get(order.customerId);
    
    // Get status history
    const statusHistory = await ctx.db
      .query('orderStatusHistory')
      .withIndex('by_order_and_created', (q) => 
        q.eq('orderId', args.orderId)
      )
      .collect();

    return {
      ...order,
      customer,
      statusHistory,
    };
  },
});

// Get customer order history
export const getCustomerOrders = query({
  args: { customerId: v.id('customers') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('orders')
      .withIndex('by_customer', (q) => q.eq('customerId', args.customerId))
      .collect();
  },
});
```

### Dashboard/Analytics Queries
```typescript
// convex/dashboard.ts
import { query } from './_generated/server';
import { v } from 'convex/values';

// Get dashboard stats
export const getDashboardStats = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query('orders')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    const products = await ctx.db
      .query('products')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    // Today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const todayOrders = orders.filter((o) => o.createdAt >= todayTimestamp);
    const todaySales = todayOrders.reduce((sum, o) => sum + o.total, 0);

    // Pending orders
    const pendingOrders = orders.filter((o) => o.orderStatus === 'pending');

    // Total products
    const activeProducts = products.filter((p) => p.status === 'active');

    // Unique customers
    const uniqueCustomers = new Set(orders.map((o) => o.customerId));

    return {
      todaySales,
      todayOrdersCount: todayOrders.length,
      pendingOrdersCount: pendingOrders.length,
      totalProducts: activeProducts.length,
      totalCustomers: uniqueCustomers.size,
    };
  },
});

// Get sales by month
export const getSalesByMonth = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query('orders')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('paymentStatus'), 'paid'))
      .collect();

    // Group by month
    const salesByMonth: Record<string, number> = {};
    
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      salesByMonth[monthKey] = (salesByMonth[monthKey] || 0) + order.total;
    });

    return salesByMonth;
  },
});
```

### Notification Queries
```typescript
// convex/notifications.ts
import { query } from './_generated/server';
import { v } from 'convex/values';

// Get notifications for user
export const getNotifications = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('notifications')
      .withIndex('by_user_and_created', (q) => q.eq('userId', args.userId))
      .order('desc')
      .take(50);
  },
});

// Get unread notification count
export const getUnreadCount = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query('notifications')
      .withIndex('by_user_and_read', (q) => 
        q.eq('userId', args.userId).eq('read', false)
      )
      .collect();

    return unread.length;
  },
});
```

---

## ✏️ CONVEX MUTATIONS (Write Operations)

### Product Mutations
```typescript
// convex/products.ts (continued)
import { mutation } from './_generated/server';

// Create product
export const createProduct = mutation({
  args: {
    userId: v.id('users'),
    name: v.string(),
    nameEn: v.string(),
    description: v.string(),
    categoryId: v.id('categories'),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    stock: v.number(),
    sku: v.string(),
    images: v.array(v.string()),
    weight: v.optional(v.number()),
    dimensions: v.optional(
      v.object({
        length: v.number(),
        width: v.number(),
        height: v.number(),
      })
    ),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const productId = await ctx.db.insert('products', {
      ...args,
      status: 'active',
      viewCount: 0,
      orderCount: 0,
      createdAt: Date.now(),
    });

    return productId;
  },
});

// Update product
export const updateProduct = mutation({
  args: {
    productId: v.id('products'),
    name: v.optional(v.string()),
    nameEn: v.optional(v.string()),
    description: v.optional(v.string()),
    categoryId: v.optional(v.id('categories')),
    price: v.optional(v.number()),
    originalPrice: v.optional(v.number()),
    stock: v.optional(v.number()),
    sku: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    weight: v.optional(v.number()),
    dimensions: v.optional(
      v.object({
        length: v.number(),
        width: v.number(),
        height: v.number(),
      })
    ),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { productId, ...updates } = args;
    
    await ctx.db.patch(productId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return productId;
  },
});

// Delete product
export const deleteProduct = mutation({
  args: { productId: v.id('products') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.productId);
    return { success: true };
  },
});
```

### Order Mutations
```typescript
// convex/orders.ts (continued)

// Create order
export const createOrder = mutation({
  args: {
    userId: v.id('users'),
    customerId: v.id('customers'),
    items: v.array(
      v.object({
        productId: v.id('products'),
        productName: v.string(),
        productImage: v.string(),
        sku: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        totalPrice: v.number(),
      })
    ),
    subtotal: v.number(),
    shippingCost: v.number(),
    tax: v.number(),
    discount: v.number(),
    total: v.number(),
    paymentMethod: v.string(),
    shippingMethod: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate order number
    const orderCount = await ctx.db.query('orders').collect();
    const orderNumber = `${orderCount.length + 1}`.padStart(5, '0');

    const orderId = await ctx.db.insert('orders', {
      ...args,
      orderNumber,
      paymentStatus: 'unpaid',
      orderStatus: 'pending',
      createdAt: Date.now(),
    });

    // Create initial status history
    await ctx.db.insert('orderStatusHistory', {
      orderId,
      status: 'pending',
      note: 'تم إنشاء الطلب',
      updatedBy: args.userId,
      createdAt: Date.now(),
    });

    // Create notification
    await ctx.db.insert('notifications', {
      userId: args.userId,
      type: 'order',
      title: 'طلب جديد',
      message: `طلب جديد (#${orderNumber}) بقيمة ${args.total} ر.س`,
      relatedId: orderId,
      link: `/orders/${orderId}`,
      read: false,
      createdAt: Date.now(),
    });

    return orderId;
  },
});

// Update order status
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id('orders'),
    status: v.string(),
    note: v.optional(v.string()),
    updatedBy: v.id('users'),
    notifyCustomer: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { orderId, status, note, updatedBy } = args;

    // Update order
    await ctx.db.patch(orderId, {
      orderStatus: status,
      updatedAt: Date.now(),
    });

    // Add to status history
    await ctx.db.insert('orderStatusHistory', {
      orderId,
      status,
      note,
      updatedBy,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Update payment status
export const updatePaymentStatus = mutation({
  args: {
    orderId: v.id('orders'),
    paymentStatus: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      paymentStatus: args.paymentStatus,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
```

### Category Mutations
```typescript
// convex/categories.ts (continued)

// Create category
export const createCategory = mutation({
  args: {
    name: v.string(),
    nameEn: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    parentId: v.optional(v.id('categories')),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const categoryId = await ctx.db.insert('categories', {
      ...args,
      status: 'active',
      createdAt: Date.now(),
    });

    return categoryId;
  },
});

// Update category
export const updateCategory = mutation({
  args: {
    categoryId: v.id('categories'),
    name: v.optional(v.string()),
    nameEn: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    parentId: v.optional(v.id('categories')),
    order: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { categoryId, ...updates } = args;
    
    await ctx.db.patch(categoryId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return categoryId;
  },
});

// Delete category
export const deleteCategory = mutation({
  args: { categoryId: v.id('categories') },
  handler: async (ctx, args) => {
    // Check if category has products
    const products = await ctx.db
      .query('products')
      .withIndex('by_category', (q) => q.eq('categoryId', args.categoryId))
      .collect();

    if (products.length > 0) {
      throw new Error('لا يمكن حذف فئة تحتوي على منتجات');
    }

    await ctx.db.delete(args.categoryId);
    return { success: true };
  },
});
```

### Notification Mutations
```typescript
// convex/notifications.ts (continued)

// Mark notification as read
export const markAsRead = mutation({
  args: { notificationId: v.id('notifications') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      read: true,
    });

    return { success: true };
  },
});

// Mark all as read
export const markAllAsRead = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user_and_read', (q) => 
        q.eq('userId', args.userId).eq('read', false)
      )
      .collect();

    await Promise.all(
      notifications.map((n) => ctx.db.patch(n._id, { read: true }))
    );

    return { success: true };
  },
});

// Clear all notifications
export const clearAllNotifications = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    await Promise.all(
      notifications.map((n) => ctx.db.delete(n._id))
    );

    return { success: true };
  },
});

// Create notification (helper function)
export const createNotification = mutation({
  args: {
    userId: v.id('users'),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    relatedId: v.optional(v.string()),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert('notifications', {
      ...args,
      read: false,
      createdAt: Date.now(),
    });

    return notificationId;
  },
});
```

### Customer Mutations
```typescript
// convex/customers.ts
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Get or create customer
export const getOrCreateCustomer = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    postalCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Try to find existing customer by email or phone
    const existing = await ctx.db
      .query('customers')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .unique();

    if (existing) {
      return existing._id;
    }

    // Create new customer
    const customerId = await ctx.db.insert('customers', {
      ...args,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: Date.now(),
    });

    return customerId;
  },
});

// Update customer stats
export const updateCustomerStats = mutation({
  args: {
    customerId: v.id('customers'),
    orderTotal: v.number(),
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.customerId);
    if (!customer) throw new Error('Customer not found');

    await ctx.db.patch(args.customerId, {
      totalOrders: customer.totalOrders + 1,
      totalSpent: customer.totalSpent + args.orderTotal,
      lastOrderDate: Date.now(),
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get customer by ID
export const getCustomer = query({
  args: { customerId: v.id('customers') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.customerId);
  },
});
```

### User/Settings Mutations
```typescript
// convex/users.ts (continued)

// Update user profile
export const updateProfile = mutation({
  args: {
    userId: v.id('users'),
    name: v.optional(v.string()),
    businessName: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    businessDescription: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    
    await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Update user settings
export const updateSettings = mutation({
  args: {
    userId: v.id('users'),
    settings: v.object({
      language: v.union(v.literal('ar'), v.literal('en')),
      timezone: v.string(),
      currency: v.string(),
      emailNotifications: v.boolean(),
      smsNotifications: v.boolean(),
      inAppNotifications: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      settings: args.settings,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Update bank account
export const updateBankAccount = mutation({
  args: {
    userId: v.id('users'),
    bankAccount: v.object({
      accountNumber: v.string(),
      bankName: v.string(),
      iban: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      bankAccount: args.bankAccount,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
```

---

## 🔐 AUTHENTICATION WITH CONVEX

### Auth Mutations
```typescript
// convex/auth.ts
import { mutation } from './_generated/server';
import { v } from 'convex/values';

// Register user
export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    password: v.string(), // Should be hashed on client
    businessName: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existing = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .unique();

    if (existing) {
      throw new Error('البريد الإلكتروني مسجل مسبقاً');
    }

    // Create user
    const userId = await ctx.db.insert('users', {
      ...args,
      settings: {
        language: 'ar',
        timezone: 'Asia/Riyadh',
        currency: 'SAR',
        emailNotifications: true,
        smsNotifications: true,
        inAppNotifications: true,
      },
      verified: false,
      status: 'active',
      createdAt: Date.now(),
    });

    return userId;
  },
});

// Login user
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .unique();

    if (!user) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    // Verify password (implement proper password verification)
    if (user.password !== args.password) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      businessName: user.businessName,
    };
  },
});
```

---

## 📁 CONVEX FILE STORAGE (for Images)

### Setup File Storage
```typescript
// convex/files.ts
import { mutation } from './_generated/server';
import { v } from 'convex/values';

// Generate upload URL
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Get file URL
export const getFileUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
```

### Upload Images in Component
```typescript
// src/components/features/products/image-upload.tsx
'use client';

import { useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Upload file
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      const { storageId } = await result.json();

      // Get the file URL
      const fileUrl = await ctx.storage.getUrl(storageId);
      
      onUpload(fileUrl);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <Button type="button" disabled={uploading} asChild>
          <span>
            <Upload className="h-4 w-4" />
            {uploading ? 'جاري الرفع...' : 'رفع صورة'}
          </span>
        </Button>
      </label>
    </div>
  );
}
```

---

## 💻 USING CONVEX IN NEXT.JS COMPONENTS

### Client Component Example (Products Page)
```typescript
// src/app/(dashboard)/products/page.tsx
'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { Id } from '@/../convex/_generated/dataModel';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function ProductsPage() {
  const { userId } = useAuth(); // Get current user ID
  
  // Queries - automatically update when data changes
  const products = useQuery(api.products.getProductsByUser, {
    userId: userId as Id<'users'>,
  });

  // Mutations
  const deleteProduct = useMutation(api.products.deleteProduct);

  const handleDelete = async (productId: Id<'products'>) => {
    try {
      await deleteProduct({ productId });
      // Show success toast
    } catch (error) {
      // Show error toast
    }
  };

  if (products === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
        <Button>
          <Plus className="h-4 w-4" />
          إضافة منتج
        </Button>
      </div>

      <DataTable
        columns={[
          { header: 'المنتج', key: 'name' },
          { header: 'السعر', key: 'price' },
          { header: 'المخزون', key: 'stock' },
        ]}
        data={products}
      />
    </div>
  );
}
```

### Product Form with Convex Mutation
```typescript
// src/components/features/products/product-form.tsx
'use client';

import { useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductInput } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Id } from '@/../convex/_generated/dataModel';

interface ProductFormProps {
  userId: Id<'users'>;
  onSuccess?: () => void;
}

export function ProductForm({ userId, onSuccess }: ProductFormProps) {
  const createProduct = useMutation(api.products.createProduct);

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      nameEn: '',
      description: '',
      price: 0,
      stock: 0,
      images: [],
    },
  });

  const onSubmit = async (data: ProductInput) => {
    try {
      await createProduct({
        userId,
        ...data,
        categoryId: data.categoryId as Id<'categories'>,
        images: data.images || [],
      });

      toast.success('تم إضافة المنتج بنجاح');
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة المنتج');
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المنتج *</FormLabel>
              <FormControl>
                <Input placeholder="كنبة مودرن" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add more fields */}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'جاري الحفظ...' : 'حفظ المنتج'}
        </Button>
      </form>
    </Form>
  );
}
```

### Dashboard with Convex Queries
```typescript
// src/app/(dashboard)/dashboard/page.tsx
'use client';

import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { Id } from '@/../convex/_generated/dataModel';
import { StatCard } from '@/components/shared/stat-card';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const { userId } = useAuth();
  
  const stats = useQuery(api.dashboard.getDashboardStats, {
    userId: userId as Id<'users'>,
  });

  const orders = useQuery(api.orders.getOrdersByUser, {
    userId: userId as Id<'users'>,
  });

  if (stats === undefined || orders === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">لوحة التحكم</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="المبيعات اليوم"
          value={`${stats.todaySales.toFixed(2)} ر.س`}
          color="green"
        />
        <StatCard
          icon={ShoppingCart}
          title="الطلبات الجديدة"
          value={stats.pendingOrdersCount}
          color="blue"
        />
        <StatCard
          icon={Package}
          title="إجمالي المنتجات"
          value={stats.totalProducts}
          color="purple"
        />
        <StatCard
          icon={Users}
          title="العملاء"
          value={stats.totalCustomers}
          color="orange"
        />
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">أحدث الطلبات</h2>
        {/* Render orders table */}
      </div>
    </div>
  );
}
```

### Real-time Notifications
```typescript
// src/components/shared/notification-dropdown.tsx
'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { Id } from '@/../convex/_generated/dataModel';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface NotificationDropdownProps {
  userId: Id<'users'>;
}

export function NotificationDropdown({ userId }: NotificationDropdownProps) {
  // Real-time queries - automatically update when data changes
  const notifications = useQuery(api.notifications.getNotifications, { userId });
  const unreadCount = useQuery(api.notifications.getUnreadCount, { userId });

  // Mutations
  const markAsRead = useMutation(api.notifications.markAsRead);
  const clearAll = useMutation(api.notifications.clearAllNotifications);

  const handleMarkAsRead = async (notificationId: Id<'notifications'>) => {
    await markAsRead({ notificationId });
  };

  const handleClearAll = async () => {
    await clearAll({ userId });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount && unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1" variant="destructive">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <h3 className="font-semibold">الإشعارات</h3>
          {notifications && notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              مسح الكل
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications?.map((notification) => (
            <DropdownMenuItem
              key={notification._id}
              className={`p-4 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
              onClick={() => handleMarkAsRead(notification._id)}
            >
              <div>
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs text-gray-600">{notification.message}</p>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## 📦 CONVEX TYPESCRIPT TYPES

### Generated Types Usage
```typescript
// Use generated types from Convex
import { Id, Doc } from '@/../convex/_generated/dataModel';

// Product type from Convex
type Product = Doc<'products'>;

// Product ID type
type ProductId = Id<'products'>;

// Usage in components
interface ProductCardProps {
  product: Product;
  onDelete: (id: ProductId) => void;
}

// In components
function ProductCard({ product, onDelete }: ProductCardProps) {
  const handleDelete = () => {
    onDelete(product._id); // _id is automatically added by Convex
  };
  
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.price} ر.س</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

---

## 🚀 DEPLOYMENT

### Deploy to Convex
```bash
# Deploy backend
npx convex deploy

# Set production environment variables
npx convex env set PRODUCTION_KEY value
```

### Production Environment
```bash
# .env.production
NEXT_PUBLIC_CONVEX_URL=https://your-production.convex.cloud
CONVEX_DEPLOY_KEY=your-production-deploy-key
```

---

## ✅ SUMMARY

This Convex backend provides:

✅ **Complete Schema** - All tables with proper relationships and indexes
✅ **Type-Safe Queries** - Real-time queries with TypeScript support
✅ **Mutations** - CRUD operations for all entities
✅ **Real-time Updates** - Automatic UI updates when data changes
✅ **File Storage** - Image upload and storage
✅ **Authentication** - User registration and login
✅ **Notifications** - Real-time notification system
✅ **Analytics** - Dashboard statistics and metrics
✅ **Optimized Indexes** - Fast queries with proper indexing

**Key Benefits:**
- No backend code to maintain
- Real-time by default
- TypeScript end-to-end
- Automatic scaling
- Built-in file storage
- Serverless deployment
- Instant UI updates when data changes

**Key Files Structure:**
```
convex/
├── schema.ts              # Database schema definition
├── users.ts              # User queries & mutations
├── products.ts           # Product queries & mutations
├── categories.ts         # Category queries & mutations
├── orders.ts             # Order queries & mutations
├── customers.ts          # Customer queries & mutations
├── notifications.ts      # Notification queries & mutations
├── dashboard.ts          # Dashboard analytics queries
├── auth.ts               # Authentication mutations
└── files.ts              # File storage mutations
```

---

**This documentation provides everything needed for an LLM to implement a complete Convex backend for the Antig platform.**
