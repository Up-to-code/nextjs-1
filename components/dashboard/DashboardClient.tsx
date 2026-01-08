"use client";

import { useDashboardStats } from "@/hooks/queries/use-dashboard-stats";
import { useOrg } from "@/lib/stores/org-store";
import { StatCard } from "@/components/shared/StatCard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/dashboard/DateRangePicker";
import { Download, Loader2, DollarSign, CreditCard, Package, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function DashboardClient() {
    // Custom Hook handles data fetching and state
    const {
        stats,
        trends,
        chartData,
        recentOrders,
        salesByCategory,
        dateRange,
        setDateRange,
        isLoading,
        organization
    } = useDashboardStats();

    // If explicitly loading AND no organization data yet, show full page loader?
    // Actually our hook handles "organization" null check internally but we might want to wait for org load
    if (!organization || isLoading) return <div className="p-8 flex items-center gap-2"><Loader2 className="animate-spin" /> جاري تحميل البيانات...</div>;

    // Transform chart data for Recharts if needed, or pass directly if format matches
    const formattedChartData = chartData.map((d: any) => ({
        name: d.date,
        total: d.revenue, // For revenue chart
        orders: d.orders, // For orders chart (if added)
    }));

    return (
        <div className="space-y-10 pb-20 max-w-7xl mx-auto" dir="rtl">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-4">
                <div className="space-y-2 text-right w-full">
                    <h2 className="text-4xl font-black tracking-tight text-[#242C5A]">لوحة التحكم</h2>
                    <div className="flex items-center gap-3">
                        <div className="h-1.5 w-12 bg-primary rounded-full" />
                        <p className="text-gray-400 text-lg font-bold">ملخص أداء متجرك لهذا الفترة.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />
                    <Button className="bg-[#242C5A] hover:bg-[#1a2144] rounded-2xl h-10 px-6 font-black text-white shadow-none transition-all">
                        تصدير
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="إجمالي المبيعات"
                    value={`${stats.revenue.toLocaleString()} ر.س`}
                    icon={DollarSign}
                    trend={{ value: Math.abs(trends.revenue), positive: trends.revenue >= 0, label: "مقارنة بالفترة السابقة" }}
                />
                <StatCard
                    title="الطلبـات"
                    value={stats.orders.toString()}
                    icon={CreditCard}
                    trend={{ value: Math.abs(trends.orders), positive: trends.orders >= 0, label: "مقارنة بالفترة السابقة" }}
                />
                <StatCard
                    title="المنتجات النشطة"
                    value={stats.products.toString()}
                    icon={Package}
                    // trends.products is currently 0, so maybe hide it or show as stable
                    trend={{ value: Math.abs(trends.products), positive: trends.products >= 0, label: "مقارنة بالفترة السابقة" }}
                />
                <StatCard
                    title="العملاء"
                    value={stats.customers.toString()}
                    icon={Users}
                    trend={{ value: Math.abs(trends.customers), positive: trends.customers >= 0, label: "مقارنة بالفترة السابقة" }}
                />
            </div>

            {/* Charts */}
            <DashboardCharts revenueData={formattedChartData} salesData={[]} />
            {/* Note: salesData (category breakdown) needs another backend aggregation or computed from orders */}

            {/* Quick Actions & Recent Orders */}
            <div className="grid gap-8 md:grid-cols-7">
                <div className="col-span-4 bg-white border border-gray-100 rounded-3xl p-10 overflow-hidden shadow-none h-full transition-all hover:border-[#242C5A]/10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1 text-right">
                            <h3 className="text-2xl font-black text-[#242C5A]">أحدث الطلبات</h3>
                            <p className="text-base text-gray-400 font-bold">آخر 5 طلبات في الفترة المحددة</p>
                        </div>
                        <Link href="/orders">
                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 gap-2 rounded-xl font-black transition-all pr-4 pl-3">
                                <ArrowLeft className="h-5 w-5" />
                                <span>عرض الكل</span>
                            </Button>
                        </Link>
                    </div>
                    {/* Pass real data to RecentOrdersTable */}
                    <RecentOrdersTable orders={recentOrders} />
                </div>
                <div className="col-span-3 space-y-8 h-full">
                    <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-none h-full transition-all hover:border-[#242C5A]/10">
                        <div className="space-y-1 mb-8 text-right">
                            <h3 className="text-2xl font-black text-[#242C5A]">إجراءات سريعة</h3>
                            <p className="text-base text-gray-400 font-bold">الوصول السريع للمهام المتكررة</p>
                        </div>
                        <QuickActions />
                    </div>
                </div>
            </div>
        </div>
    );
}
