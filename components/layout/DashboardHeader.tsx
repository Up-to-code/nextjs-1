"use client";

import { MobileSidebar } from "@/components/layout/DashboardSidebar";
import { UserNav } from "@/components/layout/UserNav";
import { NotificationsDropdown } from "@/components/layout/NotificationsDropdown";
import { Search, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DashboardHeader() {
    return (
        <div className="h-16 border-b border-gray-200 bg-white px-8 flex items-center justify-between sticky top-0 z-50 transition-all">
            <div className="flex items-center gap-6 flex-1">
                <MobileSidebar />

                {/* Search Bar - Modern & Flat */}
                <div className="hidden lg:flex items-center gap-3 w-full max-w-md bg-gray-50 hover:bg-gray-100 transition-all rounded-xl px-4 h-10 border border-gray-200 focus-within:border-primary/20 focus-within:bg-white">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="ابحث عن الطلبات، المنتجات، أو العملاء..."
                        className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Link href="/help">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl h-10 w-10 transition-all">
                        <HelpCircle className="h-5 w-5" />
                    </Button>
                </Link>
                <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block" />
                <NotificationsDropdown />
                <UserNav />
            </div>
        </div>
    );
}
