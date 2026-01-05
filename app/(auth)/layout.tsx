import { Star, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#0B0F1A] relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] opacity-60" />
                <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-[#242C5A]/20 rounded-full blur-[130px] opacity-40" />
                <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />

                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-[size:40px_40px] mix-blend-overlay" />
            </div>

            {/* Form Side */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 order-2 lg:order-1 relative z-10">
                <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
                    {children}
                </div>
            </div>

            {/* Branding Side - Hidden on small screens */}
            <div className="hidden lg:flex flex-col justify-center bg-[#1a2144]/30 backdrop-blur-sm border-r border-white/5 p-24 text-white relative order-1 lg:order-2">
                {/* Decorative Elements for Branding Side */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10">
                        <div className="absolute inset-0 rounded-full border-[1.1px] border-white/20 border-dashed animate-spin-line duration-[40s]" />
                        <div className="absolute inset-20 rounded-full border-[1.1px] border-white/10 animate-spin-line duration-[30s] direction-reverse" />
                    </div>
                </div>

                <div className="relative z-10 max-w-lg mr-0 ml-auto flex flex-col items-end text-right">
                    {/* Floating Elite Badge */}
                    <div className="mb-12 relative p-[1px] rounded-full overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-transparent to-primary/60 animate-spin-line duration-[6s]" />
                        <div className="relative flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 group-hover:bg-white/10 transition-colors">
                            <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white">شريك النخبة</span>
                        </div>
                    </div>

                    <div className="mb-12 flex items-center gap-5">
                        <div className="flex flex-col items-end">
                            <span className="text-4xl font-[1000] text-white tracking-tighter leading-none">Houses</span>
                            <span className="text-[12px] font-black text-primary tracking-[0.4em] uppercase leading-none mt-2 opacity-80">Elite Suite</span>
                        </div>
                        <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 transition-transform hover:rotate-6">
                            <span className="text-3xl font-black text-[#1a2144] italic">H</span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h1 className="text-6xl font-black leading-[1.15] text-white tracking-tight">
                            مستقبل إدارة <br />
                            <span className="bg-gradient-to-l from-white to-white/40 bg-clip-text text-transparent italic">معارض الأثاث</span>
                        </h1>
                        <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-md">
                            انضم إلى المنصة الأذكى عالمياً لإدارة مبيعاتك وعملائك. صممنا لك تجربة تليق بطموحك.
                        </p>
                    </div>

                    <div className="mt-24 flex items-center gap-8 opacity-40 grayscale">
                        <span className="text-xl font-black tracking-tighter">ASHLEY</span>
                        <span className="text-xl font-black tracking-tighter italic">ikea</span>
                        <span className="text-xl font-black tracking-tighter uppercase">Pan</span>
                    </div>

                    <div className="mt-20 opacity-20">
                        <p className="text-xs font-black tracking-widest text-gray-500">
                            © {new Date().getFullYear()} HOUSES PLATFORM. 2026 ELITE EDITION.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
