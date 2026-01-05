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
import { Eye, EyeOff, Loader2, Mail, Lock, Sparkles, Star } from "lucide-react";
import { loginSchema, LoginInput } from "@/lib/validations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800)); // Smooth transitions
            toast.success("تم تسجيل الدخول بنجاح");
            router.push("/dashboard");
        } catch (error) {
            toast.error("حدث خطأ أثناء تسجيل الدخول");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Mobile Logo */}
            <div className="mb-10 lg:hidden flex justify-center">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/20">
                    <span className="text-3xl font-black text-[#1a2144] italic">H</span>
                </div>
            </div>

            <div className="mb-10 text-center lg:text-right">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                    <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">دخول آمن بالنظام</span>
                </div>
                <h1 className="text-4xl font-[1000] text-white tracking-tight mb-4">
                    تسجيل الدخول
                </h1>
                <p className="text-gray-400 font-bold text-lg">
                    أهلاً بك مجدداً في بوابة <span className="text-white italic">Elite Access</span>
                </p>
            </div>

            <div className="relative group">
                {/* Decorative Spin Line for Form - 1.1px */}
                <div className="absolute -inset-6 pointer-events-none -z-10 opacity-20 group-focus-within:opacity-40 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-[2.5rem] border-[1.1px] border-white/20 border-dashed animate-spin-line duration-[40s]" />
                </div>

                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-[2rem] p-8 sm:p-10 shadow-2xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative group/field">
                                                    <Mail className="absolute right-5 top-5 h-5 w-5 text-gray-500 transition-colors group-focus-within/field:text-primary" />
                                                    <Input
                                                        className="h-16 pr-14 bg-white/[0.03] border-white/[0.08] focus:bg-white/[0.06] focus:border-primary/30 rounded-2xl transition-all shadow-none text-lg font-bold text-white placeholder:text-gray-600"
                                                        placeholder="البريد الإلكتروني"
                                                        autoComplete="email"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="font-bold text-xs text-red-400 mt-2" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative group/field">
                                                    <Lock className="absolute right-5 top-5 h-5 w-5 text-gray-500 transition-colors group-focus-within/field:text-primary" />
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        className="h-16 pr-14 pl-14 bg-white/[0.03] border-white/[0.08] focus:bg-white/[0.06] focus:border-primary/30 rounded-2xl transition-all shadow-none text-lg font-bold text-white placeholder:text-gray-600"
                                                        placeholder="كلمة المرور"
                                                        autoComplete="current-password"
                                                        {...field}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute left-3 top-3 h-10 w-10 p-0 hover:bg-white/5 text-gray-500 hover:text-white rounded-xl transition-all"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-5 w-5" />
                                                        ) : (
                                                            <Eye className="h-5 w-5" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="font-bold text-xs text-red-400 mt-2" />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-start px-2">
                                    <Link
                                        href="/forgot-password"
                                        className="text-[13px] font-black text-gray-500 hover:text-primary transition-all flex items-center gap-1 group/link"
                                    >
                                        <span className="w-0 h-0.5 bg-primary transition-all group-hover/link:w-3" />
                                        نسيت كلمة المرور؟
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-6 pt-4">
                                <Button
                                    className="w-full h-16 text-xl font-black bg-primary hover:bg-primary/90 text-[#0B0F1A] rounded-2xl transition-all shadow-2xl shadow-primary/20 border-none outline-none active:scale-[0.98] group/btn"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="ml-3 h-6 w-6 animate-spin" />
                                    ) : (
                                        <Sparkles className="ml-3 h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    )}
                                    تسجيل الدخول
                                </Button>

                                <div className="text-center text-[15px] text-gray-500 font-bold pt-2">
                                    ليس لديك حساب؟{" "}
                                    <Link href="/register" className="font-black text-primary hover:text-white transition-colors underline underline-offset-8 decoration-primary/30">
                                        أنشئ حساب جديد
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>

            {/* Bottom Features Hint */}
            <div className="mt-12 flex items-center justify-center gap-6 opacity-30 lg:hidden">
                <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-2">
                        <Star className="h-5 w-5 text-white" />
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-2">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
