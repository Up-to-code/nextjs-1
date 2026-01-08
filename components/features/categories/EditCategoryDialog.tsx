"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrg } from "@/lib/stores/org-store";
import { toast } from "sonner";

const formSchema = z.z.object({
    name: z.string().min(2, "الاسم يجب أن يكون أكثر من حرفين"),
    nameEn: z.string().min(2, "English name must be at least 2 characters"),
    description: z.string().optional(),
});

interface EditCategoryDialogProps {
    category: Category | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditCategoryDialog({ category, open, onOpenChange }: EditCategoryDialogProps) {
    const organization = useOrg();
    const updateCategory = useMutation(api.categories.update);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            nameEn: "",
            description: "",
        },
    });

    useEffect(() => {
        if (category) {
            form.reset({
                name: category.name,
                nameEn: category.nameEn,
                description: category.description || "",
            });
        }
    }, [category, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!organization?.id || !category) return;

        setIsSubmitting(true);
        try {
            await updateCategory({
                id: category.id as any,
                orgId: organization.id,
                name: values.name,
                nameEn: values.nameEn,
                description: values.description,
                status: category.status, // Preserve status
                order: category.order,   // Preserve order
                image: category.image    // Preserve image
            });
            toast.success("تم تحديث التصنيف بنجاح");
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء تحديث التصنيف");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-right">تعديل التصنيف</DialogTitle>
                    <DialogDescription className="text-right">
                        قم بتعديل بيانات التصنيف هنا.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="text-right">
                                    <FormLabel>الاسم (بالعربي)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="أدخل اسم التصنيف" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nameEn"
                            render={({ field }) => (
                                <FormItem className="text-right">
                                    <FormLabel>الاسم (English)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter category name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="text-right">
                                    <FormLabel>الوصف</FormLabel>
                                    <FormControl>
                                        <Input placeholder="وصف مختصر للتصنيف" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="submit" className="bg-[#1E1E2D] hover:bg-[#2a2a3f]">حفظ التعديلات</Button>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                إلغاء
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
