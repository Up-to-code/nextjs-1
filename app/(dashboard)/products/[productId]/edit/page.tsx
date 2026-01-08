"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Loader2, Save } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrg } from "@/lib/stores/org-store";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { RichTextEditor } from "@/components/features/products/RichTextEditor";
import { ImageUpload } from "@/components/features/products/ImageUpload";
import { ProductVariants } from "@/components/features/products/ProductVariants";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.productId as Id<"products">;
    const organization = useOrg();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch existing product and categories
    const product = useQuery(api.products.get, { id: productId, orgId: organization?.id || "" });
    const categories = useQuery(api.categories.list, organization?.id ? { orgId: organization.id } : "skip");

    const updateProduct = useMutation(api.products.update);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        sku: "",
        categoryId: "",
        images: [] as string[],
    });

    const [variantOptions, setVariantOptions] = useState<any[]>([]);
    const [variants, setVariants] = useState<any[]>([]);

    // Populate form when product data is loaded
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                stock: product.stock.toString(),
                sku: product.sku || "",
                categoryId: product.categoryId,
                images: product.images || [],
            });
            // Populate variants if they exist
            if (product.variantOptions) {
                setVariantOptions(product.variantOptions);
            }
            if (product.variants) {
                setVariants(product.variants);
            }
        }
    }, [product]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!organization?.id) {
            toast.error("المنشأة غير محددة");
            return;
        }

        if (!formData.name || !formData.price || !formData.categoryId) {
            toast.error("يرجى تعبئة الحقول المطلوبة");
            return;
        }

        setIsSubmitting(true);
        try {
            await updateProduct({
                id: productId,
                orgId: organization.id,
                name: formData.name,
                description: formData.description,
                categoryId: formData.categoryId as any,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock) || 0,
                sku: formData.sku,
                images: formData.images,
                status: product?.status || "active",
                variantOptions: variantOptions.length > 0 ? variantOptions : undefined,
                variants: variants.length > 0 ? variants : undefined,
            });

            toast.success("تم تحديث المنتج بنجاح");
            router.push("/products");
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء تحديث المنتج");
        } finally {
            setIsSubmitting(false);
        }
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
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowRight className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-[#242C5A]">تعديل المنتج</h1>
                    <p className="text-gray-500 text-sm">تعديل تفاصيل المنتج: {product.name}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6 shadow-sm">
                    <h2 className="text-lg font-bold">المعلومات الأساسية</h2>
                    <div className="space-y-2">
                        <Label>اسم المنتج <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="مثل: قميص قطني فاخر"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>الوصف</Label>
                        <RichTextEditor
                            value={formData.description}
                            onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                        />
                    </div>
                </div>

                {/* Media */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6 shadow-sm">
                    <h2 className="text-lg font-bold">الصور والوسائط</h2>
                    <ImageUpload
                        images={formData.images}
                        onImagesChange={(imgs) => setFormData(prev => ({ ...prev, images: imgs }))}
                        maxImages={5}
                    />
                </div>

                {/* Pricing & Inventory */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6 shadow-sm">
                    <h2 className="text-lg font-bold">السعر والمخزون</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>السعر (ر.س) <span className="text-red-500">*</span></Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>المخزون</Label>
                            <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={formData.stock}
                                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>رقم التخزين (SKU)</Label>
                            <Input
                                placeholder="PROD-001"
                                value={formData.sku}
                                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>التصنيف <span className="text-red-500">*</span></Label>
                            <Select
                                value={formData.categoryId}
                                onValueChange={(val) => setFormData(prev => ({ ...prev, categoryId: val }))}
                                dir="rtl"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر تصنيف" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories?.map((cat: any) => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Variants */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6 shadow-sm">
                    <h2 className="text-lg font-bold">خيارات المنتج</h2>
                    <p className="text-sm text-gray-500">قم بإضافة خيارات مثل الحجم واللون إذا كان للمنتج أنواع متعددة.</p>

                    <ProductVariants
                        options={variantOptions}
                        variants={variants}
                        basePrice={parseFloat(formData.price) || 0}
                        onOptionsChange={setVariantOptions}
                        onVariantsChange={setVariants}
                    />
                </div>

                <div className="pt-4 flex justify-end sticky bottom-6 z-10">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#242C5A] hover:bg-[#1A1A27] text-white min-w-[150px] h-12 text-lg shadow-lg"
                    >
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin ml-2" /> : <Save className="h-4 w-4 ml-2" />}
                        حفظ التعديلات
                    </Button>
                </div>
            </form>
        </div>
    );
}
