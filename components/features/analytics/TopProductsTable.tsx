"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopProductsTableProps {
    products?: any[];
}

const defaultProducts = [
    { name: "iPhone 15 Pro", sales: 128, revenue: 179999, image: "" },
    { name: "MacBook Air M3", sales: 85, revenue: 127499, image: "" },
    { name: "AirPods Pro", sales: 234, revenue: 58499, image: "" },
    { name: "iPad Pro", sales: 67, revenue: 53599, image: "" },
    { name: "Apple Watch", sales: 145, revenue: 43499, image: "" },
];

export function TopProductsTable({ products = defaultProducts }: TopProductsTableProps) {
    return (
        <div className="premium-card p-10 bg-white border border-gray-100 rounded-[2rem] h-full shadow-none relative overflow-hidden lg:col-span-3">
            <div className="space-y-2 mb-10">
                <h3 className="text-2xl font-black text-[#242C5A]">المنتجات الأكثر مبيعاً</h3>
                <p className="text-gray-400 font-bold text-sm">أفضل 5 منتجات تحقيقاً للأرباح هذا الشهر</p>
            </div>
            <div className="space-y-6">
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
                        <p>لا توجد بيانات للمنتجات</p>
                    </div>
                ) : (
                    products.map((product, index) => (
                        <div className="flex items-center group h-16 px-4 rounded-2xl hover:bg-gray-50 transition-colors" key={index}>
                            <Avatar className="h-12 w-12 rounded-xl border-none shadow-none">
                                <AvatarImage src={product.image || ""} alt={product.name} />
                                <AvatarFallback className="bg-gray-100 text-[#242C5A] font-black">{product.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="mr-5 space-y-1">
                                <p className="text-sm font-black text-[#242C5A] leading-none group-hover:text-primary transition-colors">{product.name}</p>
                                <p className="text-xs text-gray-400 font-bold">{product.sales} مبيعات</p>
                            </div>
                            <div className="mr-auto font-black text-[#242C5A]">
                                {typeof product.revenue === 'number' ? product.revenue.toLocaleString() : product.revenue}
                                <span className="text-xs mr-1 font-normal text-gray-400">ر.س</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
