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
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import { Sparkles } from "lucide-react";
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
            <div className="mb-10 lg:hidden">
                <div className="h-14 w-14 bg-[#242C5A] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                    <span className="text-2xl font-bold text-white italic">H</span>
                </div>
            </div>

            <div className="mb-12">
                <h1 className="text-3xl font-bold text-[#1a2144] tracking-tight">
                    تسجيل الدخول
                </h1>
                <p className="text-gray-500 mt-3 font-medium text-lg">
                    أهلاً بك مجدداً في منصة هاوسز
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative group">
                                            <User className="absolute right-5 top-4 h-5 w-5 text-gray-400 z-10 transition-colors group-focus-within:text-[#242C5A]" />
                                            <Input
                                                className="h-14 pr-12 bg-gray-50 border-gray-100 focus:bg-white focus:border-[#242C5A]/20 rounded-2xl transition-all shadow-none text-lg font-bold"
                                                placeholder="البريد الإلكتروني"
                                                autoComplete="email"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="font-bold text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative group">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                className="h-14 bg-gray-50 border-gray-100 focus:bg-white focus:border-[#242C5A]/20 rounded-2xl transition-all shadow-none text-lg font-bold px-6"
                                                placeholder="كلمة المرور"
                                                autoComplete="current-password"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute left-2 top-2 h-10 w-10 p-0 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5 text-gray-400 group-focus-within:text-[#242C5A]" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-gray-400 group-focus-within:text-[#242C5A]" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="font-bold text-xs" />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end pr-1">
                            <Link
                                href="/forgot-password"
                                className="text-sm font-black text-[#242C5A] hover:text-primary transition-colors"
                            >
                                نسيت كلمة المرور؟
                            </Link>
                        </div>
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
                            تسجيل الدخول
                        </Button>

                        <div className="text-center text-[15px] text-gray-400 font-bold">
                            ليس لديك حساب؟{" "}
                            <Link href="/register" className="font-black text-[#242C5A] hover:text-primary transition-colors">
                                أنشئ حساب جديد
                            </Link>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
