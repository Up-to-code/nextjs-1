"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Bell,
    Shield,
    User,
    Globe,
    Smartphone,
    ShoppingCart,
    Package,
    Users,
    Plus,
    Camera,
    Mail,
    Phone,
    Layout,
    Key,
    UserCheck,
    LucideIcon
} from "lucide-react";
import { useEmployees } from "@/hooks/use-employees";
import { AddEmployeeDialog } from "@/components/features/employees/AddEmployeeDialog";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";

export default function SettingsPage() {
    const { employees } = useEmployees();
    const [isAddOpen, setIsAddOpen] = useState(false);

    const sections = [
        { id: "profile", label: "الملف الشخصي", icon: User },
        { id: "security", label: "الأمان والخصوصية", icon: Shield },
        { id: "team", label: "فريق العمل", icon: Users },
        { id: "notifications", label: "الإشعارات", icon: Bell },
        { id: "appearance", label: "المظهر واللغة", icon: Layout },
    ];

    return (
        <div className="space-y-12 pb-32 max-w-7xl mx-auto" dir="rtl">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-4">
                <div className="space-y-2 w-full text-right">
                    <h2 className="text-4xl font-black tracking-tight text-[#242C5A]">الإعدادات</h2>
                    <p className="text-gray-400 text-lg font-medium">تحكم في هوية متجرك وفريق العمل من مكان واحد.</p>
                </div>
            </div>

            {/* Quick Overview Stats */}
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                <StatCard
                    title="حالة الفريق"
                    value={`${employees.length} موظف`}
                    icon={Users}
                    description="فريق العمل النشط حالياً"
                />
                <StatCard
                    title="مستوى الأمان"
                    value="مرتفع"
                    icon={Shield}
                    description="آخر فحص: اليوم"
                />
                <StatCard
                    title="اللغة الافتراضية"
                    value="العربية"
                    icon={Globe}
                />
                <StatCard
                    title="إشعارات النظام"
                    value="نشطة"
                    icon={Bell}
                    description="تصلك التنبيهات فوراً"
                />
            </div>

            <div className="flex flex-col lg:flex-row-reverse gap-12 items-start">
                {/* Sticky Right-side Navigation */}
                <div className="hidden lg:block w-72 sticky top-8 bg-gray-50/50 border border-gray-100 rounded-[2rem] p-4">
                    <div className="space-y-2">
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="flex items-center gap-4 px-5 h-14 rounded-xl text-gray-400 hover:text-[#242C5A] hover:bg-white transition-all font-bold group"
                            >
                                <section.icon className="h-5 w-5" />
                                <span className="text-sm">{section.label}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Main Settings Feed */}
                <div className="flex-1 w-full space-y-12">
                    {/* Profile Section */}
                    <section id="profile" className="scroll-mt-8 space-y-8">
                        <SectionHeader title="الملف الشخصي" description="إدارة المعلومات الشخصية والهوية الرسمية للمتجر." />

                        <div className="premium-card p-10 bg-white border border-gray-100 rounded-3xl space-y-10">
                            {/* Avatar Sub-section */}
                            <div className="flex flex-col sm:flex-row-reverse items-center gap-12 border-b border-gray-50 pb-10">
                                <div className="relative group cursor-pointer h-36 w-36">
                                    <Avatar className="h-36 w-36 border-none shadow-none ring-[6px] ring-gray-50 transition-all duration-300">
                                        <AvatarImage src="/avatars/01.png" />
                                        <AvatarFallback className="text-3xl bg-gray-50 text-[#242C5A] font-black italic">AM</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#242C5A]/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                                        <Camera className="text-white w-8 h-8" />
                                    </div>
                                </div>
                                <div className="flex-1 text-center sm:text-right space-y-4">
                                    <h4 className="font-black text-xl text-[#242C5A]">صورة الهوية</h4>
                                    <p className="text-sm text-gray-400 font-bold max-w-sm">سيتم عرض هذه الصورة في التقارير والفواتير الرسمية.</p>
                                    <div className="flex gap-3 justify-center sm:justify-start">
                                        <Button size="sm" className="bg-[#242C5A] rounded-xl px-6">تغيير</Button>
                                        <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50">حذف</Button>
                                    </div>
                                </div>
                            </div>

                            {/* Info Form */}
                            <div className="grid gap-8 md:grid-cols-2">
                                <FormInput label="الاسم الكامل" defaultValue="أحمد محمد" icon={User} />
                                <FormInput label="البريد الإلكتروني" defaultValue="ahmed@example.com" icon={Mail} />
                                <div className="md:col-span-2">
                                    <FormInput label="رقم الجوال" defaultValue="0500000000" icon={Phone} dir="ltr" />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <Button className="h-14 px-12 bg-[#242C5A] text-white rounded-2xl font-black text-lg shadow-none transition-all active:scale-95">حفظ التغييرات</Button>
                            </div>
                        </div>
                    </section>

                    {/* Security Section */}
                    <section id="security" className="scroll-mt-8 space-y-8">
                        <SectionHeader title="الأمان والخصوصية" description="تأمين حسابك وإدارة الجلسات النشطة." />
                        <div className="premium-card p-10 bg-white border border-gray-100 rounded-3xl space-y-10">
                            <div className="grid gap-8 md:grid-cols-2 border-b border-gray-50 pb-10">
                                <FormInput label="كلمة المرور الحالية" type="password" placeholder="••••••••" icon={Key} />
                                <FormInput label="كلمة المرور الجديدة" type="password" placeholder="••••••••" icon={Key} />
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-lg font-black text-[#242C5A]">الجلسات النشطة</h4>
                                <div className="space-y-4">
                                    <SessionItem device="Chrome على macOS" details="الرياض، السعودية • نشط الآن" isCurrent />
                                    <SessionItem device="iPhone 15 Pro" details="الدمام، السعودية • منذ يومين" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Team Section */}
                    <section id="team" className="scroll-mt-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <SectionHeader title="فريق العمل" description="إدارة الموظفين والصلاحيات الممنوحة." />
                            <Button onClick={() => setIsAddOpen(true)} className="h-12 px-6 bg-[#242C5A] text-white rounded-xl font-bold flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                <span>إضافة موظف</span>
                            </Button>
                        </div>
                        <div className="premium-card bg-white border border-gray-100 rounded-3xl overflow-hidden divide-y divide-gray-50">
                            {employees.map((employee) => (
                                <div key={employee.id} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-all">
                                    <div className="flex items-center gap-6">
                                        <Avatar className="h-14 w-14 ring-4 ring-gray-50">
                                            <AvatarFallback className="bg-[#242C5A]/5 text-[#242C5A] font-black italic">
                                                {employee.name.slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="text-right">
                                            <div className="flex items-center gap-3">
                                                <p className="font-black text-xl text-[#242C5A]">{employee.name}</p>
                                                {employee.role === 'admin' && (
                                                    <Badge className="bg-[#242C5A] text-white border-none rounded-full px-3 py-0.5 text-[10px] font-black uppercase">ADMIN</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400 font-bold">{employee.email}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="h-10 w-10 p-0 text-red-400 hover:text-red-500 hover:bg-red-50">
                                        <UserCheck className="h-5 w-5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Notifications Section */}
                    <section id="notifications" className="scroll-mt-8 space-y-8">
                        <SectionHeader title="تفضيلات الإشعارات" description="تحكم في كيفية وصول التحديثات إليك." />
                        <div className="grid gap-6">
                            <NotificationCard icon={ShoppingCart} title="تنبيهات الطلبات" desc="إشعار عند كل طلب جديد" color="bg-blue-50 text-blue-500" defaultChecked />
                            <NotificationCard icon={Package} title="إدارة المخزون" desc="تنبيهات عند نفاد الكمية" color="bg-orange-50 text-orange-500" defaultChecked />
                            <NotificationCard icon={Bell} title="أخبار المنصة" desc="تحديثات وميزات جديدة" color="bg-purple-50 text-purple-500" />
                        </div>
                    </section>

                    {/* Appearance Section */}
                    <section id="appearance" className="scroll-mt-8 space-y-8">
                        <SectionHeader title="المظهر واللغة" description="تخصيص الواجهة واللغة الافتراضية." />
                        <div className="premium-card p-10 bg-white border border-gray-100 rounded-3xl space-y-10">
                            <div className="space-y-6">
                                <Label className="text-xs font-black text-[#242C5A] opacity-40 uppercase tracking-widest">لغة العرض</Label>
                                <div className="flex gap-4">
                                    <Button className="flex-1 h-14 bg-[#242C5A] text-white rounded-xl font-bold">العربية</Button>
                                    <Button variant="outline" className="flex-1 h-14 rounded-xl font-bold border-gray-100">English</Button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <AddEmployeeDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
        </div>
    );
}

// Helpers
function SectionHeader({ title, description }: { title: string, description: string }) {
    return (
        <div className="space-y-1 text-right">
            <h3 className="text-2xl font-black text-[#242C5A] tracking-tight">{title}</h3>
            <p className="text-base text-gray-400 font-bold">{description}</p>
        </div>
    );
}

function FormInput({ label, icon: Icon, dir, ...props }: any) {
    return (
        <div className="space-y-3 text-right">
            <Label className="text-xs font-black text-[#242C5A] opacity-40 uppercase tracking-widest block">{label}</Label>
            <div className="relative">
                <Icon className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                <Input {...props} dir={dir} className="h-16 pr-14 text-right rounded-2xl bg-gray-50 border-none font-bold text-lg text-[#242C5A] focus-visible:ring-primary/5 transition-all shadow-none" />
            </div>
        </div>
    );
}

function SessionItem({ device, details, isCurrent }: any) {
    return (
        <div className="flex flex-row-reverse items-center justify-between p-6 bg-gray-50 rounded-2xl">
            <div className="flex flex-row-reverse items-center gap-6">
                <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                    <Smartphone className="h-6 w-6 text-gray-400" />
                </div>
                <div className="text-right">
                    <div className="flex flex-row-reverse items-center gap-3">
                        <p className="font-black text-lg text-[#242C5A]">{device}</p>
                        {isCurrent && <Badge className="bg-green-50 text-green-600 border-none rounded-full px-3 py-1 font-black text-[10px]">نشط الآن</Badge>}
                    </div>
                    <p className="text-xs text-gray-400 font-bold">{details}</p>
                </div>
            </div>
            {!isCurrent && <Button variant="ghost" size="sm" className="text-red-400 font-bold hover:bg-red-50">إغلاق</Button>}
        </div>
    );
}

function NotificationCard({ icon: Icon, title, desc, color, defaultChecked }: any) {
    return (
        <div className="flex flex-row-reverse items-center justify-between p-8 premium-card bg-white border border-gray-100 rounded-3xl hover:border-primary/20 transition-all group">
            <div className="flex flex-row-reverse gap-6">
                <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all", color)}>
                    <Icon className="h-8 w-8" />
                </div>
                <div className="text-right">
                    <h5 className="text-lg font-black text-[#242C5A]">{title}</h5>
                    <p className="text-sm text-gray-400 font-bold">{desc}</p>
                </div>
            </div>
            <Switch defaultChecked={defaultChecked} className="scale-110 data-[state=checked]:bg-[#242C5A]" />
        </div>
    );
}
