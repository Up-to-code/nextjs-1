"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrg } from "@/lib/stores/org-store";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ArrowRight, Edit, Loader2, Package, Tag, Layers, BarChart } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function ProductDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.productId as Id<"products">;
    const organization = useOrg();

    // Fetch product details
    const product = useQuery(api.products.get, { id: productId, orgId: organization?.id || "" });
    // Fetch category name if available (optional optimization: backend could join it)
    const category = useQuery(api.categories.list, organization?.id ? { orgId: organization.id } : "skip");

    // Helper to find category name
    const getCategoryName = (catId: string) => {
        return category?.find((c) => c._id === catId)?.name || "غير مصنف";
    };

    if (!organization) return null;

    if (product === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (product === null) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-gray-700">المنتج غير موجود</h2>
                <Button onClick={() => router.push("/products")} className="mt-4">
                    العودة للمنتجات
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-8" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#242C5A]">{product.name}</h1>
                        <p className="text-gray-500 text-sm">SKU: {product.sku || "N/A"}</p>
                    </div>
                </div>
                <Button
                    onClick={() => router.push(`/products/${product._id}/edit`)}
                    className="bg-[#242C5A] text-white gap-2"
                >
                    <Edit className="h-4 w-4" />
                    تعديل المنتج
                </Button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Image and Status */}
                <div className="space-y-6">
                    <div className="aspect-square relative bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                        {product.images && product.images.length > 0 ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <Package className="h-16 w-16" />
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                            <span className="text-gray-500 text-sm">الحالة</span>
                            <Badge variant={product.status === "active" ? "default" : "secondary"}>
                                {product.status === "active" ? "نشط" : "غير نشط"}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                            <span className="text-gray-500 text-sm">المخزون</span>
                            <span className="font-bold text-[#242C5A]">{product.stock} قطعة</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">السعر</span>
                            <span className="font-bold text-xl text-[#242C5A]">{product.price} ر.س</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-2 space-y-6">
                    {/* Description Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Layers className="h-5 w-5 text-gray-400" />
                            الوصف
                        </h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {product.description || "لا يوجد وصف للمنتج."}
                        </p>
                    </div>

                    {/* Meta Info Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Tag className="h-5 w-5 text-gray-400" />
                            معلومات إضافية
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="block text-xs text-gray-400 mb-1">التصنيف</span>
                                <span className="font-medium">{getCategoryName(product.categoryId)}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-400 mb-1">تاريخ الإضافة</span>
                                <span className="font-medium">
                                    {new Date(product.createdAt).toLocaleDateString('ar-SA')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Metrics Placeholder (Future) */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 opacity-75">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <BarChart className="h-5 w-5 text-gray-400" />
                            إحصائيات (قريباً)
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                            <div>
                                <span className="block text-xs text-gray-400 mb-1">عدد الطلبات</span>
                                <span className="font-medium">-</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-400 mb-1">عدد المشاهدات</span>
                                <span className="font-medium">-</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
