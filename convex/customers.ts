import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Get customer by ID
export const getCustomer = query({
    args: { customerId: v.id('customers') },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.customerId);
    },
});

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
