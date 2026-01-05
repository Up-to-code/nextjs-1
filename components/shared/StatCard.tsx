import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        label: string;
        positive?: boolean;
    };
    className?: string;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    className,
}: StatCardProps) {
    return (
        <Card className={cn("premium-card p-6 h-full border-gray-100 bg-white rounded-2xl", className)}>
            <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-primary transition-all duration-300">
                    <Icon className="h-6 w-6" />
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold",
                        trend.positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                        {trend.positive ? "+" : "-"}{trend.value}%
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground opacity-80">{title}</p>
                <h3 className="text-3xl font-extrabold tracking-tight text-[#242C5A]">{value}</h3>
                {description && !trend && (
                    <p className="text-xs text-muted-foreground mt-2">{description}</p>
                )}
                {trend && (
                    <p className="text-xs text-muted-foreground mt-2 opacity-60 font-medium">{trend.label}</p>
                )}
            </div>
        </Card>
    );
}
