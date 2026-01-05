"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const topProducts = [
    {
        name: "كرسي مريح للألعاب",
        sales: 120,
        revenue: "45,000 ر.س",
        image: "/products/chair.png",
    },
    {
        name: "مكتب زاوية حديث",
        sales: 85,
        revenue: "38,250 ر.س",
        image: "/products/desk.png",
    },
    {
        name: "مصباح مكتبي ذكي",
        sales: 240,
        revenue: "24,000 ر.س",
        image: "/products/lamp.png",
    },
    {
        name: "وحدة تخزين خشبية",
        sales: 45,
        revenue: "15,750 ر.س",
        image: "/products/storage.png",
    },
    {
        name: "طاولة قهوة زجاجية",
        sales: 30,
        revenue: "9,000 ر.س",
        image: "/products/coffee-table.png",
    },
];

export function TopProductsTable() {
    return (
        <div className="premium-card p-10 bg-white border border-gray-100 rounded-[2rem] h-full shadow-none relative overflow-hidden lg:col-span-3">
            <div className="space-y-2 mb-10">
                <h3 className="text-2xl font-black text-[#242C5A]">المنتجات الأكثر مبيعاً</h3>
                <p className="text-gray-400 font-bold text-sm">أفضل 5 منتجات تحقيقاً للأرباح هذا الشهر</p>
            </div>
            <div className="space-y-6">
                {topProducts.map((product, index) => (
                    <div className="flex items-center group h-16 px-4 rounded-2xl hover:bg-gray-50 transition-colors" key={index}>
                        <Avatar className="h-12 w-12 rounded-xl border-none shadow-none">
                            <AvatarImage src={product.image} alt={product.name} />
                            <AvatarFallback className="bg-gray-100 text-[#242C5A] font-black">{product.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="mr-5 space-y-1">
                            <p className="text-sm font-black text-[#242C5A] leading-none group-hover:text-primary transition-colors">{product.name}</p>
                            <p className="text-xs text-gray-400 font-bold">{product.sales} مبيعات</p>
                        </div>
                        <div className="mr-auto font-black text-[#242C5A]">
                            {product.revenue}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
