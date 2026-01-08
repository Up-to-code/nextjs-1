import { query, mutation } from './_generated/server';
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
        const query = ctx.db
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

// Create product
export const createProduct = mutation({
    args: {
        userId: v.id('users'),
        name: v.string(),
        nameEn: v.string(),
        description: v.string(),
        descriptionEn: v.optional(v.string()),
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
        descriptionEn: v.optional(v.string()),
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
        status: v.optional(v.union(v.literal('active'), v.literal('inactive'))),
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
