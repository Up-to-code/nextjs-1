import { Sparkles, Star } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white relative overflow-hidden font-sans">
            {/* Form Side */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 order-2 lg:order-1 relative z-10">
                {/* Subtle Background Elements for Form Side */}
                <div className="absolute inset-0 pointer-events-none -z-10 bg-gray-50/30">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] bg-[size:30px_30px]" />
                    <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
                </div>

                <div className="w-full max-w-[460px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {children}
                </div>
            </div>

            {/* Branding Side - Hidden on small screens */}
            <div className="hidden lg:flex flex-col justify-center bg-[#1a2144] p-24 text-white relative order-1 lg:order-2">
                <div className="relative z-10 max-w-lg mr-0 ml-auto">
                    <div className="mb-12 flex items-center gap-4 justify-end">
                        <span className="text-3xl font-bold tracking-tight text-white">Houses</span>
                        <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-xl font-bold text-[#1a2144]">H</span>
                        </div>
                    </div>

                    <div className="space-y-6 text-right">
                        <h1 className="text-5xl font-bold leading-tight text-white">
                            كن شريكاً لنا في النجاح
                        </h1>
                        <p className="text-lg text-gray-400 leading-relaxed">
                            انضم إلى عائلة هاوسز وقم بإدارة معرض الأثاث الخاص بك بأحدث التقنيات الذكية. نحن هنا لنمو أعمالك.
                        </p>
                    </div>

                    <div className="mt-20 opacity-30">
                        <p className="text-xs font-medium text-gray-500 text-right">
                            © {new Date().getFullYear()} Houses Platform. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
