import { StatCard } from "@/components/shared/StatCard";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { CreditCard, DollarSign, Package, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

// --- Data will come from services/mock-data or API ---
const revenueData = [
    { name: "يناير", total: 1500 },
    { name: "فبراير", total: 2300 },
    { name: "مارس", total: 3200 },
    { name: "أبريل", total: 4500 },
    { name: "مايو", total: 3800 },
    { name: "يونيو", total: 5200 },
];

const salesData = [
    { name: "غرف النوم", sales: 45 },
    { name: "المكاتب", sales: 32 },
    { name: "الكنب", sales: 78 },
    { name: "الطاولات", sales: 25 },
];

export default async function DashboardPage() {
    return (
        <div className="space-y-10 pb-20 max-w-7xl mx-auto" dir="rtl">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-4">
                <div className="space-y-2 text-right w-full">
                    <h2 className="text-4xl font-black tracking-tight text-[#242C5A]">لوحة التحكم</h2>
                    <div className="flex items-center gap-3">
                        <div className="h-1.5 w-12 bg-primary rounded-full" />
                        <p className="text-gray-400 text-lg font-bold">مرحباً بك مجدداً، أحمد. إليك ملخص أداء متجرك اليوم.</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Button variant="outline" className="rounded-2xl h-14 px-8 font-black border-gray-100 hover:bg-gray-50 text-[#242C5A] shadow-none transition-all w-full sm:w-auto">الإحصائيات السنوية</Button>
                    <Button className="bg-[#242C5A] hover:bg-[#1a2144] rounded-2xl h-14 px-10 font-black text-white shadow-none transition-all w-full sm:w-auto">تصدير التقرير</Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="إجمالي المبيعات"
                    value="45,231.89 ر.س"
                    icon={DollarSign}
                    trend={{ value: 20.1, label: "مقارنة بالشهر الماضي", positive: true }}
                />
                <StatCard
                    title="الطلبـات الجديدة"
                    value="+573"
                    icon={CreditCard}
                    trend={{ value: 12, label: "مقارنة بالشهر الماضي", positive: true }}
                />
                <StatCard
                    title="المنتجات النشطة"
                    value="124"
                    icon={Package}
                    description="12 منتج نفذت كميته"
                />
                <StatCard
                    title="العملاء الجدد"
                    value="+24"
                    icon={Users}
                    trend={{ value: 4, label: "مقارنة بالشهر الماضي", positive: false }}
                />
            </div>

            {/* Charts Client Component */}
            <DashboardCharts revenueData={revenueData} salesData={salesData} />

            {/* Quick Actions & Recent Orders */}
            <div className="grid gap-8 md:grid-cols-7">
                <div className="col-span-4 bg-white border border-gray-100 rounded-3xl p-10 overflow-hidden shadow-none h-full transition-all hover:border-[#242C5A]/10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1 text-right">
                            <h3 className="text-2xl font-black text-[#242C5A]">أحدث الطلبات</h3>
                            <p className="text-base text-gray-400 font-bold">مراقبة حالة الطلبات الأخيرة لمتجرك</p>
                        </div>
                        <Link href="/orders">
                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 gap-2 rounded-xl font-black transition-all pr-4 pl-3">
                                <ArrowLeft className="h-5 w-5" />
                                <span>عرض الكل</span>
                            </Button>
                        </Link>
                    </div>
                    <RecentOrdersTable />
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
