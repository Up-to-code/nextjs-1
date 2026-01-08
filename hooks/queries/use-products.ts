"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrg } from "@/lib/stores/org-store";
import { Product } from "@/types";

export function useProducts() {
    const organization = useOrg();
    const products = useQuery(api.products.list, organization?.id ? { orgId: organization.id } : "skip");
    const categories = useQuery(api.categories.list, organization?.id ? { orgId: organization.id } : "skip");

    const isLoading = products === undefined || categories === undefined;

    const formattedProducts: Product[] = products?.map((product: any) => {
        const category = categories?.find((c: any) => c._id === product.categoryId);
        return {
            id: product._id,
            name: product.name,
            nameEn: product.nameEn || "",
            description: product.description || "",
            categoryId: product.categoryId,
            category: category?.name || "غير مصنف",
            price: product.price,
            stock: product.stock,
            sku: product.sku || "-",
            status: product.status as 'active' | 'inactive',
            images: product.images || [],
            createdAt: product.createdAt,
            updatedAt: product.updatedAt || product.createdAt,
        };
    }) || [];

    return {
        products: formattedProducts,
        isLoading,
        categories
    };
}
