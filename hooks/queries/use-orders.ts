"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrg } from "@/lib/stores/org-store";

export function useOrders() {
    const organization = useOrg();

    const ordersValue = useQuery(api.orders.list, organization?.id ? { orgId: organization.id } : "skip");

    const isLoading = ordersValue === undefined;

    const orders: any[] = ordersValue?.map((o: any) => ({
        id: o._id,
        orderNumber: o.orderNumber || o._id.substring(0, 8).toUpperCase(),
        customerId: o.customerId,
        customer: {
            id: o.customerId,
            name: o.customerName || "Unknown",
            email: "",
            phone: "",
            address: "",
            city: "",
        },
        items: o.items?.map((item: any) => ({
            productId: item.productId,
            productName: item.productName || "Product",
            productImage: item.productImage || "",
            sku: "", // Placeholder
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
        })) || [],
        subtotal: o.subtotal || o.totalAmount || 0,
        shippingCost: 0,
        tax: 0,
        discount: 0,
        total: o.total || o.totalAmount || 0,
        paymentMethod: "cash",
        paymentStatus: "paid",
        orderStatus: o.status,
        statusHistory: [],
        createdAt: new Date(o.createdAt || o._creationTime),
        updatedAt: new Date(o.createdAt || o._creationTime),
    })) || [];

    const updateOrderMutation = useMutation(api.orders.update);
    const updateOrder = async (id: string, updates: any) => {
        if (!organization?.id) return;
        // Convert Date objects to timestamps if needed
        const payload: any = { id: id as any, orgId: organization.id, ...updates };
        if (updates.scheduledDate instanceof Date) {
            payload.scheduledDate = updates.scheduledDate.getTime();
        }
        await updateOrderMutation(payload);
    };

    return {
        orders,
        isLoading,
        updateOrder
    };
}
