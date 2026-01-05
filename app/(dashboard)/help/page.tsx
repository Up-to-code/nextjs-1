"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, MessageCircle, Phone } from "lucide-react";

export default function HelpPage() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">كيف يمكننا مساعدتك؟</h2>
                <p className="text-gray-500">ابحث عن الإجابات في الأسئلة الشائعة أو تواصل معنا مباشرة</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <Card className="rounded-3xl border border-gray-100">
                        <CardHeader>
                            <CardTitle>الأسئلة الشائعة</CardTitle>
                            <CardDescription>إجابات سريعة لأكثر الأسئلة تكراراً</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>كيف يمكنني إضافة منتج جديد؟</AccordionTrigger>
                                    <AccordionContent>
                                        يمكنك إضافة منتج جديد بالذهاب إلى صفحة "المنتجات" والضغط على زر "إضافة منتج" في أعلى الصفحة.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>كيف أتابع حالة الطلبات؟</AccordionTrigger>
                                    <AccordionContent>
                                        من لوحة التحكم الرئيسية أو صفحة "الطلبات"، يمكنك رؤية قائمة بجميع الطلبات وحالاتها (قيد الانتظار، جاري الشحن، مكتمل).
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>كيف أغير إعدادات الدفع؟</AccordionTrigger>
                                    <AccordionContent>
                                        اذهب إلى صفحة "الإعدادات" ثم اختر تبويب "المدفوعات" لتعديل طرق الدفع المفعلة وحساباتك البنكية.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border border-gray-100">
                        <CardHeader>
                            <CardTitle>قنوات التواصل</CardTitle>
                            <CardDescription>نحن هنا لمساعدتك على مدار الساعة</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                                <Mail className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="font-medium text-gray-900">البريد الإلكتروني</p>
                                    <p className="text-sm text-gray-500">support@houses.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                                <Phone className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="font-medium text-gray-900">رقم الهاتف</p>
                                    <p className="text-sm text-gray-500" dir="ltr">+966 50 000 0000</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                                <MessageCircle className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="font-medium text-gray-900">المحادثة المباشرة</p>
                                    <p className="text-sm text-gray-500">متوفر من 9 ص - 5 م</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-3xl border-gray-100">
                        <CardHeader>
                            <CardTitle>أرسل لنا رسالة</CardTitle>
                            <CardDescription>سيتم الرد عليك في أقرب وقت ممكن</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="subject">الموضوع</Label>
                                    <Input id="subject" placeholder="بخصوص ماذا تتواصل معنا؟" className="bg-gray-50 border-gray-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">الرسالة</Label>
                                    <Textarea id="message" placeholder="اكتب تفاصيل استفسارك هنا..." className="min-h-[150px] bg-gray-50 border-gray-200" />
                                </div>
                                <Button className="w-full bg-[#1E1E2D] hover:bg-[#2a2a3f]">إرسال الرسالة</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
