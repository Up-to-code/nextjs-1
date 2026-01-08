import { query, mutation } from './_generated/server';
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
    },
    handler: async (ctx, args) => {
        const orders = await ctx.db
            .query('orders')
            .withIndex('by_user', (q) => q.eq('userId', args.userId))
            .filter((q) => q.eq(q.field('orderStatus'), args.status))
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
        paymentMethod: v.union(
            v.literal('cash'),
            v.literal('card'),
            v.literal('bank_transfer')
        ),
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
        paymentStatus: v.union(
            v.literal('paid'),
            v.literal('unpaid'),
            v.literal('refunded')
        ),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.orderId, {
            paymentStatus: args.paymentStatus,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});
