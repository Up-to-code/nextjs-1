"use client";

import { Order, Product } from "@/types";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerInfoCard } from "@/components/shared/CustomerInfoCard";
import { Button } from "@/components/ui/button";
import { Printer, XCircle } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Mock Data for Order Detail
const mockOrderItems = [
    { id: 1, name: "مكتب عمل حديث", quantity: 1, price: 450 },
    { id: 2, name: "كرسي مكتب مريح", quantity: 2, price: 350 },
];

export function OrderDetail({ orderId }: { orderId: string }) {
    // In real app, fetch order by ID
    const orderData = {
        id: "1",
        orderNumber: "1001",
        customerName: "محمد أحمد",
        customerEmail: "mohamed@example.com",
        status: "processing" as const,
        date: "2024-01-15",
        totalAmount: 1150,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">طلب #{orderData.orderNumber}</h2>
                    <div className="text-muted-foreground text-sm flex items-center gap-2">
                        تم الطلب في {orderData.date} • <OrderStatusBadge status={orderData.status} />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Printer className="ml-2 h-4 w-4" />
                        طباعة الفاتورة
                    </Button>
                    <Button variant="destructive">
                        <XCircle className="ml-2 h-4 w-4" />
                        إلغاء الطلب
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>تفاصيل المنتجات</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-right">المنتج</TableHead>
                                        <TableHead className="text-center">الكمية</TableHead>
                                        <TableHead className="text-right">السعر</TableHead>
                                        <TableHead className="text-right">الإجمالي</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockOrderItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                            <TableCell>{item.price} ر.س</TableCell>
                                            <TableCell>{item.price * item.quantity} ر.س</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-left font-bold pt-4">المجموع الفرعي</TableCell>
                                        <TableCell className="pt-4">1150 ر.س</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-left font-bold">الضريبة (15%)</TableCell>
                                        <TableCell>172.5 ر.س</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-left font-bold text-lg">الإجمالي الكلي</TableCell>
                                        <TableCell className="font-bold text-lg text-primary">1322.5 ر.س</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>تتبع الحالة</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-r border-gray-200 dark:border-gray-700 mr-3 space-y-8 py-2">
                                <div className="mb-8 mr-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -right-3 ring-8 ring-white dark:ring-gray-900 dark:bg-green-900">
                                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">تم استلام الطلب</h3>
                                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">تم الطلب في 2024-01-15</time>
                                </div>
                                <div className="mr-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -right-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                                    </span>
                                    <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">جارِ التجهيز</h3>
                                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">يقوم الشريك بتجهيز الطلب للشحن.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <CustomerInfoCard
                        name={orderData.customerName}
                        email={orderData.customerEmail}
                        orderCount={5}
                    />
                </div>
            </div>
        </div>
    );
}
