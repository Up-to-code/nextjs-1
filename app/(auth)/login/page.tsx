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
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
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
            await new Promise(resolve => setTimeout(resolve, 800));
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
            {/* Mobile Header */}
            <div className="mb-10 lg:hidden flex flex-col items-center">
                <div className="h-14 w-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-2xl font-bold text-white italic">H</span>
                </div>
            </div>

            <div className="mb-10 text-center lg:text-right">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
                    تسجيل الدخول
                </h1>
                <p className="text-slate-500 font-medium">
                    أهلاً بك مجدداً في منصة <span className="text-slate-900 font-bold">Houses</span>
                </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group/field">
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group/field">
                                                <Lock className="absolute right-4 top-4 h-5 w-5 text-slate-400" />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    className="h-13 pr-12 pl-12 bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-500/30 rounded-xl transition-all shadow-none font-medium text-slate-900 placeholder:text-slate-400"
                                                    placeholder="كلمة المرور"
                                                    autoComplete="current-password"
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute left-2 top-2 h-9 w-9 p-0 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-lg"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs font-bold text-red-500 mt-1" />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end px-1">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                                >
                                    نسيت كلمة المرور؟
                                </Link>
                            </div>
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
                                تسجيل الدخول
                            </Button>

                            <div className="text-center text-sm text-slate-500 font-medium">
                                ليس لديك حساب؟{" "}
                                <Link href="/register" className="font-bold text-slate-900 hover:text-blue-600 transition-colors underline underline-offset-4 decoration-slate-200">
                                    أنشئ حساب جديد
                                </Link>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
