import Link from "next/link";
import { Armchair, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white">
            <div className="container px-10 mx-auto max-w-7xl py-24">
                <div className="grid gap-20 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-10">
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

                        <p className="text-lg text-gray-400 font-bold leading-relaxed max-w-xs">
                            منصتكم الأولى لرقمنة معارض الأثاث الحديثة، حيث تلتقي التكنولوجيا بالفنون المعمارية.
                        </p>

                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <Link key={i} href="#" className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#242C5A] transition-all duration-300">
                                    <Icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-[1000] text-[#242C5A] mb-10 uppercase tracking-[0.3em]">الشركة</h3>
                        <ul className="space-y-5">
                            {["من نحن", "الوظائف", "المدونة", "اتصل بنا"].map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-gray-400 font-bold hover:text-[#242C5A] transition-colors text-lg">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-[1000] text-[#242C5A] mb-10 uppercase tracking-[0.3em]">الدعم</h3>
                        <ul className="space-y-5">
                            {["مركز المساعدة", "الشروط والأحكام", "سياسة الخصوصية", "الأسئلة الشائعة"].map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-gray-400 font-bold hover:text-[#242C5A] transition-colors text-lg">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-[1000] text-[#242C5A] mb-10 uppercase tracking-[0.3em]">تواصل معنا</h3>
                        <ul className="space-y-8">
                            <li className="flex flex-col gap-2">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">الموقع</span>
                                <span className="text-gray-500 font-bold">الرياض، المملكة العربية السعودية</span>
                            </li>
                            <li className="flex flex-col gap-2" dir="ltr">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none text-right">الهاتف</span>
                                <span className="text-gray-500 font-bold text-right">+966 50 000 0000</span>
                            </li>
                            <li className="flex flex-col gap-2">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">البريد الإلكتروني</span>
                                <span className="text-gray-500 font-bold">support@furnitureplus.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-24 pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 text-gray-400">
                    <p className="font-bold">© {new Date().getFullYear()} هاوسز إيليت. جميع الحقوق محفوظة.</p>
                    <div className="flex items-center gap-8">
                        <Link href="#" className="hover:text-[#242C5A] transition-colors font-bold">الأحكام</Link>
                        <Link href="#" className="hover:text-[#242C5A] transition-colors font-bold">الخصوصية</Link>
                        <Link href="#" className="hover:text-[#242C5A] transition-colors font-bold">التراخيص</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
