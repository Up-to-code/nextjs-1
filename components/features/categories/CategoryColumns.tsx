"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const CategoryColumns: ColumnDef<Category>[] = [
    {
        accessorKey: "name",
        header: "الاسم",
        cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
        accessorKey: "description",
        header: "الوصف",
    },
    {
        accessorKey: "productCount",
        header: "عدد المنتجات",
        cell: ({ row }) => (
            <div className="flex justify-center">
                <Badge variant="secondary" className="font-normal">
                    {row.getValue("productCount")} منتجات
                </Badge>
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
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
                        <DropdownMenuItem>
                            <Pencil className="ml-2 h-4 w-4" />
                            تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                            <Trash className="ml-2 h-4 w-4" />
                            حذف
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
