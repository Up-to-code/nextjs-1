"use client";

import { useState } from "react";
import { Order } from "@/types";
import { DataTable } from "@/components/shared/DataTable";
import { getOrderColumns } from "@/app/(dashboard)/orders/columns";
import { ScheduleOrderDialog } from "@/components/features/orders/ScheduleOrderDialog";
import { useOrders } from "@/hooks/use-orders";

interface OrdersClientProps {
    initialOrders: Order[];
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
    const { updateOrder, isLoading } = useOrders();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    const handleSchedule = (order: Order) => {
        setSelectedOrder(order);
        setIsScheduleOpen(true);
    };

    const handleUpdateStatus = (id: string, status: string) => {
        updateOrder(id, { orderStatus: status as any });
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
                isLoading={isLoading}
            />
            <ScheduleOrderDialog
                open={isScheduleOpen}
                onOpenChange={setIsScheduleOpen}
                order={selectedOrder}
            />
        </>
    );
}
