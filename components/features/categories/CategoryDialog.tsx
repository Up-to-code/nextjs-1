"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CategoryDialog() {
    const [open, setOpen] = useState(false);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setOpen(false);
            toast.success("تم إضافة الفئة بنجاح");
        }, 500);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    إضافة فئة
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>إضافة فئة جديدة</DialogTitle>
                        <DialogDescription>
                            أضف فئة جديدة لتنظيم منتجاتك. اضغط حفظ عند الانتهاء.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                الاسم
                            </Label>
                            <Input
                                id="name"
                                placeholder="غرف نوم"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                الوصف
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="وصف للفئة..."
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">حفظ التغييرات</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
