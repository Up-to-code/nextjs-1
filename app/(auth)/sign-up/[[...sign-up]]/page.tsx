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
import { Loader2 } from "lucide-react";
import { Sparkles } from "lucide-react";

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
            <div className="mb-10 lg:hidden">
                <div className="h-14 w-14 bg-[#242C5A] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                    <span className="text-2xl font-bold text-white italic">H</span>
                </div>
            </div>

            <div className="mb-12">
                <h1 className="text-3xl font-bold text-[#1a2144] tracking-tight">
                    إنشاء حساب جديد
                </h1>
                <p className="text-gray-500 mt-3 font-medium text-lg">
                    انضم إلى منصة هاوسز لإدارة معرضك
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input className="h-14 bg-gray-50 border-gray-100 focus:bg-white focus:border-[#242C5A]/20 rounded-2xl transition-all shadow-none text-lg font-bold px-6" placeholder="الاسم الكامل" {...field} />
                                    </FormControl>
                                    <FormMessage className="font-bold text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input className="h-14 bg-gray-50 border-gray-100 focus:bg-white focus:border-[#242C5A]/20 rounded-2xl transition-all shadow-none text-lg font-bold px-6" placeholder="اسم المنشأة" {...field} />
                                    </FormControl>
                                    <FormMessage className="font-bold text-xs" />
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
                                    <Input className="h-14 bg-gray-50 border-gray-100 focus:bg-white focus:border-[#242C5A]/20 rounded-2xl transition-all shadow-none text-lg font-bold px-6" placeholder="البريد الإلكتروني" {...field} />
                                </FormControl>
                                <FormMessage className="font-bold text-xs" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input className="h-14 bg-gray-50 border-gray-100 focus:bg-white focus:border-[#242C5A]/20 rounded-2xl transition-all text-right shadow-none text-lg font-bold px-6" dir="ltr" placeholder="رقم الجوال" {...field} />
                                </FormControl>
                                <FormMessage className="font-bold text-xs" />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="password" className="h-14 bg-gray-50 border-gray-100 focus:bg-white focus:border-[#242C5A]/20 rounded-2xl transition-all shadow-none text-lg font-bold px-6" placeholder="كلمة المرور" {...field} />
                                    </FormControl>
                                    <FormMessage className="font-bold text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="password" className="h-14 bg-gray-50 border-gray-100 focus:bg-white focus:border-[#242C5A]/20 rounded-2xl transition-all shadow-none text-lg font-bold px-6" placeholder="تأكيد كلمة المرور" {...field} />
                                    </FormControl>
                                    <FormMessage className="font-bold text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <Checkbox id="terms" className="h-6 w-6 border-gray-200 data-[state=checked]:bg-[#242C5A] data-[state=checked]:border-[#242C5A] rounded-lg transition-colors" required />
                        <label
                            htmlFor="terms"
                            className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400 cursor-pointer hover:text-gray-500 transition-colors"
                        >
                            أوافق على <span className="text-[#242C5A] font-black">شروط وأحكام</span> الخدمة
                        </label>
                    </div>

                    <div className="space-y-6 pt-4">
                        <Button
                            className="w-full h-14 text-xl font-black bg-[#242C5A] hover:bg-[#1a2144] rounded-2xl transition-all shadow-2xl shadow-primary/10 border-none outline-none active:scale-[0.98]"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="ml-3 h-6 w-6 animate-spin" />
                            ) : null}
                            إنشاء حساب جديد
                        </Button>

                        <div className="text-center text-[15px] text-gray-400 font-bold">
                            لديك حساب بالفعل؟{" "}
                            <Link href="/login" className="font-black text-[#242C5A] hover:text-primary transition-colors">
                                تسجيل الدخول
                            </Link>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
