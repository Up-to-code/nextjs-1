"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";
import { arSA } from "date-fns/locale";

export function NotificationsDropdown() {
    const { notifications, markAsRead, clearAll } = useNotifications();
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full hover:bg-gray-100">
                    <Bell className="h-4 w-4 text-gray-500" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 border-gray-100 rounded-xl" align="end">
                <div className="flex items-center justify-between p-3">
                    <span className="text-sm font-semibold">الإشعارات</span>
                    {notifications.length > 0 && (
                        <button onClick={clearAll} className="text-xs text-blue-600 hover:text-blue-700">
                            مسح الكل
                        </button>
                    )}
                </div>
                <DropdownMenuSeparator className="bg-gray-50" />
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Bell className="h-8 w-8 text-gray-200 mb-2" />
                            <p className="text-xs text-gray-400">لا توجد إشعارات حالياً</p>
                        </div>
                    ) : (
                        <div className="p-1">
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={`cursor-pointer flex flex-col items-start gap-1 p-3 rounded-lg mb-1 ${!notification.read ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                                        }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex w-full gap-3">
                                        <div className="flex-1 space-y-1">
                                            <p className={`text-sm leading-none ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-500 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 text-left mt-1" dir="ltr">
                                                {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: arSA })}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5" />
                                        )}
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
