import { Star } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white relative overflow-hidden font-sans">
            {/* Simple Background Element */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.015] bg-[size:30px_30px]" />
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-50/30 rounded-full blur-[100px]" />
            </div>

            {/* Form Side */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 order-2 lg:order-1">
                <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </div>

            {/* Branding Side - Light & Minimal */}
            <div className="hidden lg:flex flex-col justify-center bg-slate-50 border-l border-slate-100 p-24 text-slate-900 relative order-1 lg:order-2">
                <div className="relative z-10 max-w-lg mr-0 ml-auto flex flex-col items-end text-right">
                    <div className="mb-12 flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Houses</span>
                            <span className="text-[11px] font-bold text-blue-600 tracking-[0.2em] uppercase leading-none mt-1.5 opacity-70">Partner Portal</span>
                        </div>
                        <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl font-bold text-white italic">H</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-bold leading-tight text-slate-900 tracking-tight">
                            بساطة الإدارة <br />
                            <span className="text-blue-600">في متناول يدك</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-sm">
                            انضم إلى مئات الشركاء الذين يديرون أعمالهم بكل يسر وسهولة. صممنا لك تجربة بسيطة وفعالة.
                        </p>
                    </div>

                    <div className="mt-20 flex items-center gap-8 opacity-40 grayscale pointer-events-none">
                        <span className="text-xl font-bold tracking-tighter">ASHLEY</span>
                        <span className="text-xl font-bold tracking-tighter italic">ikea</span>
                        <span className="text-xl font-bold tracking-tighter">PAN</span>
                    </div>

                    <div className="mt-20">
                        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                            © {new Date().getFullYear()} Houses Platform. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
