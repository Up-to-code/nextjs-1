"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition, useEffect, useState } from "react";

export function ProductSearch({ defaultValue = "" }: { defaultValue?: string }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        // If value hasn't changed from defaultValue (initial load), don't trigger push
        if (value === defaultValue) return;

        const timer = setTimeout(() => {
            startTransition(() => {
                const params = new URLSearchParams();
                if (value) {
                    params.set("q", value);
                }
                router.push(`?${params.toString()}`);
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [value, router, defaultValue]);

    return (
        <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
                placeholder="بحث في المنتجات..."
                className="pr-9 border-gray-200 focus-visible:ring-primary/20 rounded-xl h-10"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            {isPending && (
                <div className="absolute left-3 top-3">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            )}
        </div>
    );
}
