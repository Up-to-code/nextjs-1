"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Upload, Plus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductFormProps {
    initialData?: ProductInput | null;
}

export function ProductForm({ initialData }: ProductFormProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<ProductInput>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData || {
            name: "",
            nameEn: "",
            description: "",
            price: 0,
            stock: 0,
            categoryId: "",
            sku: "",
            images: [],
            tags: [],
            dimensions: { length: 0, width: 0, height: 0 },
            weight: 0,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        // @ts-ignore
        name: "images", // casting due to array of strings limitation in useFieldArray
    });

    // Mock image upload handler
    const handleImageUpload = () => {
        // In a real app, this would trigger a file picker and upload to cloud storage
        // For now, we'll append a random placeholder image
        const randomId = Math.floor(Math.random() * 1000);
        const newImage = `https://picsum.photos/seed/${randomId}/400/400`;
        const currentImages = form.getValues("images");
        form.setValue("images", [...currentImages, newImage]);
        toast.success("تم رفع الصورة بنجاح (محاكاة)");
    };

    const handleRemoveImage = (index: number) => {
        const currentImages = form.getValues("images");
        form.setValue("images", currentImages.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: ProductInput) => {
        try {
            setLoading(true);
            console.log(data);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(initialData ? "تم تحديث المنتج بنجاح" : "تم إنشاء المنتج بنجاح");
            router.push("/products");
            router.refresh();
        } catch (error) {
            toast.error("حدث خطأ ما");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="md:col-span-2 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>تفاصيل المنتج</CardTitle>
                                <CardDescription>أدخل المعلومات الأساسية للمنتج</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>اسم المنتج (عربي)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="كرسي مكتب مريح..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="nameEn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>اسم المنتج (إنجليزي)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ergonomic Office Chair..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>وصف المنتج</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="وصف تفصيلي للمنتج..." className="min-h-[120px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>الوسائط</CardTitle>
                                <CardDescription>أضف صور عالية الجودة للمنتج (الحد الأقصى 5 صور)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {form.watch("images").map((image, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                                            <Image src={image} alt={`Product ${index}`} fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {form.watch("images").length < 5 && (
                                        <button
                                            type="button"
                                            onClick={handleImageUpload}
                                            className="flex flex-col items-center justify-center aspect-square rounded-lg border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition"
                                        >
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500">رفع صورة</span>
                                        </button>
                                    )}
                                </div>
                                <FormMessage>{form.formState.errors.images?.message}</FormMessage>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>المخزون والتنوع</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="sku"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>رمز المنتج فريد (SKU)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="PROD-001" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="stock"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>الكمية المتوفرة</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="weight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>الوزن (كجم)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dimensions.length"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>الطول (سم)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dimensions.width"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>العرض (سم)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>حالة المنتج</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الفئة</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر الفئة" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="cat-1">المكاتب</SelectItem>
                                                    <SelectItem value="cat-2">الطاولات</SelectItem>
                                                    <SelectItem value="cat-3">الكنب</SelectItem>
                                                    <SelectItem value="cat-4">غرف النوم</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full bg-[#1E1E2D] hover:bg-[#2a2a3f]" disabled={loading}>
                                    {loading ? "جاري الحفظ..." : initialData ? "حفظ التغييرات" : "نشر المنتج"}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>التسعير</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>السعر الأساسي (ر.س)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="originalPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>السعر قبل الخصم (اختياري)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                            </FormControl>
                                            <FormDescription>سيظهر هذا السعر مشطوباً</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
}
