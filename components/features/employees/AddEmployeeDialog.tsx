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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(2, "الاسم يجب أن يكون أكثر من حرفين"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    role: z.enum(["admin", "editor", "viewer"]),
    status: z.enum(["active", "inactive"]),
});

interface AddEmployeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddEmployeeDialog({ open, onOpenChange }: AddEmployeeDialogProps) {
    // const { addEmployee } = useEmployees(); // Hook deleted

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "viewer",
            status: "active",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        try {
            // addEmployee(values);
            toast.success("تم إضافة الموظف بنجاح (سيتم تفعيلها قريبا)");
            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast.error("حدث خطأ أثناء إضافة الموظف");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-right">إضافة موظف جديد</DialogTitle>
                    <DialogDescription className="text-right">
                        أدخل بيانات الموظف الجديد وصلاحياته هنا.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="text-right">
                                    <FormLabel>الاسم</FormLabel>
                                    <FormControl>
                                        <Input placeholder="أدخل اسم الموظف" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="text-right">
                                    <FormLabel>البريد الإلكتروني</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel>الدور</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="اختر الدور" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="admin">مدير</SelectItem>
                                                <SelectItem value="editor">محرر</SelectItem>
                                                <SelectItem value="viewer">مشاهد</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel>الحالة</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="اختر الحالة" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">نشط</SelectItem>
                                                <SelectItem value="inactive">غير نشط</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="submit" className="bg-[#1E1E2D] hover:bg-[#2a2a3f]">إضافة الموظف</Button>
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
