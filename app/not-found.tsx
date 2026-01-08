import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 text-[#242C5A]" dir="rtl">
            {/* Icon */}
            <div className="bg-white p-6 rounded-3xl shadow-sm mb-6">
                <FileQuestion className="h-16 w-16 text-slate-300" />
            </div>

            {/* Text */}
            <h1 className="text-4xl font-black mb-2">404</h1>
            <h2 className="text-xl font-bold mb-4">الصفحة غير موجودة</h2>
            <p className="text-gray-500 mb-8 max-w-md text-center">
                عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو حذفها.
            </p>

            {/* Action */}
            <Link href="/dashboard">
                <Button className="h-12 px-8 bg-[#242C5A] hover:bg-[#1A1A27] text-white rounded-xl font-bold">
                    العودة للرئيسية
                </Button>
            </Link>
        </div>
    );
}
