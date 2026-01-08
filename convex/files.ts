import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Generate upload URL
export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

// Get file URL
export const getFileUrl = query({
    args: { storageId: v.id('_storage') },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});

// Save uploaded file reference
export const saveDocument = mutation({
    args: {
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
    },
    handler: async (ctx, args) => {
        const documentId = await ctx.db.insert('documents', {
            ...args,
            status: 'pending',
            createdAt: Date.now(),
        });

        return documentId;
    },
});

// Get user documents
export const getUserDocuments = query({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('documents')
            .withIndex('by_user', (q) => q.eq('userId', args.userId))
            .collect();
    },
});
