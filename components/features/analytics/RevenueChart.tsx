"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

const data = [
    { name: "يناير", total: 4500 },
    { name: "فبراير", total: 6200 },
    { name: "مارس", total: 5800 },
    { name: "أبريل", total: 9100 },
    { name: "مايو", total: 7600 },
    { name: "يونيو", total: 8800 },
    { name: "يوليو", total: 10500 },
];

export function RevenueChart() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="premium-card p-10 bg-white border border-gray-100 rounded-[2rem] h-[550px]" />;
    }

    return (
        <div className="premium-card p-10 bg-white border border-gray-100 rounded-[2rem] h-full shadow-none relative overflow-hidden lg:col-span-4">
            <div className="space-y-2 mb-10">
                <h3 className="text-2xl font-black text-[#242C5A]">الإيرادات الشهرية</h3>
                <p className="text-gray-400 font-bold text-sm">نظرة على نمو المبيعات خلال الأشهر الماضية</p>
            </div>
            <div className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
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
        </div>
    );
}
