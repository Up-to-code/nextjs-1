"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";

interface SalesByCategoryChartProps {
    data?: any[];
}

const defaultData = [
    { name: "إلكترونيات", value: 4500, color: "#242C5A" },
    { name: "ملابس", value: 3200, color: "#4F46E5" },
    { name: "أثاث", value: 2800, color: "#7C3AED" },
    { name: "كتب", value: 1500, color: "#A855F7" },
];

export function SalesByCategoryChart({ data = defaultData }: SalesByCategoryChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="premium-card p-10 bg-white border border-gray-100 rounded-[2rem] h-[550px]" />;
    }

    // Check if we have actual data
    const hasData = data.length > 0 && data.some((d: any) => d.value > 0);

    return (
        <div className="premium-card p-10 bg-white border border-gray-100 rounded-[2rem] h-full shadow-none relative overflow-hidden lg:col-span-3">
            <div className="space-y-2 mb-10">
                <h3 className="text-2xl font-black text-[#242C5A]">المبيعات حسب التصنيف</h3>
                <p className="text-gray-400 font-bold text-sm">توزيع الإيرادات على مختلف التصنيفات</p>
            </div>
            {!hasData ? (
                <div className="h-[380px] w-full flex flex-col items-center justify-center text-gray-400">
                    <p className="font-bold">لا توجد بيانات تصنيفات حالياً</p>
                    <p className="text-sm mt-2">ستظهر البيانات بعد تصنيف المنتجات والطلبات</p>
                </div>
            ) : (
                <div className="h-[380px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: '1px solid #F1F5F9', boxShadow: 'none', fontWeight: 'bold' }}
                                formatter={(value: any) => [`${value} ر.س`, "الإيرادات"]}
                            />
                            <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                iconType="circle"
                                formatter={(value) => <span className="text-gray-500 font-bold text-xs mx-1">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
