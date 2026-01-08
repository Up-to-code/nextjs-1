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
        address: v.string(),
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
