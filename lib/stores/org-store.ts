import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// WorkOS Organization type
export interface Organization {
    id: string;
    name: string;
    // Extended fields stored locally
    email?: string;
    phone?: string;
    address?: string;
    description?: string;
    logo?: string | null;
}

interface OrgState {
    organization: Organization | null;
    isLoading: boolean;

    // Set org from WorkOS session
    setOrganization: (org: Organization | null) => void;

    // Update local extended fields
    updateOrganization: (updates: Partial<Organization>) => void;

    setLoading: (loading: boolean) => void;
    clearOrganization: () => void;
}

export const useOrgStore = create<OrgState>()(
    persist(
        (set) => ({
            organization: null,
            isLoading: true,

            setOrganization: (org) => set((state) => ({
                // Merge with existing local data if same org
                organization: org ? {
                    ...state.organization,
                    ...org,
                } : null,
                isLoading: false,
            })),

            updateOrganization: (updates) => set((state) => ({
                organization: state.organization
                    ? { ...state.organization, ...updates }
                    : null
            })),

            setLoading: (loading) => set({ isLoading: loading }),

            clearOrganization: () => set({ organization: null, isLoading: false }),
        }),
        {
            name: 'org-storage',
            partialize: (state) => ({ organization: state.organization }),
        }
    )
);

// Selectors
export const useOrg = () => useOrgStore((state) => state.organization);
export const useHasOrg = () => useOrgStore((state) => !!state.organization);
export const useOrgLoading = () => useOrgStore((state) => state.isLoading);
