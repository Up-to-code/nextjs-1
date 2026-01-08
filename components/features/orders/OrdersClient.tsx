"use client";

import { useState } from "react";
import { Order } from "@/types";
import { DataTable } from "@/components/shared/DataTable";
import { getOrderColumns } from "@/app/(dashboard)/orders/columns";
import { ScheduleOrderDialog } from "@/components/features/orders/ScheduleOrderDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrg } from "@/lib/stores/org-store";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";

interface OrdersClientProps {
    initialOrders: Order[];
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
    const organization = useOrg();
    const updateStatus = useMutation(api.orders.updateStatus);

    // We don't have a loading state for the mutation itself exposed easily unless we wrap it, 
    // but DataTable isLoading usually refers to fetching. 
    // Since fetching is done in parent, we can pass isLoading=false or accept it as prop if needed.
    // For now, let's assume initialOrders are already loaded.

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    const handleSchedule = (order: Order) => {
        setSelectedOrder(order);
        setIsScheduleOpen(true);
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        if (!organization?.id) return;
        try {
            await updateStatus({
                id: id as any,
                orgId: organization.id,
                status: status as any
            });
            toast.success("تم تحديث حالة الطلب بنجاح");
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء تحديث الحالة");
        }
    };

    const columns = getOrderColumns({
        onSchedule: handleSchedule,
        onUpdateStatus: handleUpdateStatus,
    });

    return (
        <>
            <DataTable
                columns={columns}
                data={initialOrders}
                emptyState={
                    <EmptyState
                        title="لا توجد طلبات حتى الآن"
                        description="ستظهر جميع طلبات العملاء هنا بمجرد استلامها."
                    />
                }
            />
            <ScheduleOrderDialog
                open={isScheduleOpen}
                onOpenChange={setIsScheduleOpen}
                order={selectedOrder}
            />
        </>
    );
}
