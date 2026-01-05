"use client";

import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { RevenueChart } from "@/components/features/analytics/RevenueChart";
import { SalesByCategoryChart } from "@/components/features/analytics/SalesByCategoryChart";
import { TopProductsTable } from "@/components/features/analytics/TopProductsTable";
import { StatCard } from "@/components/shared/StatCard";
import { addDays } from "date-fns";
import {
    Users,
    TrendingUp,
    Target,
    DollarSign,
    BarChart3
} from "lucide-react";

export default function AnalyticsPage() {
    // Mock date range state usage if needed in future
    const date = {
        from: new Date(2024, 0, 1),
        to: addDays(new Date(2024, 0, 1), 30),
    };

    return (
        <div className="space-y-10 pb-20 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-4">
                <div className="space-y-2 w-full text-right">
                    <h2 className="text-4xl font-black tracking-tight text-[#242C5A]">التقارير والتحليلات</h2>
                    <p className="text-gray-400 text-lg font-medium">نظرة شاملة على أداء متجرك ومبيعاتك بالتفصيل.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <DatePickerWithRange className="w-full sm:w-[300px]" />
                    <Button variant="outline" className="rounded-xl h-12 px-8 font-bold border-gray-200 hover:bg-gray-50 text-[#242C5A] gap-3 w-full sm:w-auto transition-all shadow-none">
                        <Download className="h-5 w-5" />
                        <span>تصدير البيانات</span>
                    </Button>
                </div>
            </div>

            {/* Dashboard Insights Summary */}
            <div className="grid gap-6 md:grid-cols-4">
                <StatCard
                    title="متوسط قيمة الطلب"
                    value="420 ر.س"
                    icon={TrendingUp}
                    trend={{ value: 12, label: "مقارنة بالشهر الماضي", positive: true }}
                />
                <StatCard
                    title="معدل التحويل"
                    value="3.2%"
                    icon={Target}
                    trend={{ value: 5, label: "مستقر تقريباً", positive: true }}
                />
                <StatCard
                    title="الزوار الجدد"
                    value="1,240"
                    icon={Users}
                />
                <StatCard
                    title="صافي الأرباح"
                    value="12,500 ر.س"
                    icon={DollarSign}
                    trend={{ value: 8, label: "نمو مستمر", positive: true }}
                />
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                <div className="lg:col-span-4">
                    <RevenueChart />
                </div>
                <div className="lg:col-span-3">
                    <SalesByCategoryChart />
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                <div className="lg:col-span-3">
                    <TopProductsTable />
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
