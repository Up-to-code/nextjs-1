import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
    status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "delivered":
                return { label: "تم التوصيل", variant: "default" as const };
            case "processing":
                return { label: "قيد التنفيذ", variant: "secondary" as const };
            case "cancelled":
                return { label: "ملغي", variant: "destructive" as const };
            default:
                return { label: status, variant: "outline" as const };
        }
    };

    const config = getStatusConfig(status);

    return (
        <Badge variant={config.variant} className="capitalize font-normal px-2 py-0.5">
            {config.label}
        </Badge>
    );
}
