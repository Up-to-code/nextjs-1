"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ResponsiveContainer } from "recharts";

interface ChartWrapperProps {
    title: string;
    className?: string;
    children: React.ReactNode;
}

export function ChartWrapper({
    title,
    className,
    children,
}: ChartWrapperProps) {
    return (
        <Card className={cn("premium-card p-8 border-none overflow-hidden", className)}>
            <div className="mb-8">
                <h3 className="text-xl font-extrabold text-[#242C5A]">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">عرض البيانات والتحليلات البيانية</p>
            </div>
            <div className="w-full">
                {children}
            </div>
        </Card>
    );
}
