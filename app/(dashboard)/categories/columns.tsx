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

interface CategoryColumnsProps {
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}

export const getCategoryColumns = ({ onEdit, onDelete }: CategoryColumnsProps): ColumnDef<Category>[] => [
    {
        accessorKey: "name",
        header: "الاسم",
        cell: ({ row }) => <span className="font-bold text-gray-900">{row.getValue("name")}</span>,
    },
    {
        accessorKey: "description",
        header: "الوصف",
        cell: ({ row }) => <span className="text-gray-500 font-medium">{row.getValue("description")}</span>,
    },
    {
        accessorKey: "productCount",
        header: "عدد المنتجات",
        cell: ({ row }) => (
            <Badge variant="secondary" className="font-bold rounded-lg px-2 py-0.5 text-xs bg-gray-50 text-gray-600">
                {row.getValue("productCount")} منتجات
            </Badge>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const category = row.original;
            return (
                <DropdownMenu dir="rtl">
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg">
                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl border-gray-100 shadow-none">
                        <DropdownMenuLabel className="text-xs font-bold text-gray-400 px-4 py-2">الإجراءات</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => onEdit(category)}
                            className="cursor-pointer gap-2 px-4 py-2.5"
                        >
                            <Pencil className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">تعديل</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(category.id)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer gap-2 px-4 py-2.5"
                        >
                            <Trash className="h-4 w-4" />
                            <span className="font-medium">حذف</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
