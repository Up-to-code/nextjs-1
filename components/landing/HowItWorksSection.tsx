import { UserPlus, PackagePlus, Store } from "lucide-react";

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-32 bg-gray-50/30 border-y border-gray-100 relative overflow-hidden">
            <div className="container px-6 mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-24 text-balance">
                    <div className="flex flex-col gap-5">
                        <h2 className="text-5xl font-[1000] tracking-tighter sm:text-6xl text-[#242C5A]">
                            رحلتك <span className="text-gray-300">للقمة</span> تبدأ هنا
                        </h2>
                        <p className="text-xl text-gray-400 font-bold max-w-2xl mx-auto leading-relaxed">
                            ثلاث محطات ذكية تفصلك عن رقمنة أعمالك والوصول لعملائك في كل مكان.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-center items-stretch gap-10">
                    {[
                        {
                            icon: UserPlus,
                            title: "سجل مجاناً",
                            description: "أنشئ حسابك في أقل من دقيقة مجاناً، وابدأ في اكتشاف القوة.",
                        },
                        {
                            icon: PackagePlus,
                            title: "أضف رؤيتك",
                            description: "ارفع صور منتجاتك، حدد هويتك السعرية، ونظم مخزونك بذكاء.",
                        },
                        {
                            icon: Store,
                            title: "أطلق العنان",
                            description: "انشر متجرك واستقبل طلباتك الأولى مع نظام إشعار فوري وتتبع دقيق.",
                        }
                    ].map((item, index) => (
                        <div key={index} className="flex-1 bg-white p-12 rounded-[2.5rem] border border-gray-100 hover:border-primary/20 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] transition-all duration-500 group relative">
                            {/* Step Number Badge */}
                            <div className="absolute top-8 left-8 text-6xl font-[1000] text-gray-50 group-hover:text-primary/5 transition-colors leading-none -z-10">
                                0{index + 1}
                            </div>

                            <div className="flex flex-col items-start text-right">
                                <div className="bg-gray-50 p-6 rounded-[1.75rem] mb-10 group-hover:bg-[#242C5A] group-hover:text-white transition-all duration-500 group-hover:rotate-[10deg] group-hover:shadow-xl group-hover:shadow-primary/20">
                                    <item.icon className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-[1000] mb-5 text-[#242C5A] tracking-tighter">{item.title}</h3>
                                <p className="text-[17px] text-gray-400 font-bold leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
