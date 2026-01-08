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
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden border bg-gray-50 flex items-center justify-center">
                        {product.images?.[0] ? (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="text-gray-300">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                    <circle cx="9" cy="9" r="2" />
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                </svg>
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
            // Note: We need to pass orgId to actions. Using a context or hook in the Cell would be better,
            // but for now we can rely on the actions component to get it if safe, 
            // OR we assume this component is used where orgId is available.
            // Actually, simpler: ProductActions hook uses useOrg() inside it!
            return <ProductActionsWrapper product={product} />;
        },
    },
];

// Wrapper component to use hooks
import { useOrg } from "@/lib/stores/org-store";
import { ProductActions } from "./ProductActions";

function ProductActionsWrapper({ product }: { product: any }) {
    const org = useOrg();
    if (!org?.id) return null;
    return <ProductActions product={product} orgId={org.id} />;
}
