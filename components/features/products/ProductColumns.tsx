"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import Image from "next/image";

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: "المنتج",
        cell: ({ row }) => {
            const product = row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden border bg-gray-100">
                        {product.images[0] ? (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                                لا توجد صورة
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.sku}</div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "category",
        header: "التصنيف",
    },
    {
        accessorKey: "price",
        header: "السعر",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"));
            const formatted = new Intl.NumberFormat("ar-SA", {
                style: "currency",
                currency: "SAR",
            }).format(price);
            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "stock",
        header: "المخزون",
        cell: ({ row }) => {
            const stock = parseInt(row.getValue("stock"));
            return (
                <Badge variant={stock > 10 ? "secondary" : stock > 0 ? "outline" : "destructive"} className="font-normal">
                    {stock > 0 ? `${stock} قطعة` : "نفذت الكمية"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "status",
        header: "الحالة",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge variant={status === 'active' ? "default" : "secondary"} className="font-normal">
                    {status === 'active' ? 'نشط' : 'غير نشط'}
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
                            <span className="sr-only">فتح القائمة</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            تعديل المنتج
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            حذف المنتج
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
