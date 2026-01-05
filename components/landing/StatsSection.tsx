export function StatsSection() {
    return (
        <section className="py-40 bg-[#242C5A] relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-50%] left-[-10%] w-full h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] animate-pulse" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="container px-6 relative z-10 mx-auto max-w-7xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-16 md:gap-24 text-center">
                    {[
                        { value: "500+", label: "شريك نشط" },
                        { value: "10K+", label: "منتج متاح" },
                        { value: "50K+", label: "طلب شهرياً" },
                        { value: "99%", label: "رضا العملاء" },
                    ].map((stat, index) => (
                        <div key={index} className="space-y-4 group">
                            <h3 className="text-6xl font-[1000] tracking-tighter sm:text-7xl lg:text-8xl text-white transition-transform duration-500 group-hover:scale-110">
                                {stat.value}
                            </h3>
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-1 w-12 bg-primary/30 rounded-full" />
                                <p className="text-white/50 text-sm font-[900] uppercase tracking-[0.4em]">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
