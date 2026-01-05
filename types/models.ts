/**
 * @file models.ts
 * @description Unified domain models for the Partner Dashboard.
 * Keeps the codebase simple, clean, and easy to read.
 */

// --- Common Types ---

export type Status = 'active' | 'inactive';

// --- User & Organization ---

export interface BankAccount {
    accountNumber: string;
    bankName: string;
    iban: string;
}

export interface UserSettings {
    language: 'ar' | 'en';
    timezone: string;
    currency: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    inAppNotifications: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    businessName: string;
    businessDescription?: string;
    address: string;
    commercialRegistration?: string;
    taxId?: string;
    bankAccount?: BankAccount;
    settings: UserSettings;
    verified: boolean;
    status: Status;
    createdAt: Date;
}

export interface Employee {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    status: Status;
    lastActive: string;
}

// --- Catalog Models ---

export interface Category {
    id: string;
    name: string;
    nameEn: string;
    description?: string;
    image?: string;
    parentId?: string | null;
    order: number;
    slug: string;
    productCount: number;
    status: Status;
    createdAt: Date;
    updatedAt?: Date;
}

export interface Product {
    id: string;
    name: string;
    nameEn: string;
    description: string;
    category: string;
    categoryId: string;
    price: number;
    originalPrice?: number;
    stock: number;
    sku: string;
    images: string[];
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    status: Status;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

// --- Order Models ---

export type OrderStatus =
    | 'pending'
    | 'processing'
    | 'shipping'
    | 'delivered'
    | 'completed'
    | 'cancelled'
    | 'returning'
    | 'returned';

export type PaymentStatus = 'paid' | 'unpaid' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer';

export interface OrderItem {
    productId: string;
    productName: string;
    productImage: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
}

export interface OrderStatusHistory {
    status: OrderStatus;
    note?: string;
    timestamp: Date;
    updatedBy: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    customerId: string;
    customer: Customer;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    tax: number;
    discount: number;
    total: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    shippingMethod?: string;
    trackingNumber?: string;
    notes?: string;
    scheduledDate?: Date;
    statusHistory: OrderStatusHistory[];
    createdAt: Date;
    updatedAt: Date;
}

// --- Notification Models ---

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'order' | 'product' | 'system';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    createdAt: string;
    link?: string;
}

// --- Input/DTO Types ---

export interface CreateProductInput extends Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'category'> { }
export interface UpdateProductInput extends Partial<CreateProductInput> {
    id: string;
}

export interface CreateCategoryInput extends Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount' | 'slug' | 'status'> { }

export interface UpdateOrderStatusInput {
    orderId: string;
    status: OrderStatus;
    note?: string;
    notifyCustomer?: boolean;
}
