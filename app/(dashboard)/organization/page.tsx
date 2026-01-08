"use client";

import { useState, useEffect, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useOrgStore, useOrg, useHasOrg, useOrgLoading } from "@/lib/stores/org-store";
import {
    createOrganizationAction,
    updateOrganizationAction,
    canCreateOrganization,
    getUserOrganizationWithRole,
    manualSyncOrganization,
    checkAndSyncConvexStatus,
} from "@/app/actions/organization";
import { toast } from "sonner";
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { OrganizationContent } from "@/components/features/organization/OrganizationContent";

export default function OrganizationPage() {
    const organization = useOrg();
    const hasOrg = useHasOrg();
    const isLoading = useOrgLoading();
    const { setOrganization, updateOrganization } = useOrgStore();
    const [isPending, startTransition] = useTransition();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [canCreate, setCanCreate] = useState<boolean>(true);
    const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true); // Default enabled
    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | null>(null);
    const [refreshMembersTrigger, setRefreshMembersTrigger] = useState(0);

    // Convex sync mutation
    const syncOrg = useMutation(api.organizations.sync);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        logo: '',
    });

    // Check if user can create organization and get role
    useEffect(() => {
        const checkOrganizationStatus = async () => {
            if (!hasOrg) {
                // Check if user can create (doesn't have one yet)
                const check = await canCreateOrganization();
                setCanCreate(check.canCreate);
                if (!check.canCreate && check.error) {
                    console.log('Cannot create organization:', check.error);
                }
            } else {
                // Get user's role in organization
                const result = await getUserOrganizationWithRole();
                if (result.success && result.organization) {
                    const org = result.organization;
                    // Update store with full metadata
                    setOrganization({
                        id: org.id,
                        name: org.name,
                        email: org.metadata?.email,
                        phone: org.metadata?.phone,
                        address: org.metadata?.address,
                        description: org.metadata?.description,
                        logo: org.metadata?.logo,
                    });
                }

                if (result.success && result.role) {
                    setUserRole(result.role);

                    // Trigger self-healing sync to ensure Convex permissions are up to date
                    if (result.organization?.id) {
                        checkAndSyncConvexStatus(result.organization.id).then(res => {
                            if (res.success) console.log("✅ Convex Sync verified");
                        });
                    }
                }
            }
        };

        checkOrganizationStatus();
    }, [hasOrg]);

    // Sync form with org data
    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name || '',
                email: organization.email || '',
                phone: organization.phone || '',
                address: organization.address || '',
                description: organization.description || '',
                logo: organization.logo || '',
            });
        }
    }, [organization]);

    // Auto-sync when autoSyncEnabled is true and organization changes
    useEffect(() => {
        if (autoSyncEnabled && hasOrg && organization?.id && !isPending && !isSyncing) {
            // Auto-sync after a short delay to avoid too frequent syncs
            const timer = setTimeout(() => {
                handleAutoSync();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [autoSyncEnabled, hasOrg, organization?.id, formData.name, formData.email]);

    // Manual sync function
    const handleManualSync = async () => {
        if (!hasOrg || !organization?.id) {
            toast.error("لا توجد منشأة للمزامنة");
            return;
        }

        if (!organization.id.startsWith('org_')) {
            toast.error("يرجى حفظ التغييرات أولاً لإنشاء المنشأة");
            return;
        }

        setIsSyncing(true);
        setSyncStatus('pending');

        try {
            const result = await manualSyncOrganization(organization.id);

            if (result.success && result.data) {
                // Sync to Convex
                await syncOrg({
                    workosOrgId: result.data.workosOrgId,
                    name: result.data.name,
                    email: result.data.email,
                    phone: result.data.phone,
                    address: result.data.address,
                    description: result.data.description,
                });

                // Update local store
                updateOrganization({
                    name: result.data.name,
                    email: result.data.email,
                    phone: result.data.phone,
                    address: result.data.address,
                    description: result.data.description,
                });

                setSyncStatus('synced');

                // Also trigger permission/membership sync (Self-healing)
                toast.promise(checkAndSyncConvexStatus(organization.id), {
                    loading: 'جاري تحديث الصلاحيات...',
                    success: 'تم تحديث الصلاحيات والأعضاء',
                    error: 'فشل تحديث الصلاحيات'
                });

                toast.success("تمت المزامنة بنجاح");
            } else {
                setSyncStatus(null);
                toast.error(result.error || "فشلت المزامنة");
            }
        } catch (error) {
            console.error("Sync error:", error);
            setSyncStatus(null);
            toast.error("حدث خطأ أثناء المزامنة");
        } finally {
            setIsSyncing(false);
        }
    };

    // Auto-sync function (called automatically when enabled)
    const handleAutoSync = async () => {
        if (!hasOrg || !organization?.id || isSyncing) return;

        // Don't auto-sync local IDs
        if (!organization.id.startsWith('org_')) return;

        setIsSyncing(true);

        try {
            const result = await manualSyncOrganization(organization.id);

            if (result.success && result.data) {
                // Sync to Convex silently (non-blocking)
                syncOrg({
                    workosOrgId: result.data.workosOrgId,
                    name: result.data.name,
                    email: result.data.email,
                    phone: result.data.phone,
                    address: result.data.address,
                    description: result.data.description,
                }).catch(err => {
                    console.error("Auto-sync failed (non-blocking):", err);
                });

                setSyncStatus('synced');
            }
        } catch (error) {
            console.error("Auto-sync error:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast.error("يرجى إدخال اسم المنشأة");
            return;
        }

        // Check if user can create (if trying to create new)
        if (!hasOrg && !canCreate) {
            toast.error("لديك منشأة بالفعل. يمكنك إنشاء منشأة واحدة فقط.");
            return;
        }

        // Optimistic update - update UI immediately
        const optimisticData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            description: formData.description,
        };

        if (hasOrg && organization) {
            // Optimistic update for existing org
            updateOrganization(optimisticData);
        }

        startTransition(async () => {
            console.log("🚀 Starting Organization Save...", { hasOrg, id: organization?.id });

            try {
                if (hasOrg && organization) {
                    // Update existing org in WorkOS
                    console.log("📝 Mode: Update Existing Org", organization.id);
                    const result = await updateOrganizationAction(organization.id, {
                        name: formData.name,
                        metadata: {
                            email: formData.email,
                            phone: formData.phone,
                            address: formData.address,
                            description: formData.description,
                        },
                    });
                    console.log("📡 WorkOS Update Response:", result);

                    if (result.success && (result as any).organization) {
                        const org = (result as any).organization;

                        // Update local store with WorkOS response (critical: updates ID if transitioned from local)
                        setOrganization({
                            id: org.id,
                            name: org.name,
                            email: org.metadata?.email,
                            phone: org.metadata?.phone,
                            address: org.metadata?.address,
                            description: org.metadata?.description,
                        });

                        // Sync to Convex if auto-sync enabled
                        if (autoSyncEnabled) {
                            console.log("🔄 Syncing to Convex DB...");
                            syncOrg({
                                workosOrgId: org.id,
                                name: org.name,
                                email: org.metadata?.email,
                                phone: org.metadata?.phone,
                                address: org.metadata?.address,
                                description: org.metadata?.description,
                            }).then(() => {
                                console.log("✅ Convex Sync Complete");
                            }).catch(err => {
                                console.error("❌ Convex sync failed (non-blocking):", err);
                                // Don't show error to user, sync can happen later
                            });
                        }

                        toast.success("تم تحديث بيانات المنشأة");
                    } else {
                        console.error("❌ Update Failed:", result.error);
                        // Revert optimistic update on error
                        if (organization) {
                            updateOrganization({
                                name: organization.name,
                                email: organization.email,
                                phone: organization.phone,
                                address: organization.address,
                                description: organization.description,
                            });
                        }
                        toast.error(result.error || "فشل في تحديث المنشأة");
                    }
                } else {
                    // Create new org in WorkOS
                    const result = await createOrganizationAction({
                        name: formData.name,
                        metadata: {
                            email: formData.email,
                            phone: formData.phone,
                            address: formData.address,
                            description: formData.description,
                        },
                    });

                    if (result.success && (result as any).organization) {
                        const org = (result as any).organization;

                        // Set in local store
                        setOrganization({
                            id: org.id,
                            name: org.name,
                            email: org.metadata?.email,
                            phone: org.metadata?.phone,
                            address: org.metadata?.address,
                            description: org.metadata?.description,
                        });

                        // Sync to Convex if auto-sync enabled
                        if (autoSyncEnabled) {
                            syncOrg({
                                workosOrgId: org.id,
                                name: org.name,
                                email: org.metadata?.email,
                                phone: org.metadata?.phone,
                                address: org.metadata?.address,
                                description: org.metadata?.description,
                            }).catch(err => {
                                console.error("❌ Convex sync failed (non-blocking):", err);
                                // Don't show error to user, sync can happen later
                            });
                        }

                        toast.success("تم إنشاء المنشأة بنجاح");
                    } else {
                        console.error("❌ Create Failed:", result.error);
                        toast.error(result.error || "فشل في إنشاء المنشأة");
                    }
                }
            } catch (error) {
                console.error("Error saving organization:", error);
                // Revert optimistic update on error
                if (hasOrg && organization) {
                    updateOrganization({
                        name: organization.name,
                        email: organization.email,
                        phone: organization.phone,
                        address: organization.address,
                        description: organization.description,
                    });
                }
                toast.error("حدث خطأ أثناء الحفظ");
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4" dir="rtl">
            {/* Header */}
            <div className="mb-10 text-right">
                <h1 className="text-3xl font-black text-[#242C5A]">
                    {hasOrg ? "إعدادات المنشأة" : "إنشاء منشأة جديدة"}
                </h1>
                <p className="text-gray-400 font-medium mt-2">
                    {hasOrg
                        ? "تحكم ببيانات ومعلومات منشأتك"
                        : "أضف بيانات منشأتك لتظهر للعملاء"}
                </p>
            </div>

            <OrganizationContent
                hasOrg={hasOrg}
                organization={organization}
                formData={formData}
                setFormData={setFormData}
                userRole={userRole}
                canCreate={canCreate}
                isPending={isPending}
                handleSave={handleSave}
                handleManualSync={handleManualSync}
                autoSyncEnabled={autoSyncEnabled}
                setAutoSyncEnabled={setAutoSyncEnabled}
                isSyncing={isSyncing}
                syncStatus={syncStatus}
                refreshMembersTrigger={refreshMembersTrigger}
                setRefreshMembersTrigger={setRefreshMembersTrigger}
            />
        </div>
    );
}
