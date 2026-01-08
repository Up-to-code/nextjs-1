"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useOrders } from "@/hooks/queries/use-orders";
import { Order } from "@/types";
import { toast } from "sonner";

interface ScheduleOrderDialogProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ScheduleOrderDialog({ order, open, onOpenChange }: ScheduleOrderDialogProps) {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const { updateOrder } = useOrders();

    useEffect(() => {
        if (order?.scheduledDate) {
            setDate(new Date(order.scheduledDate));
        } else {
            setDate(undefined);
        }
    }, [order]);

    const handleSchedule = async () => {
        if (!order || !date) return;

        try {
            await updateOrder(order.id, {
                scheduledDate: date,
                orderStatus: "processing" // Automatically move to processing when scheduled
            });
            onOpenChange(false);
        } catch (error) {
            toast.error("حدث خطأ أثناء جدولة الطلب");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-right">جدولة الطلب</DialogTitle>
                    <DialogDescription className="text-right">
                        اختر تاريخ التوصيل المتوقع لهذا الطلب. سيتم تحديث حالة الطلب إلى "قيد التنفيذ".
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center py-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-right font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="ml-2 h-4 w-4" />
                                {date ? format(date, "PPP", { locale: arSA }) : <span>اختر التاريخ</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        onClick={handleSchedule}
                        disabled={!date}
                        className="bg-[#1E1E2D] hover:bg-[#2a2a3f]"
                    >
                        تأكيد الجدولة
                    </Button>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        إلغاء
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
