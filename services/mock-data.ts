import { Product, Category, Order, Employee, Notification, User } from "@/types";

// --- Categories ---

export const MOCK_CATEGORIES: Category[] = [
    {
        id: "1",
        name: "مكاتب",
        nameEn: "Desks",
        description: "جميع أنواع المكاتب المنزلية والتجارية",
        productCount: 15,
        slug: "desks",
        image: "",
        order: 1,
        status: "active",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "2",
        name: "كراسي",
        nameEn: "Chairs",
        description: "كراسي مريحة وطبية",
        productCount: 24,
        slug: "chairs",
        image: "",
        order: 2,
        status: "active",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "3",
        name: "طاولات",
        nameEn: "Tables",
        description: "طاولات قهوة وطعام",
        productCount: 8,
        slug: "tables",
        image: "",
        order: 3,
        status: "active",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "4",
        name: "كنب",
        nameEn: "Sofas",
        description: "أطقم كنب وجلسات",
        productCount: 12,
        slug: "sofas",
        image: "",
        order: 4,
        status: "active",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
];

// --- Products ---

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "كرسي مكتب مريح",
        nameEn: "Ergonomic Office Chair",
        description: "كرسي مكتب مريح مع دعم للظهر وقابلية للتعديل",
        category: "المكاتب",
        categoryId: "1",
        price: 450,
        stock: 25,
        sku: "OFF-CH-001",
        images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80"],
        status: 'active',
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-05"),
    },
    {
        id: "2",
        name: "طاولة قهوة خشبية",
        nameEn: "Wooden Coffee Table",
        description: "طاولة قهوة مصنوعة من خشب البلوط الطبيعي",
        category: "الطاولات",
        categoryId: "3",
        price: 299,
        stock: 0,
        sku: "TBL-CF-002",
        images: ["https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&q=80"],
        status: 'inactive',
        createdAt: new Date("2024-01-06"),
        updatedAt: new Date("2024-01-06"),
    },
    {
        id: "3",
        name: "طقم كنب مودرن",
        nameEn: "Modern Sofa Set",
        description: "طقم كنب يتسع لـ 5 أشخاص تصميم عصري",
        category: "الكنب",
        categoryId: "4",
        price: 3500,
        stock: 5,
        sku: "SOF-MD-003",
        images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"],
        status: 'active',
        createdAt: new Date("2024-01-07"),
        updatedAt: new Date("2024-01-07"),
    },
    {
        id: "4",
        name: "سرير مزدوج فاخر",
        nameEn: "Luxury Double Bed",
        description: "سرير مزدوج مع مرتبة طبية فاخرة",
        category: "غرف النوم",
        categoryId: "cat-4",
        price: 2800,
        stock: 12,
        sku: "BED-OBL-004",
        images: ["https://images.unsplash.com/photo-1505693416388-b0346ef41439?w=800&q=80"],
        status: 'active',
        createdAt: new Date("2024-01-08"),
        updatedAt: new Date("2024-01-08"),
    },
];

// --- Orders ---

export const MOCK_ORDERS: Order[] = [
    {
        id: "1",
        orderNumber: "1001",
        customerId: "cust-1",
        customer: {
            id: "cust-1",
            name: "محمد أحمد",
            email: "mohamed@example.com",
            phone: "0500000001",
            address: "الرياض",
            city: "الرياض"
        },
        items: [],
        subtotal: 1200,
        shippingCost: 50,
        tax: 0,
        discount: 0,
        total: 1250,
        paymentMethod: "card",
        paymentStatus: "paid",
        orderStatus: "delivered",
        statusHistory: [],
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
    },
    {
        id: "2",
        orderNumber: "1002",
        customerId: "cust-2",
        customer: {
            id: "cust-2",
            name: "سارة علي",
            email: "sara@example.com",
            phone: "0500000002",
            address: "جدة",
            city: "جدة"
        },
        items: [],
        subtotal: 400,
        shippingCost: 50,
        tax: 0,
        discount: 0,
        total: 450,
        paymentMethod: "cash",
        paymentStatus: "unpaid",
        orderStatus: "processing",
        statusHistory: [],
        createdAt: new Date("2024-01-16"),
        updatedAt: new Date("2024-01-16"),
    },
];

// --- Employees ---

export const MOCK_EMPLOYEES: Employee[] = [
    {
        id: "1",
        name: "أحمد محمد",
        email: "ahmed@example.com",
        role: "admin",
        status: "active",
        lastActive: "منذ دقيقة",
    },
    {
        id: "2",
        name: "سارة علي",
        email: "sara@example.com",
        role: "editor",
        status: "active",
        lastActive: "منذ ساعة",
    },
    {
        id: "3",
        name: "خالد عبدالله",
        email: "khaled@example.com",
        role: "viewer",
        status: "inactive",
        lastActive: "منذ يومين",
    },
];

// --- Notifications ---

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'order',
        title: 'طلب جديد',
        message: 'طلب جديد (#12345) من أحمد محمد بقيمة 4,125 ر.س',
        read: false,
        link: '/orders/1',
        createdAt: new Date(Date.now() - 300000).toISOString(),
    },
    {
        id: '2',
        type: 'warning',
        title: 'تنبيه مخزون منخفض',
        message: 'مخزون منخفض لمنتج "سرير مزدوج" (متبقي 5 قطع)',
        read: false,
        link: '/products/4',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
];

// --- Organization & User ---

export const MOCK_USER: User = {
    id: "u-1",
    name: "مدير المتجر",
    email: "admin@elegance.com",
    phone: "0500000000",
    businessName: "منشأة الأثاث الحديث",
    businessDescription: "متجر رائد في بيع الأثاث العصري والحديث",
    address: "الرياض، المملكة العربية السعودية",
    settings: {
        language: 'ar',
        timezone: 'Asia/Riyadh',
        currency: 'SAR',
        emailNotifications: true,
        smsNotifications: false,
        inAppNotifications: true,
    },
    verified: true,
    status: 'active',
    createdAt: new Date("2023-11-20"),
};
