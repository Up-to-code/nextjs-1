"use client";

import { useOrg, useOrgLoading } from "@/lib/stores/org-store";
import { usePermission } from "@/hooks/use-permission";
import { Loader2, PackageSearch, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductsClient } from "@/components/features/products/ProductsClient";

export default function ProductsPage() {
    // Permission Check
    const { hasPermission, isLoading: isPermissionLoading } = usePermission('manageProducts');
    const organization = useOrg();
    const isOrgLoading = useOrgLoading();

    const isLoading = isOrgLoading || isPermissionLoading;

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

    if (isLoading) {
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

    return <ProductsClient />;
}
