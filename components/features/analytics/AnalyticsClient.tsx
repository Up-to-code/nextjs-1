"use client";

import { useDashboardStats } from "@/hooks/queries/use-dashboard-stats";
import { CalendarDateRangePicker } from "@/components/dashboard/DateRangePicker";
import { Button } from "@/components/ui/button";
import { Download, Users, TrendingUp, Target, DollarSign, BarChart3, Loader2 } from "lucide-react";
import { RevenueChart } from "@/components/features/analytics/RevenueChart";
import { SalesByCategoryChart } from "@/components/features/analytics/SalesByCategoryChart";
import { TopProductsTable } from "@/components/features/analytics/TopProductsTable";
import { StatCard } from "@/components/shared/StatCard";

export function AnalyticsClient() {
    const {
        stats,
        trends,
        chartData,
        topProducts,
        salesByCategory,
        dateRange,
        setDateRange,
        isLoading,
        organization
    } = useDashboardStats();

    if (!organization || isLoading) return <div className="p-8 flex items-center gap-2"><Loader2 className="animate-spin" /> جاري تحميل البيانات...</div>;

    return (
        <div className="space-y-10 pb-20 max-w-7xl mx-auto" dir="rtl">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-4">
                <div className="space-y-2 w-full text-right">
                    <h2 className="text-4xl font-black tracking-tight text-[#242C5A]">التقارير والتحليلات</h2>
                    <p className="text-gray-400 text-lg font-medium">نظرة شاملة على أداء متجرك ومبيعاتك بالتفصيل.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <CalendarDateRangePicker date={dateRange} setDate={setDateRange} className="w-full sm:w-[300px]" />
                    <Button variant="outline" className="rounded-xl h-12 px-8 font-bold border-gray-200 hover:bg-gray-50 text-[#242C5A] gap-3 w-full sm:w-auto transition-all shadow-none">
                        <Download className="h-5 w-5" />
                        <span>تصدير البيانات</span>
                    </Button>
                </div>
            </div>

            {/* Dashboard Insights Summary */}
            <div className="grid gap-6 md:grid-cols-4">
                <StatCard
                    title="إجمالي الإيرادات"
                    value={stats.revenue.toLocaleString() + " ر.س"}
                    icon={TrendingUp}
                    trend={{ value: Math.abs(trends.revenue), label: "مقارنة بالفترة السابقة", positive: trends.revenue >= 0 }}
                />
                <StatCard
                    title="عدد الطلبات"
                    value={stats.orders.toString()}
                    icon={Target}
                    trend={{ value: Math.abs(trends.orders), label: "مقارنة بالفترة السابقة", positive: trends.orders >= 0 }}
                />
                <StatCard
                    title="الزوار (العملاء)"
                    value={stats.customers.toLocaleString()}
                    icon={Users}
                    trend={{ value: Math.abs(trends.customers), label: "مقارنة بالفترة السابقة", positive: trends.customers >= 0 }}
                />
                <StatCard
                    title="متوسط قيمة الطلب"
                    value={stats.orders > 0 ? Math.round(stats.revenue / stats.orders).toLocaleString() + " ر.س" : "0 ر.س"}
                    icon={DollarSign}
                // Trend for average value is (Rev/Order) change. We didn't compute this explicitly in backend.
                // We can compute it here or skip. Let's skip for now to avoid complexity or compute on client.
                // trend={{ value: 8, label: "نمو مستمر", positive: true }} 
                />
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                <div className="lg:col-span-4">
                    <RevenueChart data={chartData} />
                </div>
                <div className="lg:col-span-3">
                    <SalesByCategoryChart data={salesByCategory} />
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                <div className="lg:col-span-3">
                    <TopProductsTable products={topProducts} />
                </div>
                <div className="lg:col-span-4 bg-gray-50/50 border border-gray-100 border-dashed rounded-[2rem] flex flex-col items-center justify-center min-h-[400px] text-gray-400 p-10 text-center">
                    <div className="h-20 w-20 bg-gray-100 rounded-[2rem] flex items-center justify-center mb-6">
                        <BarChart3 className="h-10 w-10 opacity-30" />
                    </div>
                    <h4 className="text-xl font-black text-[#242C5A] opacity-50 mb-2">تحليلات متقدمة قريباً</h4>
                    <p className="max-w-md font-bold text-sm opacity-40">نعمل حالياً على تطوير تقارير أداء الموظفين، تحليل المصادر، وسلوك العملاء المتقدم.</p>
                </div>
            </div>
        </div>
    );
}
