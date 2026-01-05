import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Armchair } from "lucide-react";

export function LandingHeader() {
    return (
        <header className="fixed top-0 z-[100] w-full bg-white/60 backdrop-blur-2xl border-b border-gray-100/50 h-24">
            <div className="container h-full flex items-center justify-between px-10 mx-auto max-w-7xl">
                {/* Elite Brand Area */}
                <div className="flex items-center gap-5 cursor-pointer group">
                    <div className="h-12 w-12 bg-[#242C5A] rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[10deg] shadow-lg shadow-primary/20">
                        <span className="text-2xl font-black text-white italic">H</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-[1000] text-[#242C5A] tracking-tighter leading-none">Houses</span>
                        <span className="text-[11px] font-black text-primary tracking-[0.4em] uppercase leading-none mt-1.5 opacity-60">Elite Suite</span>
                    </div>
                </div>

                {/* Navigation - Clean & Spaced */}
                <nav className="hidden lg:flex items-center gap-12">
                    {["المميزات", "الشركاء", "الأسعار", "تواصل معنا"].map((item) => (
                        <Link
                            key={item}
                            href={`#${item}`}
                            className="text-[15px] font-black text-gray-400 hover:text-[#242C5A] transition-all relative group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Premium Actions */}
                <div className="flex items-center gap-8">
                    <Link href="/login" className="text-[15px] font-black text-gray-400 hover:text-[#242C5A] transition-colors hidden sm:block">
                        تسجيل الدخول
                    </Link>
                    <Link href="/register">
                        <Button className="bg-[#242C5A] hover:bg-[#1a2144] text-white font-black px-10 h-14 rounded-2xl shadow-xl shadow-primary/10 border-none transition-all active:scale-95 text-lg">
                            جرب مجاناً
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
