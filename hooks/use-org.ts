"use client";

import { useOrg as useOrgStore } from "@/lib/stores/org-store";
import { useEffect, useState } from "react";

export function useOrg() {
    // Wrap to ensure client-side consistency if needed, or just return the store
    const org = useOrgStore();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return {
        organization: org,
        isLoaded
    };
}
