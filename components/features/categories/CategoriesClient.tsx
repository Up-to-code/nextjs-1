"use client";

import { useState } from "react";
import { Category } from "@/types";
import { DataTable } from "@/components/shared/DataTable";
import { getCategoryColumns } from "@/app/(dashboard)/categories/columns";
import { AddCategoryDialog } from "@/components/features/categories/AddCategoryDialog";
import { EditCategoryDialog } from "@/components/features/categories/EditCategoryDialog";
import { useCategories } from "@/hooks/use-categories";

interface CategoriesClientProps {
    initialCategories: Category[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
    const { deleteCategory, isLoading } = useCategories();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsEditOpen(true);
    };

    const columns = getCategoryColumns({
        onEdit: handleEdit,
        onDelete: deleteCategory,
    });

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={initialCategories}
                    isLoading={isLoading}
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
