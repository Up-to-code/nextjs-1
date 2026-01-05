import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-[#0F172A] border-l border-white/5">
                <DashboardSidebar />
            </div>
            <main className="md:pr-72 h-full">
                <DashboardHeader />
                <div className="p-8 h-full bg-slate-50/50">
                    {children}
                </div>
            </main>
        </div>
    );
}
