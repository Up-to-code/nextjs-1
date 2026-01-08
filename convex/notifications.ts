import { query, mutation } from './_generated/server';
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
        type: v.union(
            v.literal('order'),
            v.literal('product'),
            v.literal('message'),
            v.literal('system')
        ),
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
