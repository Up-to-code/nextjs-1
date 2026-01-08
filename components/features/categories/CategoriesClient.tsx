"use client";

import { useState } from "react";
import { Category } from "@/types";
import { DataTable } from "@/components/shared/DataTable";
import { getCategoryColumns } from "@/app/(dashboard)/categories/columns";
import { AddCategoryDialog } from "@/components/features/categories/AddCategoryDialog";
import { EditCategoryDialog } from "@/components/features/categories/EditCategoryDialog";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrg } from "@/lib/stores/org-store";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";

interface CategoriesClientProps {
    initialCategories: Category[]; // Kept for interface compatibility but ignoring value
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
    const organization = useOrg();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Fetch categories
    const categories = useQuery(api.categories.list, organization?.id ? { orgId: organization.id } : "skip");
    const removeCategory = useMutation(api.categories.remove);

    const handleDelete = async (id: string) => {
        if (!organization?.id) return;
        try {
            await removeCategory({ id: id as any, orgId: organization.id });
            toast.success("تم حذف التصنيف بنجاح");
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء حذف التصنيف");
        }
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsEditOpen(true);
    };

    const columns = getCategoryColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
    });

    // Map Convex data to Category type
    const formattedCategories: Category[] = categories?.map((c: any) => ({
        id: c._id,
        name: c.name,
        nameEn: c.nameEn || "",
        description: c.description || "",
        productCount: 0,
        createdAt: new Date(c.createdAt),
        order: c.order || 0,
        slug: c.slug || "",
        status: c.status || "active",
    })) || [];

    const isLoading = categories === undefined;

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={formattedCategories}
                    isLoading={isLoading}
                    emptyState={
                        <EmptyState
                            title="لا توجد تصنيفات حتى الآن"
                            description="قم بإضافة تصنيفات لتنظيم منتجاتك بشكل أفضل."
                        />
                    }
                />
            </div>

            <AddCategoryDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
            <EditCategoryDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                category={selectedCategory}
            />
        </>
    );
}
