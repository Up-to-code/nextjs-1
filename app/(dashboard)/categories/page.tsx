"use client";

import { Button } from "@/components/ui/button";
import { Plus, Loader2, PackageSearch } from "lucide-react";
import { CategorySearch } from "@/components/features/categories/CategorySearch";
import { CategoriesClient } from "@/components/features/categories/CategoriesClient";
import Link from "next/link";
import { useCategories } from "@/hooks/queries/use-categories";
import { useSearchParams } from "next/navigation";
import { useOrg, useOrgLoading } from "@/lib/stores/org-store";

export default function CategoriesPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q")?.toLowerCase() || "";

    const { categories, isLoading: isCategoriesLoading } = useCategories();
    const organization = useOrg();
    const isOrgLoading = useOrgLoading();

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
                    يجب عليك اختيار المنشأة أو إنشاؤها لتمكن من إدارة التصنيفات.
                </p>
                <Link href="/organization" className="mt-6">
                    <Button className="bg-[#242C5A] text-white">الذهاب للمنشأة</Button>
                </Link>
            </div>
        );
    }

    if (isCategoriesLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    // Client-side filtering
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query)
    );

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-4">
                <div className="space-y-1">
                    <h2 className="text-4xl font-extrabold tracking-tight text-[#242C5A]">التصنيفات</h2>
                    <p className="text-gray-400 text-lg font-medium">إدارة تصنيفات المنتجات وتنظيمها بدقة.</p>
                </div>
                <Button className="bg-[#242C5A] hover:bg-[#2a346e] h-12 px-6 rounded-xl font-bold gap-2">
                    <Plus className="h-5 w-5" />
                    إضافة تصنيف
                </Button>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <CategorySearch defaultValue={query} />
                </div>
                <CategoriesClient initialCategories={filteredCategories} />
            </div>
        </div>
    );
}
