import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Sync WorkOS organization to Convex
export const sync = mutation({
    args: {
        workosOrgId: v.string(),
        name: v.string(),
        slug: v.optional(v.string()),
        // Extended fields optional during sync
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        address: v.optional(v.string()),
        description: v.optional(v.string()),
        logo: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query('organizations')
            .withIndex('by_workos_id', (q) => q.eq('workosOrgId', args.workosOrgId))
            .first();

        if (existing) {
            // Update
            await ctx.db.patch(existing._id, {
                name: args.name,
                slug: args.slug,
                updatedAt: Date.now(),
                // Merge extended fields if provided
                ...(args.email && { email: args.email }),
                ...(args.phone && { phone: args.phone }),
                ...(args.address && { address: args.address }),
                ...(args.description && { description: args.description }),
                ...(args.logo && { logo: args.logo }),
            });
            return existing._id;
        } else {
            // Create
            const newId = await ctx.db.insert('organizations', {
                workosOrgId: args.workosOrgId,
                name: args.name,
                slug: args.slug,
                email: args.email,
                phone: args.phone,
                address: args.address,
                description: args.description,
                logo: args.logo,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
            return newId;
        }
    },
});

// Get organization by WorkOS ID using implicit WorkOS ID from context or passed arg?
// For public or component use, we pass ID.
export const get = query({
    args: { workosOrgId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('organizations')
            .withIndex('by_workos_id', (q) => q.eq('workosOrgId', args.workosOrgId))
            .first();
    },
});

// Compare organization data between WorkOS and Convex
// Returns differences if any
export const compareWithWorkOS = query({
    args: {
        workosOrgId: v.string(),
        workosData: v.object({
            name: v.string(),
            email: v.optional(v.string()),
            phone: v.optional(v.string()),
            address: v.optional(v.string()),
            description: v.optional(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        const convexOrg = await ctx.db
            .query('organizations')
            .withIndex('by_workos_id', (q) => q.eq('workosOrgId', args.workosOrgId))
            .first();

        if (!convexOrg) {
            return {
                needsSync: true,
                differences: {
                    exists: false,
                    message: 'Organization not found in Convex, needs sync',
                },
            };
        }

        // Compare fields
        const differences: Record<string, { workos: any; convex: any }> = {};

        if (convexOrg.name !== args.workosData.name) {
            differences.name = { workos: args.workosData.name, convex: convexOrg.name };
        }

        if (convexOrg.email !== args.workosData.email) {
            differences.email = { workos: args.workosData.email, convex: convexOrg.email };
        }

        if (convexOrg.phone !== args.workosData.phone) {
            differences.phone = { workos: args.workosData.phone, convex: convexOrg.phone };
        }

        if (convexOrg.address !== args.workosData.address) {
            differences.address = { workos: args.workosData.address, convex: convexOrg.address };
        }

        if (convexOrg.description !== args.workosData.description) {
            differences.description = { workos: args.workosData.description, convex: convexOrg.description };
        }

        return {
            needsSync: Object.keys(differences).length > 0,
            differences,
            convexOrg,
        };
    },
});
