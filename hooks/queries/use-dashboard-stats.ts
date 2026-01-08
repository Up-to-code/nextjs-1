"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrg } from "@/lib/stores/org-store";
import { startOfMonth, endOfMonth } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export function useDashboardStats() {
    const organization = useOrg();
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    });

    const statsCallback = useQuery(api.analytics.getDashboardStats,
        organization ? {
            orgId: organization.id,
            startDate: dateRange?.from?.getTime(),
            endDate: dateRange?.to?.getTime(),
        } : "skip"
    );

    const stats = statsCallback?.stats || { revenue: 0, orders: 0, products: 0, customers: 0 };
    const trends = statsCallback?.trends || { revenue: 0, orders: 0, products: 0, customers: 0 };
    const chartData = (statsCallback?.chartData || []).map((d: any) => ({
        name: d.date,
        total: d.revenue
    }));
    const topProducts = statsCallback?.topProducts || [];
    const salesByCategory = statsCallback?.salesByCategory || [];
    const recentOrders = statsCallback?.recentOrders || [];

    const isLoading = statsCallback === undefined;

    return {
        stats,
        trends,
        chartData,
        topProducts,
        salesByCategory,
        recentOrders,
        dateRange,
        setDateRange,
        isLoading,
        organization
    };
}
