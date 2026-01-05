"use client";

import { useState, useEffect, useCallback } from "react";
import { Order } from "@/types";
import { MOCK_ORDERS } from "@/services/mock-data";
import { toast } from "sonner";

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOrders(MOCK_ORDERS);
            setIsLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    const updateOrder = useCallback(async (id: string, data: Partial<Order>) => {
        setOrders(prev =>
            prev.map(o => (o.id === id ? { ...o, ...data, updatedAt: new Date() } : o))
        );
        toast.success("تم تحديث الطلب بنجاح");
    }, []);

    const deleteOrder = useCallback(async (id: string) => {
        setOrders(prev => prev.filter(o => o.id !== id));
        toast.success("تم حذف الطلب بنجاح");
    }, []);

    return {
        orders,
        isLoading,
        updateOrder,
        deleteOrder
    };
}
