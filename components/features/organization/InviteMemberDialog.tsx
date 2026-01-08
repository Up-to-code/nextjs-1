"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { inviteMemberAction } from "@/app/actions/organization";
import { toast } from "sonner";
import { Loader2, UserPlus, Mail, Shield } from "lucide-react";

interface InviteMemberDialogProps {
    onSuccess?: () => void;
}

export function InviteMemberDialog({ onSuccess }: InviteMemberDialogProps) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("member");
    const [isLoading, setIsLoading] = useState(false);

    // Permissions State
    const [permissions, setPermissions] = useState({
        viewOrders: true,
        manageOrders: false,
        manageProducts: false,
        manageSettings: false,
    });

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            // If admin, they get all permissions implicitly (or we can just send true for all)
            const permissionsToSend = role === 'admin' ? {
                viewOrders: true,
                manageOrders: true,
                manageProducts: true,
                manageSettings: true,
            } : permissions;

            const result = await inviteMemberAction(email, role, permissionsToSend);

            if (result.success) {
                toast.success("تم إرسال الدعوة بنجاح");
                setOpen(false);
                setEmail("");
                setRole("member");
                setPermissions({
                    viewOrders: true,
                    manageOrders: false,
                    manageProducts: false,
                    manageSettings: false,
                });
                onSuccess?.();
            } else {
                toast.error(result.error || "فشل في إرسال الدعوة");
            }
        } catch (error) {
            toast.error("حدث خطأ غير متوقع");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#242C5A] text-white hover:bg-[#1e254a]">
                    <UserPlus className="ml-2 h-4 w-4" />
                    دعوة عضو
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" dir="rtl">
                <DialogHeader className="text-right">
                    <DialogTitle>دعوة عضو جديد</DialogTitle>
                    <DialogDescription>
                        قم بإرسال دعوة لموظف جديد للانضمام إلى المنشأة.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleInvite} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label>البريد الإلكتروني</Label>
                        <div className="relative">
                            <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="name@example.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pr-10"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>الدور والصلاحيات</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="member">عضو (موظف)</SelectItem>
                                <SelectItem value="admin">مدير (صلاحيات كاملة)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Permissions Section - Only show for Member role */}
                    {role === 'member' && (
                        <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <Label className="text-xs text-gray-500 font-bold mb-2 block">تخصيص الصلاحيات</Label>

                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Checkbox
                                    id="viewOrders"
                                    checked={permissions.viewOrders}
                                    onCheckedChange={(c) => setPermissions(p => ({ ...p, viewOrders: !!c }))}
                                />
                                <label htmlFor="viewOrders" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                    عرض الطلبات
                                </label>
                            </div>

                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Checkbox
                                    id="manageOrders"
                                    checked={permissions.manageOrders}
                                    onCheckedChange={(c) => setPermissions(p => ({ ...p, manageOrders: !!c }))}
                                />
                                <label htmlFor="manageOrders" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                    إدارة الطلبات (تعديل الحالات)
                                </label>
                            </div>

                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Checkbox
                                    id="manageProducts"
                                    checked={permissions.manageProducts}
                                    onCheckedChange={(c) => setPermissions(p => ({ ...p, manageProducts: !!c }))}
                                />
                                <label htmlFor="manageProducts" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                    إدارة المنتجات والمخزون
                                </label>
                            </div>

                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Checkbox
                                    id="manageSettings"
                                    checked={permissions.manageSettings}
                                    onCheckedChange={(c) => setPermissions(p => ({ ...p, manageSettings: !!c }))}
                                />
                                <label htmlFor="manageSettings" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                    إعدادات المنشأة
                                </label>
                            </div>
                        </div>
                    )}

                    {role === 'admin' && (
                        <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 text-blue-800 text-sm">
                            <Shield className="h-4 w-4 mt-0.5" />
                            <span>المدير لديه جميع الصلاحيات بشكل تلقائي.</span>
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                            إرسال الدعوة
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
