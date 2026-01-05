"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut } from "lucide-react";

export function UserNav() {
    const router = useRouter();
    // Static Mock User Data
    const user = {
        name: "أحمد محمد",
        email: "partner@example.com",
        avatar: "",
    };

    const logout = () => {
        router.push("/login");
    };

    return (
        <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full ring-2 ring-transparent hover:ring-gray-100 transition-all p-0">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/avatars/01.png"} alt={user.name} />
                        <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border-gray-100 rounded-xl p-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-gray-900">{user.name}</p>
                        <p className="text-xs leading-none text-gray-500">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-50" />
                <DropdownMenuGroup>
                    <Link href="/settings">
                        <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50 px-2 py-2">
                            <User className="ml-2 h-4 w-4 text-gray-500" />
                            الملف الشخصي
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/settings">
                        <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50 px-2 py-2">
                            <Settings className="ml-2 h-4 w-4 text-gray-500" />
                            الإعدادات
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-gray-50" />
                <DropdownMenuItem onClick={logout} className="rounded-lg cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 focus:text-red-700 px-2 py-2">
                    <LogOut className="ml-2 h-4 w-4" />
                    تسجيل الخروج
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
