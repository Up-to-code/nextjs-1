import { query, mutation } from './_generated/server';
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
        status: v.optional(v.union(v.literal('active'), v.literal('inactive'))),
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
