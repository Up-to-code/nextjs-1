"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    اسم المنتج
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "category",
        header: "التصنيف",
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <div className="text-right">السعر</div>
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"));
            const formatted = new Intl.NumberFormat("ar-SA", {
                style: "currency",
                currency: "SAR",
            }).format(amount);
            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "stock",
        header: "المخزون",
        cell: ({ row }) => {
            const stock = parseInt(row.getValue("stock"));
            return (
                <Badge variant={stock > 10 ? "secondary" : "destructive"}>
                    {stock}
                </Badge>
            )
        }
    },
    {
        accessorKey: "status",
        header: "الحالة",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge variant="outline" className={status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100'}>
                    {status === 'active' ? 'نشط' : 'مسودة'}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original;

            return (
                <DropdownMenu dir="rtl">
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(product.id)}
                        >
                            نسخ المعرف
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Pencil className="ml-2 h-4 w-4" />
                            تعديل المنتج
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            <Trash className="ml-2 h-4 w-4" />
                            حذف المنتج
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
