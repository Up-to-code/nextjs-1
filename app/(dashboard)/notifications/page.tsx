"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, Check, Clock, Package, ShoppingCart, Tag } from "lucide-react";

const notifications = [
    {
        id: "1",
        title: "تم استلام طلب جديد",
        description: "طلب #1024 من محمد علي بقيمة 450 ر.س",
        time: "منذ 5 دقائق",
        type: "order",
        read: false,
    },
    {
        id: "2",
        title: "نفاد مخزون منتج",
        description: "المنتج 'طاولة قهوة' وصل للحد الأدنى للمخزون",
        time: "منذ ساعتين",
        type: "inventory",
        read: false,
    },
    {
        id: "3",
        title: "تم تقييم منتج",
        description: "حصل المنتج 'كنبة مودرن' على تقييم 5 نجوم",
        time: "منذ 4 ساعات",
        type: "review",
        read: true,
    },
    {
        id: "4",
        title: "تحديث النظام",
        description: "تم تحديث النظام بنجاح، استكشف الميزات الجديدة",
        time: "منذ يوم واحد",
        type: "system",
        read: true,
    },
];

export default function NotificationsPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">الإشعارات</h2>
                    <p className="text-sm text-gray-500 mt-1">تابع آخر التحديثات والنشاطات في متجرك</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-white border-gray-200">
                        <Check className="ml-2 h-4 w-4" />
                        تحديد الكل كمقروء
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 rounded-3xl border ${notification.read
                                ? "bg-white border-gray-100"
                                : "bg-blue-50/50 border-blue-100"
                                }`}
                        >
                            <div className="flex gap-4">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === 'order' ? 'bg-blue-100 text-blue-600' :
                                    notification.type === 'inventory' ? 'bg-orange-100 text-orange-600' :
                                        notification.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-gray-100 text-gray-600'
                                    }`}>
                                    {notification.type === 'order' && <ShoppingCart className="h-5 w-5" />}
                                    {notification.type === 'inventory' && <Package className="h-5 w-5" />}
                                    {notification.type === 'review' && <Tag className="h-5 w-5" />}
                                    {notification.type === 'system' && <Bell className="h-5 w-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`text-base font-semibold ${notification.read ? 'text-gray-900' : 'text-blue-900'}`}>
                                            {notification.title}
                                        </h4>
                                        <span className="text-xs text-gray-400 flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
                                            <Clock className="h-3 w-3" />
                                            {notification.time}
                                        </span>
                                    </div>
                                    <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-blue-700/80'}`}>
                                        {notification.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <Card className="rounded-3xl border border-gray-100">
                        <CardHeader>
                            <CardTitle className="text-lg">إعدادات سريعة</CardTitle>
                            <CardDescription>تحكم في الإشعارات التي تصلك</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-medium">الطلبات الجديدة</div>
                                    <div className="text-xs text-gray-500">تنبيه فوري عند الطلب</div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-medium">نقص المخزون</div>
                                    <div className="text-xs text-gray-500">تنبيه عند قرب النفاد</div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-medium">رسائل العملاء</div>
                                    <div className="text-xs text-gray-500">إشعارات المحادثات</div>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
