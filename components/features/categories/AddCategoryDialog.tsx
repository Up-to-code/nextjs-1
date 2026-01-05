"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface AddCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddCategoryDialog({
    open,
    onOpenChange,
}: AddCategoryDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success("تم إضافة التصنيف بنجاح");
        setIsLoading(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>إضافة تصنيف جديد</DialogTitle>
                        <DialogDescription>
                            أدخل تفاصيل التصنيف الجديد هنا. اضغط حفظ عند الانتهاء.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">اسم التصنيف</Label>
                            <Input id="name" placeholder="مثال: غرف نوم" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">الوصف</Label>
                            <Textarea id="description" placeholder="وصف مختصر للتصنيف..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-[#1E1E2D] hover:bg-[#2a2a3f]">
                            {isLoading ? "جاري الحفظ..." : "حفظ"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
