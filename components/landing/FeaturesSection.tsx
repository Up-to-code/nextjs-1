import {
    BarChart3,
    ShoppingCart,
    Package,
    Bell,
    Users,
    Settings
} from "lucide-react";

const features = [
    {
        icon: BarChart3,
        title: "تحليلات متقدمة",
        description: "راقب أداء متجرك بدقة مع رسوم بيانية تفاعلية وتقارير مفصلة للمبيعات والأرباح.",
    },
    {
        icon: ShoppingCart,
        title: "إدارة الطلبات",
        description: "نظام متكامل لمعالجة الطلبات من الاستلام وحتى التسليم مع تتبع الحالات.",
    },
    {
        icon: Package,
        title: "إدارة المنتجات",
        description: "أضف وعدل منتجاتك بسهولة، تحكم في المخزون، ونظم الفئات بمرونة عالية.",
    },
    {
        icon: Bell,
        title: "إشعارات فورية",
        description: "استقبل تنبيهات مباشرة للطلبات الجديدة، حالات المخزون، ورسائل العملاء.",
    },
    {
        icon: Users,
        title: "إدارة العملاء",
        description: "قاعدة بيانات شاملة لعملائك مع سجل كامل لطلباتهم وتواصلهم.",
    },
    {
        icon: Settings,
        title: "إعدادات مرنة",
        description: "خصص متجرك، طرق الشحن، والمدفوعات بما يناسب نموذج عملك.",
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="py-32 bg-white relative overflow-hidden">
            {/* Soft decorative background orbs */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-blue-400/5 rounded-full blur-[100px] -z-10" />

            <div className="container px-6 mx-auto max-w-7xl">
                <div className="text-center mb-24 text-balance">
                    <div className="flex flex-col gap-5">
                        <h2 className="text-5xl font-[1000] tracking-tighter sm:text-6xl text-[#242C5A] leading-tight">
                            منظومة متكاملة لسيادتك <br />
                            على <span className="text-gray-300">سوق الأثاث</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-bold leading-relaxed">
                            مجموعة من الأدوات الذكية صممت خصيصاً لتمنحك السيطرة المطلقة والنمو الذي تستحقه.
                        </p>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-12 rounded-[2.5rem] bg-white border border-gray-100 hover:border-primary/20 hover:shadow-[0_30px_60px_-15px_rgba(36,44,90,0.08)] transition-all duration-500 relative overflow-hidden"
                        >
                            {/* Card Hover Accent */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="w-20 h-20 rounded-[1.75rem] bg-gray-50 flex items-center justify-center mb-10 group-hover:bg-[#242C5A] group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/20">
                                <feature.icon className="w-10 h-10" />
                            </div>
                            <h3 className="text-3xl font-[1000] mb-5 text-[#242C5A] tracking-tighter">{feature.title}</h3>
                            <p className="text-[17px] text-gray-400 font-bold leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
