"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, CalendarClock, Ban, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface OrderColumnsProps {
    onSchedule: (order: Order) => void;
    onUpdateStatus: (id: string, status: string) => void;
}

export const getOrderColumns = ({ onSchedule, onUpdateStatus }: OrderColumnsProps): ColumnDef<Order>[] => [
    {
        accessorKey: "orderNumber",
        header: "رقم الطلب",
        cell: ({ row }) => <span className="font-bold">#{row.getValue("orderNumber")}</span>,
    },
    {
        accessorKey: "customer.name",
        header: "العميل",
        cell: ({ row }) => <span className="font-medium text-gray-700">{row.original.customer.name}</span>,
    },
    {
        accessorKey: "total",
        header: "المجموع",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("total"));
            const formatted = new Intl.NumberFormat("ar-SA", {
                style: "currency",
                currency: "SAR",
            }).format(amount);
            return <div className="font-bold text-[#242C5A]">{formatted}</div>;
        },
    },
    {
        accessorKey: "orderStatus",
        header: "الحالة",
        cell: ({ row }) => {
            const status = row.getValue("orderStatus") as string;
            const labels: Record<string, { label: string; variant: any }> = {
                delivered: { label: "تم التوصيل", variant: "default" },
                completed: { label: "مكتمل", variant: "default" },
                processing: { label: "قيد التنفيذ", variant: "secondary" },
                pending: { label: "قيد الانتظار", variant: "outline" },
                cancelled: { label: "ملغي", variant: "destructive" },
            };
            const { label, variant } = labels[status] || { label: status, variant: "outline" };
            return (
                <Badge variant={variant} className="font-bold rounded-lg px-2 py-0.5 text-xs">
                    {label}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "التاريخ",
        cell: ({ row }) => {
            return (
                <div className="text-gray-400 text-xs font-medium">
                    {format(new Date(row.getValue("createdAt")), "PPP", { locale: arSA })}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const order = row.original;
            return (
                <DropdownMenu dir="rtl">
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl border-gray-100 shadow-none">
                        <DropdownMenuLabel className="text-xs font-bold text-gray-400 px-4 py-2">الإجراءات</DropdownMenuLabel>
                        <Link href={`/orders/${order.id}`}>
                            <DropdownMenuItem className="cursor-pointer gap-2 px-4 py-2.5">
                                <Eye className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">عرض التفاصيل</span>
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                            className="cursor-pointer gap-2 px-4 py-2.5"
                            onClick={() => onSchedule(order)}
                        >
                            <CalendarClock className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">جدولة التوصيل</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer gap-2 px-4 py-2.5"
                            onClick={() => onUpdateStatus(order.id, "completed")}
                        >
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-600">إغلاق كـ مكتمل</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-700 cursor-pointer gap-2 px-4 py-2.5"
                            onClick={() => onUpdateStatus(order.id, "cancelled")}
                        >
                            <Ban className="h-4 w-4" />
                            <span className="font-medium">إلغاء الطلب</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
