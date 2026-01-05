"use client";

import { Button } from "@/components/ui/button";
import { Plus, Settings, FileText, ShoppingBag } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
    return (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-2">
            <Link href="/products/new">
                <Button variant="outline" className="w-full h-20 items-center justify-start px-6 gap-4 rounded-xl border-gray-200 hover:bg-gray-50 hover:border-primary/20 transition-all group">
                    <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white">
                        <Plus className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="text-gray-900 font-bold">إضافة منتج</span>
                </Button>
            </Link>
            <Link href="/orders">
                <Button variant="outline" className="w-full h-20 items-center justify-start px-6 gap-4 rounded-xl border-gray-200 hover:bg-gray-50 hover:border-primary/20 transition-all group">
                    <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white">
                        <ShoppingBag className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="text-gray-900 font-bold">إدارة الطلبات</span>
                </Button>
            </Link>
            <Link href="/analytics">
                <Button variant="outline" className="w-full h-20 items-center justify-start px-6 gap-4 rounded-xl border-gray-200 hover:bg-gray-50 hover:border-primary/20 transition-all group">
                    <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white">
                        <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="text-gray-900 font-bold">التقارير</span>
                </Button>
            </Link>
            <Link href="/settings">
                <Button variant="outline" className="w-full h-20 items-center justify-start px-6 gap-4 rounded-xl border-gray-200 hover:bg-gray-50 hover:border-primary/20 transition-all group">
                    <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white">
                        <Settings className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="text-gray-900 font-bold">الإعدادات</span>
                </Button>
            </Link>
        </div>
    );
}
