"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, MapPin, Phone, Mail, Loader2, Plus, Shield, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { useOrgStore, useOrg, useHasOrg, useOrgLoading } from "@/lib/stores/org-store";
import {
    createOrganizationAction,
    updateOrganizationAction,
    canCreateOrganization,
    getUserOrganizationWithRole,
    manualSyncOrganization,
} from "@/app/actions/organization";
import { toast } from "sonner";
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Link as LinkIcon } from "lucide-react";

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

            <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-8">
                {/* Logo/Status section */}
                {!hasOrg ? (
                    <div className="flex flex-col items-center gap-4 pb-8 border-b border-gray-50">
                        <div className="h-24 w-24 bg-slate-100 rounded-2xl flex items-center justify-center">
                            <Building2 className="h-10 w-10 text-slate-400" />
                        </div>
                        <p className="text-sm text-gray-400">لم تقم بإنشاء منشأة بعد</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
                        <div className="h-20 w-20 bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden">
                            {organization?.logo ? (
                                <img
                                    src={organization.logo}
                                    alt={organization.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Building2 className="h-8 w-8 text-white" />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-lg text-[#242C5A]">{organization?.name}</h3>
                                {userRole && (
                                    <Badge
                                        variant={userRole === 'owner' ? 'default' : 'secondary'}
                                        className="text-xs"
                                    >
                                        <Shield className="h-3 w-3 ml-1" />
                                        {userRole === 'owner' ? 'مالك' : userRole === 'admin' ? 'مدير' : 'عضو'}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                                    مفعّلة
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="space-y-6">
                    <FormField
                        label="اسم المنشأة"
                        icon={Building2}
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="اسم شركتك أو متجرك"
                    />

                    <FormField
                        label="رابط الشعار (Logo)"
                        icon={LinkIcon}
                        value={formData.logo}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                        placeholder="https://example.com/logo.png"
                        dir="ltr"
                    />

                    <div className="grid gap-6 sm:grid-cols-2">
                        <FormField
                            label="البريد الإلكتروني"
                            icon={Mail}
                            value={formData.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="contact@example.com"
                        />
                        <FormField
                            label="رقم الهاتف"
                            icon={Phone}
                            value={formData.phone}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="0500000000"
                            dir="ltr"
                        />
                    </div>

                    <FormField
                        label="العنوان"
                        icon={MapPin}
                        value={formData.address}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="المدينة، الحي، الشارع"
                    />

                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-500">نبذة عن المنشأة</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="وصف مختصر عن نشاط المنشأة..."
                            className="min-h-[100px] bg-gray-50 border-gray-100 rounded-xl resize-none"
                        />
                    </div>
                </div>

                {/* Sync Settings Section */}
                {hasOrg && organization && (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-[#242C5A]">مزامنة البيانات</h3>
                                <p className="text-xs text-gray-500">
                                    مزامنة تلقائية بين WorkOS و Convex
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {syncStatus === 'synced' && (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                )}
                                {isSyncing && (
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                )}
                                <Switch
                                    checked={autoSyncEnabled}
                                    onCheckedChange={setAutoSyncEnabled}
                                />
                            </div>
                        </div>

                        {/* Sync Status */}
                        {syncStatus && (
                            <div className="text-xs text-gray-600 space-y-1">
                                {syncStatus === 'synced' ? (
                                    <div className="flex items-center gap-2 text-green-700">
                                        <CheckCircle2 className="h-3 w-3" />
                                        <span>البيانات متزامنة</span>
                                    </div>
                                ) : syncStatus === 'pending' ? (
                                    <div className="flex items-center gap-2 text-blue-700">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span>جاري المزامنة...</span>
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {/* Manual Sync Button */}
                        <Button
                            onClick={handleManualSync}
                            disabled={isSyncing}
                            variant="outline"
                            size="sm"
                            className="w-full h-9 text-xs"
                        >
                            {isSyncing ? (
                                <>
                                    <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                                    جاري المزامنة...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="ml-2 h-3 w-3" />
                                    مزامنة يدوية الآن
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {/* Info Message for One Org Limit */}
                {!hasOrg && !canCreate && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-yellow-900">
                                لديك منشأة بالفعل
                            </p>
                            <p className="text-xs text-yellow-700 mt-1">
                                يمكنك إنشاء منشأة واحدة فقط. يرجى تحديث المنشأة الحالية بدلاً من إنشاء واحدة جديدة.
                            </p>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={isPending || (!hasOrg && !canCreate)}
                        className="h-12 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        {hasOrg ? (
                            "حفظ التغييرات"
                        ) : (
                            <>
                                <Plus className="ml-2 h-4 w-4" />
                                إنشاء المنشأة
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function FormField({ label, icon: Icon, dir, ...props }: any) {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-500">{label}</Label>
            <div className="relative">
                <Icon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                <Input
                    {...props}
                    dir={dir}
                    className="h-12 pr-12 bg-gray-50 border-gray-100 rounded-xl font-medium text-[#242C5A]"
                />
            </div>
        </div>
    );
}
