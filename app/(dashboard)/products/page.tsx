"use client";

import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, PackageSearch, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { columns } from "@/components/features/products/ProductColumns";
import { Product } from "@/types";
import { ProductSearch } from "@/components/features/products/ProductSearch";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrg, useOrgLoading } from "@/lib/stores/org-store";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/shared/EmptyState";
import { usePermission } from "@/hooks/use-permission";

export default function ProductsPage() {
    const organization = useOrg();
    const isOrgLoading = useOrgLoading();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    // Permission Check
    const { hasPermission, isLoading: isPermissionLoading } = usePermission('manageProducts');

    // Fetch products and categories
    const shouldFetch = !!organization?.id && hasPermission;
    const products = useQuery(api.products.list, shouldFetch ? { orgId: organization.id } : "skip");
    const categories = useQuery(api.categories.list, shouldFetch ? { orgId: organization.id } : "skip");

    const isDataLoading = (shouldFetch && products === undefined) || isPermissionLoading;

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

    const filteredProducts = formattedProducts.filter((product: any) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.sku?.toLowerCase().includes(query.toLowerCase())
    );

    // If explicitly loading AND no organization data yet, show full page loader
    if (isOrgLoading && !organization) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!organization || !organization.id) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                <div className="bg-slate-50 p-6 rounded-full mb-4">
                    <PackageSearch className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-[#242C5A] mb-2">اختر المنشأة أولاً</h3>
                <p className="text-gray-500 max-w-sm">
                    يجب عليك اختيار المنشأة أو إنشاؤها لتمكن من إدارة المنتجات.
                </p>
                <Link href="/organization" className="mt-6">
                    <Button className="bg-[#242C5A] text-white">الذهاب للمنشأة</Button>
                </Link>
            </div>
        );
    }

    if (isDataLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!hasPermission) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                <div className="bg-red-50 p-6 rounded-full mb-4">
                    <ShieldAlert className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-[#242C5A] mb-2">ليس لديك صلاحية</h3>
                <p className="text-gray-500 max-w-sm">
                    عذراً، ليس لديك الصلاحية لإدارة المنتجات والمخزون. يرجى التواصل مع مسؤول المنشأة.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">المنتجات</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        إدارة منتجاتك، تتبع المخزون، وتحديث الأسعار
                    </p>
                </div>
                <Link href="/products/new">
                    <Button className="bg-[#1E1E2D] hover:bg-[#2a2a3f] h-12 rounded-xl font-bold">
                        <Plus className="ml-2 h-4 w-4" />
                        إضافة منتج جديد
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200/60 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/30">
                    <ProductSearch defaultValue={query} />
                </div>

                <div className="p-0">
                    <DataTable
                        columns={columns}
                        data={filteredProducts}
                        emptyState={
                            <EmptyState
                                title="لا توجد منتجات حتى الآن"
                                description="ابدأ بإضافة منتجاتك الأولى وقم بإدارة مخزونك بكل سهولة."
                            />
                        }
                    />
                </div>
            </div>
        </div>
    );
}
