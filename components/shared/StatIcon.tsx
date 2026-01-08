import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatIconProps {
    icon: LucideIcon;
    className?: string;
}

export function StatIcon({ icon: Icon, className }: StatIconProps) {
    return (
        <div className={cn("h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-primary transition-all duration-300", className)}>
            <Icon className="h-6 w-6" />
        </div>
    );
}
