"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Building2, Camera, Loader2 } from "lucide-react";
import { useUser, useUserStore, useIsLoading } from "@/lib/stores/user-store";
import { useUserInitials } from "@/lib/hooks/use-user";
import { toast } from "sonner";

export default function SettingsPage() {
    const user = useUser();
    const isLoading = useIsLoading();
    const initials = useUserInitials();
    const { updateUser } = useUserStore();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        businessName: '',
    });

    // Sync form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                businessName: user.businessName || '',
            });
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        updateUser({
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            businessName: formData.businessName,
        });
        await new Promise(resolve => setTimeout(resolve, 500));
        toast.success("تم حفظ التغييرات بنجاح");
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4" dir="rtl">
            {/* Header */}
            <div className="mb-10 text-right">
                <h1 className="text-3xl font-black text-[#242C5A]">الملف الشخصي</h1>
                <p className="text-gray-400 font-medium mt-2">إدارة معلوماتك الشخصية</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-10">
                {/* Avatar */}
                <div className="flex flex-col sm:flex-row-reverse items-center gap-8 pb-8 border-b border-gray-50">
                    <div className="relative group cursor-pointer">
                        <Avatar className="h-28 w-28 ring-4 ring-gray-50">
                            <AvatarImage src={user?.profilePictureUrl || ""} />
                            <AvatarFallback className="text-2xl bg-slate-900 text-white font-bold">
                                {initials || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all">
                            <Camera className="text-white w-6 h-6" />
                        </div>
                    </div>
                    <div className="flex-1 text-center sm:text-right">
                        <h4 className="font-bold text-lg text-[#242C5A]">صورة الملف الشخصي</h4>
                        <p className="text-sm text-gray-400 mt-1">PNG, JPG بحد أقصى 2MB</p>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                        label="الاسم الأول"
                        icon={User}
                        value={formData.firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                    <FormField
                        label="اسم العائلة"
                        icon={User}
                        value={formData.lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                    <FormField
                        label="البريد الإلكتروني"
                        icon={Mail}
                        value={formData.email}
                        disabled
                    />
                    <FormField
                        label="رقم الجوال"
                        icon={Phone}
                        value={formData.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        dir="ltr"
                    />
                    <div className="sm:col-span-2">
                        <FormField
                            label="اسم المنشأة"
                            icon={Building2}
                            value={formData.businessName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                            placeholder="اسم شركتك أو متجرك"
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-12 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
                    >
                        {isSaving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        حفظ التغييرات
                    </Button>
                </div>
            </div>
        </div>
    );
}

function FormField({ label, icon: Icon, dir, ...props }: any) {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-500">{label}</Label>
            <div className="relative">
                <Icon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                <Input
                    {...props}
                    dir={dir}
                    className="h-12 pr-12 bg-gray-50 border-gray-100 rounded-xl font-medium text-[#242C5A] disabled:opacity-50"
                />
            </div>
        </div>
    );
}
