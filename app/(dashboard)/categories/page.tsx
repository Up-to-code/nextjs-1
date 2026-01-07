import { MOCK_CATEGORIES } from "@/services/mock-data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategorySearch } from "@/components/features/categories/CategorySearch";
import { CategoriesClient } from "@/components/features/categories/CategoriesClient";
import Link from "next/link";

export default async function CategoriesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const query = q?.toLowerCase() || "";

    // Server-side filtering
    const filteredCategories = MOCK_CATEGORIES.filter((category) =>
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
