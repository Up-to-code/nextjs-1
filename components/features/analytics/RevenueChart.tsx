"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

interface RevenueChartProps {
    data?: any[];
}

const defaultData = [
    { name: "يناير", total: 4000 },
    { name: "فبراير", total: 3500 },
    { name: "مارس", total: 5200 },
    { name: "أبريل", total: 4800 },
    { name: "مايو", total: 6100 },
    { name: "يونيو", total: 5800 },
];

export function RevenueChart({ data = defaultData }: RevenueChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="premium-card p-10 bg-white border border-gray-100 rounded-[2rem] h-[550px]" />;
    }

    // Map data to expected format (revenue -> total)
    const chartData = data.map((item: any) => ({
        name: item.date || item.name,
        total: item.revenue || item.total || 0
    }));

    // Check if we have actual data
    const hasData = chartData.length > 0 && chartData.some((d: any) => d.total > 0);

    return (
        <div className="premium-card p-10 bg-white border border-gray-100 rounded-[2rem] h-full shadow-none relative overflow-hidden lg:col-span-4">
            <div className="space-y-2 mb-10">
                <h3 className="text-2xl font-black text-[#242C5A]">الإيرادات الشهرية</h3>
                <p className="text-gray-400 font-bold text-sm">نظرة على نمو المبيعات خلال الأشهر الماضية</p>
            </div>
            {!hasData ? (
                <div className="h-[380px] w-full flex flex-col items-center justify-center text-gray-400">
                    <p className="font-bold">لا توجد بيانات إيرادات حالياً</p>
                    <p className="text-sm mt-2">ستظهر البيانات بعد إضافة طلبات</p>
                </div>
            ) : (
                <div className="h-[380px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#242C5A" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#242C5A" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis
                                dataKey="name"
                                stroke="#94A3B8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={15}
                            />
                            <YAxis
                                stroke="#94A3B8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                                dx={-15}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: '1px solid #F1F5F9',
                                    boxShadow: 'none',
                                    padding: '12px 16px',
                                    fontWeight: 'bold'
                                }}
                                cursor={{ stroke: '#242C5A', strokeWidth: 1, strokeDasharray: '4 4' }}
                                formatter={(value: any) => [`${value} ر.س`, 'الإيرادات']}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#242C5A"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                                activeDot={{ r: 6, fill: "#242C5A", stroke: "#FFF", strokeWidth: 3 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
