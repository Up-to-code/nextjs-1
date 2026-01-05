"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { ArrowRight, Printer, Mail, MapPin, Phone, CreditCard, User, Bell } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Order } from "@/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Mock Data for a single order
const MOCK_ORDER: Order = {
    id: "1",
    orderNumber: "1001",
    customerId: "cust-1",
    customer: {
        id: "cust-1",
        name: "محمد أحمد",
        email: "mohamed@example.com",
        phone: "0500000001",
        address: "شارع الملك فهد، حي العقيق",
        city: "الرياض",
        postalCode: "12345"
    },
    items: [
        {
            productId: "prod-1",
            productName: "كرسي مكتب مريح",
            productImage: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80",
            sku: "OFF-CH-001",
            quantity: 2,
            unitPrice: 450,
            totalPrice: 900
        },
        {
            productId: "prod-2",
            productName: "طاولة جانبية",
            productImage: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&q=80",
            sku: "TBL-SD-002",
            quantity: 1,
            unitPrice: 350,
            totalPrice: 350
        }
    ],
    subtotal: 1250,
    shippingCost: 50,
    tax: 187.5,
    discount: 0,
    total: 1487.5,
    paymentMethod: "card",
    paymentStatus: "paid",
    orderStatus: "processing",
    notes: "يرجى الاتصال قبل التوصيل",
    statusHistory: [
        {
            status: "pending",
            note: "تم إنشاء الطلب",
            timestamp: new Date("2024-01-15T10:00:00"),
            updatedBy: "System"
        },
        {
            status: "processing",
            note: "جاري تجهيز الطلب",
            timestamp: new Date("2024-01-15T14:30:00"),
            updatedBy: "Admin"
        }
    ],
    createdAt: new Date("2024-01-15T10:00:00"),
    updatedAt: new Date("2024-01-15T14:30:00"),
};

export default function OrderDetailsPage() {
    const params = useParams();
    const order = MOCK_ORDER;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6 border-gray-100">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/orders">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 rounded-full">
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-bold tracking-tight text-gray-900">
                                طلب #{order.orderNumber}
                            </h2>
                            <OrderStatusBadge status={order.orderStatus} />
                        </div>
                        <p className="text-xs text-gray-500">
                            {order.createdAt.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-white border-gray-200">
                        <Printer className="mr-2 h-3.5 w-3.5" />
                        طباعة
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-white border-gray-200">
                                <Bell className="mr-2 h-3.5 w-3.5" />
                                إشعار العميل
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>إرسال إشعار للعميل</DialogTitle>
                                <DialogDescription>
                                    سيتم إرسال هذا الإشعار عبر البريد الإلكتروني وتطبيق الجوال.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">نص الرسالة</label>
                                    <Textarea placeholder="اكتب رسالتك هنا..." />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button className="w-full bg-[#1E1E2D]">إرسال الإشعار</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button size="sm" className="bg-[#1E1E2D] hover:bg-[#2a2a3f]">تحديث الحالة</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Content */}
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Items List (User Order Items) */}
                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/30">
                            <h3 className="font-semibold text-base text-gray-900">المنتجات</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex gap-4 group">
                                    <div className="h-24 w-24 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0 relative">
                                        <Image
                                            src={item.productImage}
                                            alt={item.productName}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-base text-gray-900 truncate pr-4">{item.productName}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">SKU: {item.sku}</span>
                                                </div>
                                            </div>
                                            <p className="font-bold text-base text-gray-900 whitespace-nowrap">
                                                {item.totalPrice} ر.س
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-end mt-2">
                                            <div className="text-sm text-gray-500">
                                                {item.quantity} × {item.unitPrice} ر.س
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-gray-50/30 border-t border-gray-100 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">المجموع الفرعي</span>
                                <span className="text-gray-900 font-medium">{order.subtotal} ر.س</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">التوصيل</span>
                                <span className="text-gray-900 font-medium">{order.shippingCost} ر.س</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">الضريبة (15%)</span>
                                <span className="text-gray-900 font-medium">{order.tax} ر.س</span>
                            </div>
                            <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">الإجمالي</span>
                                <span className="text-2xl font-bold text-[#1E1E2D]">{order.total} ر.س</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-3xl border border-gray-100">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/30">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-base text-gray-900">سجل النشاط</h3>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="relative border-r-2 border-gray-100 mr-2 space-y-10">
                                {order.statusHistory.map((history, index) => (
                                    <div key={index} className="relative pr-8">
                                        <span className={cn(
                                            "absolute -right-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white ring-4 ring-gray-50",
                                            index === 0 ? "bg-blue-500 ring-blue-50" : "bg-gray-300"
                                        )}></span>
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {history.note || `تغيير الحالة إلى ${history.status}`}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    بواسطة: {history.updatedBy}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium font-mono">
                                                {history.timestamp.toLocaleTimeString('ar-SA', { hour: 'numeric', minute: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="h-4 w-4 text-gray-400" />
                            <h3 className="font-semibold text-sm text-gray-900">العميل</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-base font-semibold text-gray-900">{order.customer.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">عميل منذ 2023</p>
                            </div>
                            <Separator className="bg-gray-50" />
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <a href={`mailto:${order.customer.email}`} className="hover:text-blue-600 transition-colors">{order.customer.email}</a>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <a href={`tel:${order.customer.phone}`} className="hover:text-blue-600 transition-colors" dir="ltr">{order.customer.phone}</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <h3 className="font-semibold text-sm text-gray-900">عنوان التوصيل</h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                            {order.customer.address}<br />
                            {order.customer.city}, {order.customer.postalCode}<br />
                            المملكة العربية السعودية
                        </p>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="h-4 w-4 text-gray-400" />
                            <h3 className="font-semibold text-sm text-gray-900">معلومات الدفع</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">طريقة الدفع</span>
                                <span className="font-semibold text-gray-900">
                                    {order.paymentMethod === 'card' ? 'بطاقة ائتمان' : 'دفع عند الاستلام'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">الحالة</span>
                                <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'} className="font-normal text-xs px-3 py-1">
                                    {order.paymentStatus === 'paid' ? 'تم الدفع' : 'غير مدفوع'}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className="bg-amber-50 rounded-3xl border border-amber-100 p-6">
                            <h3 className="font-semibold text-sm text-amber-800 mb-2">ملاحظات</h3>
                            <p className="text-sm text-amber-700 font-medium">{order.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
