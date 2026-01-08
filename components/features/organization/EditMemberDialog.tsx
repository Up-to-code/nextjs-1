"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Shield, UserCog } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { usePermission } from "@/hooks/use-permission";

interface EditMemberDialogProps {
    member: any; // Using any for simplicity as it comes from joined query
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function EditMemberDialog({ member, open, onOpenChange, onSuccess }: EditMemberDialogProps) {
    const [role, setRole] = useState("member");
    const [isLoading, setIsLoading] = useState(false);
    const { role: myRole } = usePermission('manageSettings');

    // Permissions State
    const [permissions, setPermissions] = useState({
        viewOrders: true,
        manageOrders: false,
        manageProducts: false,
        manageSettings: false,
    });

    const updateMember = useMutation(api.organizations.updateMemberRole);

    useEffect(() => {
        if (member) {
            setRole(member.role || "member");
            if (member.permissions) {
                setPermissions({
                    viewOrders: member.permissions.viewOrders ?? true,
                    manageOrders: member.permissions.manageOrders ?? false,
                    manageProducts: member.permissions.manageProducts ?? false,
                    manageSettings: member.permissions.manageSettings ?? false,
                });
            }
        }
    }, [member]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!member) return;

        setIsLoading(true);
        try {
            const permissionsToSend = (role === 'admin' || role === 'owner') ? {
                viewOrders: true,
                manageOrders: true,
                manageProducts: true,
                manageSettings: true,
            } : permissions;

            await updateMember({
                membershipId: member._id as Id<"organizationMemberships">,
                role: role as "admin" | "member" | "owner",
                permissions: permissionsToSend
            });

            toast.success("تم تحديث بيانات العضو بنجاح");
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error("Failed to update member", error);
            toast.error("فشل في تحديث بيانات العضو");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]" dir="rtl">
                <DialogHeader className="text-right">
                    <DialogTitle>تعديل بيانات العضو</DialogTitle>
                    <DialogDescription>
                        تعديل الصلاحيات والدور لـ {member?.user?.name || "المستخدم"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleUpdate} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label>الدور والصلاحيات</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="member">عضو (موظف)</SelectItem>
                                <SelectItem value="admin">مدير (صلاحيات كاملة)</SelectItem>
                                {(myRole === 'owner' || role === 'owner') && (
                                    <SelectItem value="owner">مالك (Owner)</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Permissions Section - Only show for Member role */}
                    {role === 'member' && (
                        <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <Label className="text-xs text-gray-500 font-bold mb-2 block">تخصيص الصلاحيات</Label>

                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Checkbox
                                    id="edit-viewOrders"
                                    checked={permissions.viewOrders}
                                    onCheckedChange={(c) => setPermissions(p => ({ ...p, viewOrders: !!c }))}
                                />
                                <label htmlFor="edit-viewOrders" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                    عرض الطلبات
                                </label>
                            </div>

                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Checkbox
                                    id="edit-manageOrders"
                                    checked={permissions.manageOrders}
                                    onCheckedChange={(c) => setPermissions(p => ({ ...p, manageOrders: !!c }))}
                                />
                                <label htmlFor="edit-manageOrders" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                    إدارة الطلبات (تعديل الحالات)
                                </label>
                            </div>

                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Checkbox
                                    id="edit-manageProducts"
                                    checked={permissions.manageProducts}
                                    onCheckedChange={(c) => setPermissions(p => ({ ...p, manageProducts: !!c }))}
                                />
                                <label htmlFor="edit-manageProducts" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                    إدارة المنتجات والمخزون
                                </label>
                            </div>

                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Checkbox
                                    id="edit-manageSettings"
                                    checked={permissions.manageSettings}
                                    onCheckedChange={(c) => setPermissions(p => ({ ...p, manageSettings: !!c }))}
                                />
                                <label htmlFor="edit-manageSettings" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                    إعدادات المنشأة
                                </label>
                            </div>
                        </div>
                    )}

                    {(role === 'admin' || role === 'owner') && (
                        <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 text-blue-800 text-sm">
                            <Shield className="h-4 w-4 mt-0.5" />
                            <span>{role === 'owner' ? 'المالك' : 'المدير'} لديه جميع الصلاحيات بشكل تلقائي.</span>
                        </div>
                    )}

                    <div className="flex justify-end pt-2 gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-[#242C5A]">
                            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                            حفظ التغييرات
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
