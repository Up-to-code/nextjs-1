"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { registerSchema, RegisterInput } from "@/lib/validations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, User, Building2, Mail, Phone, Lock } from "lucide-react";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            businessName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            toast.success("تم إنشاء الحساب بنجاح");
            router.push("/dashboard");
        } catch (error) {
            toast.error("حدث خطأ أثناء إنشاء الحساب");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Mobile Header */}
            <div className="mb-10 lg:hidden flex flex-col items-center">
                <div className="h-14 w-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-2xl font-bold text-white italic">H</span>
                </div>
            </div>

            <div className="mb-10 text-center lg:text-right">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
                    إنشاء حساب جديد
                </h1>
                <p className="text-slate-500 font-medium">
                    انضم إلى منصة <span className="text-slate-900 font-bold">Houses</span> لإدارة معرضك
                </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute right-4 top-4 h-5 w-5 text-slate-400" />
                                                <Input
                                                    className="h-13 pr-12 bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-500/30 rounded-xl transition-all shadow-none font-medium text-slate-900 placeholder:text-slate-400"
                                                    placeholder="الاسم الكامل"
                                                    autoComplete="name"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs font-bold text-red-500 mt-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="businessName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Building2 className="absolute right-4 top-4 h-5 w-5 text-slate-400" />
                                                <Input
                                                    className="h-13 pr-12 bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-500/30 rounded-xl transition-all shadow-none font-medium text-slate-900 placeholder:text-slate-400"
                                                    placeholder="اسم المنشأة"
                                                    autoComplete="organization"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs font-bold text-red-500 mt-1" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute right-4 top-4 h-5 w-5 text-slate-400" />
                                            <Input
                                                className="h-13 pr-12 bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-500/30 rounded-xl transition-all shadow-none font-medium text-slate-900 placeholder:text-slate-400"
                                                placeholder="البريد الإلكتروني"
                                                autoComplete="email"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs font-bold text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute right-4 top-4 h-5 w-5 text-slate-400" />
                                            <Input
                                                className="h-13 pr-12 bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-500/30 rounded-xl transition-all text-right shadow-none font-medium text-slate-900 placeholder:text-slate-400"
                                                dir="ltr"
                                                placeholder="رقم الجوال"
                                                autoComplete="tel"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs font-bold text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute right-4 top-4 h-5 w-5 text-slate-400" />
                                                <Input
                                                    type="password"
                                                    className="h-13 pr-12 bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-500/30 rounded-xl transition-all shadow-none font-medium text-slate-900 placeholder:text-slate-400"
                                                    placeholder="كلمة المرور"
                                                    autoComplete="new-password"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs font-bold text-red-500 mt-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute right-4 top-4 h-5 w-5 text-slate-400" />
                                                <Input
                                                    type="password"
                                                    className="h-13 pr-12 bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-500/30 rounded-xl transition-all shadow-none font-medium text-slate-900 placeholder:text-slate-400"
                                                    placeholder="تأكيد كلمة المرور"
                                                    autoComplete="new-password"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs font-bold text-red-500 mt-1" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center gap-3 py-2">
                            <Checkbox id="terms" className="h-5 w-5 border-slate-200 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 rounded-md transition-colors" required />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-500 cursor-pointer hover:text-slate-900 transition-colors"
                            >
                                أوافق على <span className="text-slate-900 font-bold underline underline-offset-4 decoration-slate-200">شروط وأحكام</span> الخدمة
                            </label>
                        </div>

                        <div className="space-y-6 pt-2">
                            <Button
                                className="w-full h-13 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-md active:scale-[0.98]"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                                ) : null}
                                إنشاء حساب جديد
                            </Button>

                            <div className="text-center text-sm text-slate-500 font-medium">
                                لديك حساب بالفعل؟{" "}
                                <Link href="/login" className="font-bold text-slate-900 hover:text-blue-600 transition-colors underline underline-offset-4 decoration-slate-200">
                                    تسجيل الدخول
                                </Link>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
