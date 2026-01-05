"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";
import { MOCK_USER } from "@/services/mock-data";
import { toast } from "sonner";

export function useOrganization() {
    const [organization, setOrganization] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOrganization(MOCK_USER);
            setIsLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, []);

    const updateOrganization = async (data: Partial<User>) => {
        setIsLoading(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 800));
        setOrganization(prev => prev ? { ...prev, ...data } : null);
        setIsLoading(false);
        toast.success("تم تحديث بيانات المنشأة");
    };

    return {
        organization,
        isLoading,
        updateOrganization,
    };
}
