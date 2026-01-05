"use client";

import { useState, useEffect, useCallback } from "react";
import { Category } from "@/types";
import { MOCK_CATEGORIES } from "@/services/mock-data";
import { toast } from "sonner";

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCategories(MOCK_CATEGORIES);
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const deleteCategory = useCallback(async (id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id));
        toast.success("تم حذف التصنيف بنجاح");
    }, []);

    const addCategory = useCallback(async (data: Partial<Category>) => {
        const newCategory: Category = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name || "",
            nameEn: data.nameEn || "",
            description: data.description || "",
            productCount: 0,
            slug: data.name?.toLowerCase().replace(/\s+/g, '-') || "",
            image: data.image || "",
            order: data.order || 0,
            status: data.status || "active",
            createdAt: new Date(),
        };
        setCategories(prev => [newCategory, ...prev]);
        toast.success("تم إضافة التصنيف بنجاح");
    }, []);

    const updateCategory = useCallback(async (id: string, data: Partial<Category>) => {
        setCategories(prev =>
            prev.map(c => (c.id === id ? { ...c, ...data, updatedAt: new Date() } : c))
        );
        toast.success("تم تحديث التصنيف بنجاح");
    }, []);

    return {
        categories,
        isLoading,
        deleteCategory,
        addCategory,
        updateCategory,
    };
}
