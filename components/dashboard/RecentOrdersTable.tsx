"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const recentOrders = [
    {
        id: "ORDER-1234",
        customer: "أحمد محمد",
        status: "pending",
        total: "450.00 ر.س",
        date: "منذ 5 دقائق"
    },
    {
        id: "ORDER-1235",
        customer: "سارة علي",
        status: "shipping",
        total: "1,250.00 ر.س",
        date: "منذ ساعتين"
    },
    {
        id: "ORDER-1236",
        customer: "خالد عبدالله",
        status: "completed",
        total: "3,400.00 ر.س",
        date: "منذ 5 ساعات"
    },
    {
        id: "ORDER-1237",
        customer: "منى صابر",
        status: "cancelled",
        total: "220.00 ر.س",
        date: "الأمس"
    },
    {
        id: "ORDER-1238",
        customer: "فهد ناصر",
        status: "processing",
        total: "890.00 ر.س",
        date: "الأمس"
    }
];

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'pending': return 'secondary';
        case 'processing': return 'default';
        case 'shipping': return 'default';
        case 'completed': return 'outline';
        case 'cancelled': return 'destructive';
        default: return 'outline';
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'pending': return 'قيد الانتظار';
        case 'processing': return 'جار التجهيز';
        case 'shipping': return 'جار الشحن';
        case 'completed': return 'مكتمل';
        case 'cancelled': return 'ملغي';
        default: return status;
    }
};

export function RecentOrdersTable() {
    return (
        <div className="overflow-hidden">
            <div className="pt-0">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow className="border-gray-100 hover:bg-transparent h-12">
                            <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-gray-500">رقم الطلب</TableHead>
                            <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-gray-500">العميل</TableHead>
                            <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-gray-500">الحالة</TableHead>
                            <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-gray-500">المجموع</TableHead>
                            <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-gray-500">التاريخ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentOrders.map((order) => (
                            <TableRow key={order.id} className="border-gray-50 hover:bg-gray-50/30 transition-colors h-14">
                                <TableCell className="font-bold text-gray-700">{order.id}</TableCell>
                                <TableCell className="font-medium">{order.customer}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(order.status) as any} className="font-bold rounded-lg px-2 py-0.5 text-[10px]">
                                        {getStatusLabel(order.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-bold">{order.total}</TableCell>
                                <TableCell className="text-muted-foreground text-xs font-medium">{order.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
