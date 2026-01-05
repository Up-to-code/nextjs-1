import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircle, Star, Sparkles, TrendingUp } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-[#FAFAFA] pt-32 pb-40 md:pt-40 md:pb-60">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] bg-primary/5 rounded-full blur-[140px]" />
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[70%] bg-blue-400/5 rounded-full blur-[120px]" />
            </div>

            <div className="container px-6 relative z-10 mx-auto">
                <div className="flex flex-col items-center space-y-12 text-center">

                    {/* Floating Elite Badge */}
                    <div className="relative p-[1px] rounded-full overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-transparent to-primary/40 animate-spin-line duration-[6s]" />
                        <div className="relative flex items-center gap-3 px-6 py-2 rounded-full bg-white border border-gray-100 group-hover:bg-gray-50 transition-colors">
                            <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#242C5A]">الإصدار النخبة 2026</span>
                        </div>
                    </div>

                    {/* Main Headline Area */}
                    <div className="space-y-10 max-w-5xl relative pb-8">
                        {/* Decorative Spin Lines for Title - Adjusted to 1.1px */}
                        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[750px] pointer-events-none -z-10 opacity-30">
                            <div className="absolute inset-0 rounded-full border-[1.1px] border-primary/20 border-dashed animate-spin-line duration-[25s]" />
                            <div className="absolute inset-16 rounded-full border-[1.1px] border-primary/10 animate-spin-line duration-[20s] direction-reverse" />
                            <div className="absolute inset-32 rounded-full border-[1.1px] border-primary/5 border-dotted animate-spin-line duration-[30s]" />
                        </div>

                        <h1 className="text-6xl font-black tracking-tighter sm:text-8xl md:text-9xl text-[#242C5A] leading-[1.1] flex flex-col gap-4 relative overflow-visible">
                            <span className="block">صمم قصة</span>
                            <span className="text-gray-300 block">
                                نجاحك <Sparkles className="absolute -top-6 -right-12 h-16 w-16 text-primary/20 animate-pulse" />
                            </span>
                            <span className="bg-gradient-to-r from-[#242C5A] to-primary bg-clip-text text-transparent italic block pb-4">بكل ذكاء</span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-gray-400 text-xl md:text-2xl font-bold leading-relaxed">
                            انتقل بمتجر الأثاث الخاص بك إلى آفاق جديدة مع شريك تقني يفهم طموحك ويحول بياناتك إلى نمو حقيقي.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                        <Link href="/register">
                            <Button size="lg" className="h-16 px-12 group bg-[#242C5A] hover:bg-[#1a2144] text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-primary/20 transition-all border-none">
                                ابدأ الشراكة
                                <ArrowLeft className="h-6 w-6 group-hover:-translate-x-2 transition-transform" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="h-16 px-12 gap-3 border-2 border-gray-100 bg-white hover:bg-gray-50 hover:border-primary/20 text-[#242C5A] rounded-[1.5rem] font-black text-xl transition-all">
                            <PlayCircle className="h-6 w-6" />
                            جولة ذكية
                        </Button>
                    </div>

                    {/* Elite Dashboard Mockup - FIXED & REFINED */}
                    <div className="relative w-full max-w-6xl mt-28 transition-all duration-1000 transform hover:scale-[1.01] group">
                        {/* Ambient Glow behind the mockup */}
                        <div className="absolute -inset-20 bg-[#242C5A]/5 blur-[120px] rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        {/* Dramatic Spin Lines for Mockup - Adjusted to 1.1px */}
                        <div className="absolute -inset-16 pointer-events-none -z-10 opacity-20">
                            <div className="absolute inset-0 rounded-[4rem] border-[1.1px] border-primary/20 border-dashed animate-spin-line duration-[40s]" />
                            <div className="absolute inset-8 rounded-[4rem] border-[1.1px] border-primary/10 animate-spin-line duration-[30s] direction-reverse" />
                        </div>

                        <div className="relative bg-white rounded-[3rem] p-4 border border-gray-100 shadow-[0_50px_100px_-20px_rgba(36,44,90,0.12)] overflow-hidden">
                            <div className="aspect-[16/10] w-full rounded-[2.25rem] bg-gray-50 overflow-hidden relative border border-gray-100/50">
                                {/* Stylized Placeholder / Actual Mockup */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-6 opacity-20">
                                        <TrendingUp className="h-16 w-16 text-[#242C5A]" />
                                        <p className="text-sm font-black tracking-[0.5em] uppercase text-[#242C5A]">Elite Dashboard Preview</p>
                                    </div>
                                </div>

                                {/* If image exists, it overlays the placeholder */}
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                                    alt="Dashboard Preview"
                                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50"
                                />
                            </div>

                            {/* Floating Analytics Indicator */}
                            <div className="absolute bottom-12 left-12 p-6 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-2xl flex items-center gap-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                                    <TrendingUp className="h-7 w-7" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">نمو المبيعات</p>
                                    <p className="text-2xl font-black text-[#242C5A]">+42.5%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clean Brands Section */}
                    <div className="pt-32 w-full max-w-4xl">
                        <div className="flex flex-col items-center gap-8">
                            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                            <div className="flex flex-wrap justify-center items-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                                <span className="text-2xl font-black text-slate-800 tracking-tighter">ASHLEY</span>
                                <span className="text-2xl font-black text-slate-800 tracking-tighter italic">ikea</span>
                                <span className="text-2xl font-black text-slate-800 tracking-tighter">PAN</span>
                                <span className="text-2xl font-black text-slate-800 tracking-tighter">WEST ELM</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:32px:32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_100%,transparent_100%)] pointer-events-none opacity-40" />
        </section>
    );
}
