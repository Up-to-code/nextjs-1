"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrg } from "@/lib/stores/org-store";
import { Category } from "@/types";

export function useCategories() {
    const organization = useOrg();
    const categoriesValue = useQuery(api.categories.list, organization?.id ? { orgId: organization.id } : "skip");

    const isLoading = categoriesValue === undefined;

    const categories: Category[] = categoriesValue?.map((category: any) => ({
        id: category._id,
        name: category.name,
        nameEn: category.nameEn || "",
        description: category.description || "",
        productCount: 0, // This would ideally come from the backend or a separate query
        slug: category.name?.toLowerCase().replace(/\s+/g, '-') || "",
        image: category.image || "",
        order: category.order || 0,
        status: category.status,
        createdAt: new Date(category.createdAt),
        updatedAt: category.updatedAt ? new Date(category.updatedAt) : undefined,
    })) || [];

    return {
        categories,
        isLoading
    };
}
