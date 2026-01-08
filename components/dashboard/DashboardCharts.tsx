"use client";

import {
    Bar,
    BarChart,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { ChartWrapper } from "@/components/shared/ChartWrapper";
import { useEffect, useState } from "react";

interface DashboardChartsProps {
    revenueData: any[];
    salesData: any[];
}

export function DashboardCharts({ revenueData, salesData }: DashboardChartsProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 h-[350px]" />;
    }

    return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
            <ChartWrapper title="تحليلات الإيرادات" className="col-span-4">
                <div className="h-[350px] w-full mt-4 flex items-center justify-center">
                    {revenueData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#94A3B8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#94A3B8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: 'none', borderBottom: '1px solid #eee' }}
                                    formatter={(value: any) => [`${value} ر.س`, "الإيرادات"]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#242C5A"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6, fill: "#242C5A", strokeWidth: 2, stroke: "#fff" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400">لا توجد بيانات إيرادات لهذه الفترة</p>
                    )}
                </div>
            </ChartWrapper>

            <ChartWrapper title="المبيعات بالتصنيف" className="col-span-3">
                <div className="h-[350px] w-full mt-4 flex items-center justify-center">
                    {salesData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData} layout="vertical" margin={{ left: 0, right: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    stroke="#64748B"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    width={80}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(36, 44, 90, 0.02)' }}
                                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: 'none', borderBottom: '1px solid #eee' }}
                                />
                                <Bar dataKey="sales" fill="#242C5A" radius={[0, 10, 10, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400">لا توجد بيانات مبيعات لهذه الفترة</p>
                    )}
                </div>
            </ChartWrapper>
        </div>
    );
}
