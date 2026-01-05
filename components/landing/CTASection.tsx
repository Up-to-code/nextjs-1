import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
    return (
        <section className="py-32 bg-white relative overflow-hidden">
            <div className="container px-6 mx-auto max-w-7xl">
                <div className="bg-[#242C5A] rounded-[3.5rem] p-16 md:p-32 text-center relative overflow-hidden group">
                    {/* Decorative Mesh inside CTA */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-[-20%] right-[-10%] w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] animate-pulse" />
                        <div className="absolute bottom-[-20%] left-[-10%] w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,122,255,0.1)_0%,transparent_70%)]" />
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto space-y-12">
                        <h2 className="text-5xl font-[1000] tracking-tighter sm:text-7xl text-white leading-tight">
                            مستعد لرفع <br />
                            <span className="text-white/40 italic">سقف طموحك؟</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-white/50 font-bold max-w-2xl mx-auto leading-relaxed">
                            انضم لآلاف الشركاء الذين اختاروا التميز وقيادة مستقبل صناعة الأثاث اليوم.
                        </p>
                        <div className="pt-8">
                            <Link href="/register">
                                <Button size="lg" className="h-20 px-16 text-2xl bg-white hover:bg-gray-100 text-[#242C5A] rounded-[2rem] font-[1000] border-none shadow-2xl transition-all active:scale-95 group-hover:scale-105 duration-500">
                                    ابدأ رحلة النجاح الآن
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
