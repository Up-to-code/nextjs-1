"use client";

import { StatCard } from "@/components/shared/StatCard";
import { ShoppingCart, Clock, CheckCircle, XCircle, Loader2, PackageSearch, ShieldAlert } from "lucide-react";
import { OrderSearch } from "@/components/features/orders/OrderSearch";
import { OrdersClient } from "@/components/features/orders/OrdersClient";
import { useOrders } from "@/hooks/queries/use-orders";
import { useOrg } from "@/lib/stores/org-store";
import { useSearchParams } from "next/navigation";
import { Order } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/hooks/use-permission";

export default function OrdersPage() {
    const organization = useOrg();
    const searchParams = useSearchParams();
    const query = searchParams.get("q")?.toLowerCase() || "";

    // Permission Check
    const { hasPermission, isLoading: isPermissionLoading } = usePermission('viewOrders');
    const { orders: formattedOrders, isLoading: isOrdersLoading } = useOrders();

    const isLoading = isOrdersLoading || isPermissionLoading;

    // Client-side filtering
    const filteredOrders = formattedOrders.filter((order) =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query)
    );

    // Calculate Summary Stats
    const totalOrders = formattedOrders.length;
    const pendingOrders = formattedOrders.filter(o => o.orderStatus === 'pending').length;
    const completedOrders = formattedOrders.filter(o => o.orderStatus === 'delivered' || o.orderStatus === 'completed').length;
    const cancelledOrders = formattedOrders.filter(o => o.orderStatus === 'cancelled' || o.orderStatus === 'returned').length;

    if (!organization && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                <div className="bg-slate-50 p-6 rounded-full mb-4">
                    <PackageSearch className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-[#242C5A] mb-2">اختر المنشأة أولاً</h3>
                <p className="text-gray-500 max-w-sm">
                    يجب عليك اختيار المنشأة أو إنشاؤها لتمكن من إدارة الطلبات.
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
                    عذراً، ليس لديك الصلاحية لعرض الطلبات. يرجى التواصل مع مسؤول المنشأة.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-4">
                <div className="space-y-1">
                    <h2 className="text-4xl font-extrabold tracking-tight text-[#242C5A]">الطلبات</h2>
                    <p className="text-gray-400 text-lg font-medium">تتبع وإدارة جميع طلبات العملاء وحالات التوصيل.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-4">
                <StatCard
                    title="إجمالي الطلبات"
                    value={totalOrders}
                    icon={ShoppingCart}
                />
                <StatCard
                    title="قيد الانتظار"
                    value={pendingOrders}
                    icon={Clock}
                />
                <StatCard
                    title="مكتملة"
                    value={completedOrders}
                    icon={CheckCircle}
                />
                <StatCard
                    title="ملغاة"
                    value={cancelledOrders}
                    icon={XCircle}
                />
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <OrderSearch defaultValue={query} />
                </div>
                <OrdersClient initialOrders={filteredOrders} />
            </div>
        </div>
    );
}
