"use client";

import { useOrganization } from "../../../hooks/use-organization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Building2, Save, MapPin, Phone, Mail, Globe } from "lucide-react";

export default function OrganizationPage() {
    const { organization, isLoading, updateOrganization } = useOrganization();

    const data = organization || {
        name: "منشأة الأثاث الحديث",
        email: "contact@furniture.com",
        phone: "0500000000",
        address: "الرياض، المملكة العربية السعودية",
        businessDescription: "متجر متخصص في بيع الأثاث المنزلي والمكتبي الحديث والفاخر بتصاميم عصرية تناسب جميع الأذواق.",
    };

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-4">
                <div className="space-y-1 w-full text-right">
                    <h2 className="text-3xl font-bold tracking-tight text-[#242C5A]">إعدادات المنشأة</h2>
                    <p className="text-muted-foreground text-lg">تحكم ببيانات ومعلومات منشأتك لتظهر بشكل صحيح للعملاء.</p>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1 space-y-8">
                    <div className="premium-card p-10 flex flex-col items-center text-center space-y-8">
                        <div className="relative group">
                            <div className="h-32 w-32 bg-gray-50/50 rounded-[2.5rem] flex items-center justify-center border border-gray-100 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-primary/5 transition-all duration-300">
                                <Building2 className="h-14 w-14 text-primary/30" />
                            </div>
                            <Button variant="outline" size="icon" className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-white border-gray-100 shadow-lg shadow-black/5 hover:translate-y-[-2px] transition-all">
                                <Save className="h-5 w-5 text-primary" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-extrabold text-[#242C5A]">{data.name}</h3>
                            <div className="bg-green-50 text-green-600 border-none px-4 py-1 rounded-full font-bold text-xs inline-block">حساب شريك مفعل</div>
                        </div>
                        <div className="w-full pt-4 space-y-4 border-t border-gray-100/50">
                            <div className="flex items-center gap-4 text-gray-600 font-medium">
                                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <span className="text-sm">{data.address}</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 font-medium font-mono">
                                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <span dir="ltr" className="text-sm">{data.phone}</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 font-medium">
                                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <span className="text-sm">{data.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#242C5A] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary/20 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-all duration-500" />
                        <div className="space-y-2 relative z-10">
                            <h4 className="text-xl font-bold">حالة المنشأة</h4>
                            <p className="text-sm text-gray-300 leading-relaxed font-medium">منشأتك مفعلة وتظهر في محركات البحث وفي تطبيق Houses. تأكد من تحديث بياناتك دورياً لجذب المزيد من العملاء.</p>
                        </div>
                        <Button variant="outline" className="w-full h-12 border-white/20 text-white hover:bg-white/10 rounded-2xl font-bold relative z-10">عرض الصفحة العامة</Button>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-gray-400" />
                            المعلومات الأساسية
                        </h3>

                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="orgName" className="font-bold text-gray-700">اسم المنشأة التجاري</Label>
                                <Input id="orgName" defaultValue={data.name} className="h-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description" className="font-bold text-gray-700">نبذة عن المنشأة</Label>
                                <textarea
                                    id="description"
                                    defaultValue={data.businessDescription}
                                    className="min-h-[120px] w-full rounded-2xl border border-gray-200 bg-gray-50/30 p-4 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>

                            <Separator className="bg-gray-50" />

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="font-bold text-gray-700">البريد الرسمي</Label>
                                    <Input id="email" defaultValue={data.email} className="h-12 rounded-2xl border-gray-100 bg-gray-50/30" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone" className="font-bold text-gray-700">رقم تواصل المنشأة</Label>
                                    <Input id="phone" defaultValue={data.phone} className="h-12 rounded-2xl border-gray-100 bg-gray-50/30 text-right" dir="ltr" />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address" className="font-bold text-gray-700">الموقع الرئيسي / العنوان</Label>
                                <Input id="address" defaultValue={data.address} className="h-12 rounded-2xl border-gray-100 bg-gray-50/30" />
                            </div>

                            <div className="pt-6 flex justify-end">
                                <Button className="bg-[#1E1E2D] hover:bg-[#2a2a3f] rounded-full px-10 h-12">
                                    حفظ التغييرات
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
