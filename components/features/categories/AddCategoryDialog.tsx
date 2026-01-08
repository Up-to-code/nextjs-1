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
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrg } from "@/lib/stores/org-store";

interface AddCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddCategoryDialog({
    open,
    onOpenChange,
}: AddCategoryDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const organization = useOrg();

    const createCategory = useMutation(api.categories.create);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!organization?.id) {
            toast.error("المنشأة غير محددة");
            return;
        }

        setIsLoading(true);

        try {
            await createCategory({
                orgId: organization.id,
                name,
                description,
                order: 0,
            });

            toast.success("تم إضافة التصنيف بنجاح");
            setName("");
            setDescription("");
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء إضافة التصنيف");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="text-right">
                        <DialogTitle>إضافة تصنيف جديد</DialogTitle>
                        <DialogDescription>
                            أدخل تفاصيل التصنيف الجديد هنا. اضغط حفظ عند الانتهاء.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-right">اسم التصنيف</Label>
                            <Input
                                id="name"
                                placeholder="مثال: غرف نوم"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="text-right"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description" className="text-right">الوصف</Label>
                            <Textarea
                                id="description"
                                placeholder="وصف مختصر للتصنيف..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="text-right"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
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
