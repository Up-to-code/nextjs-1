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
