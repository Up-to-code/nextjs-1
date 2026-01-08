import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    // ============================================
    // USERS / PARTNERS TABLE
    // ============================================
    users: defineTable({
        workosUserId: v.optional(v.string()), // Linked WorkOS User ID
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
    // ============================================
    // ORGANIZATIONS TABLE (Synced from WorkOS)
    // ============================================
    organizations: defineTable({
        workosOrgId: v.string(), // External ID from WorkOS (org_...)
        name: v.string(),
        slug: v.optional(v.string()), // WorkOS doesn't always have slug but good to have

        // Extended data stored in DB
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        address: v.optional(v.string()),
        description: v.optional(v.string()),
        logo: v.optional(v.string()),

        createdAt: v.number(),
        updatedAt: v.optional(v.number()),
    })
        .index('by_workos_id', ['workosOrgId']),

    // ============================================
    // ORGANIZATION MEMBERSHIPS TABLE (User-Org relationships with roles)
    // ============================================
    organizationMemberships: defineTable({
        userId: v.id('users'),
        organizationId: v.id('organizations'),
        workosOrgId: v.string(), // WorkOS organization ID
        workosMembershipId: v.optional(v.string()), // WorkOS membership ID
        
        // Role in organization
        role: v.union(
            v.literal('owner'),   // Organization creator/owner
            v.literal('admin'),    // Administrator
            v.literal('member')    // Regular member
        ),
        
        // Status
        status: v.union(v.literal('active'), v.literal('inactive')),
        
        createdAt: v.number(),
        updatedAt: v.optional(v.number()),
    })
        .index('by_user', ['userId'])
        .index('by_organization', ['organizationId'])
        .index('by_user_and_org', ['userId', 'organizationId'])
        .index('by_role', ['role']),
});
