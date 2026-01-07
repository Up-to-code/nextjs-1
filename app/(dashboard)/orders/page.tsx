import { MOCK_ORDERS } from "@/services/mock-data";
import { StatCard } from "@/components/shared/StatCard";
import { ShoppingCart, Clock, CheckCircle, XCircle } from "lucide-react";
import { OrderSearch } from "@/components/features/orders/OrderSearch";
import { OrdersClient } from "@/components/features/orders/OrdersClient";

export default async function OrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const query = q?.toLowerCase() || "";

    // Server-side filtering
    const filteredOrders = MOCK_ORDERS.filter((order) =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query)
    );

    // Calculate Summary Stats
    const totalOrders = MOCK_ORDERS.length;
    const pendingOrders = MOCK_ORDERS.filter(o => o.orderStatus === 'pending').length;
    const completedOrders = MOCK_ORDERS.filter(o => o.orderStatus === 'delivered' || o.orderStatus === 'completed').length;
    const cancelledOrders = MOCK_ORDERS.filter(o => o.orderStatus === 'cancelled' || o.orderStatus === 'returned').length;

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
