"use client";

import { usePermission } from "@/hooks/use-permission";
import { Loader2, ShieldAlert, Building2, Link as LinkIcon, Mail, Phone, MapPin, Users, CheckCircle2, RefreshCw, AlertCircle, Plus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MembersList } from "@/components/features/organization/MembersList";
import { InviteMemberDialog } from "@/components/features/organization/InviteMemberDialog";
import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// FormField Helper Component
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

export function OrganizationContent({ hasOrg, ...props }: any) {
    // Permission check for UI states
    const { hasPermission: canManage, role: myRole } = usePermission('manageSettings');
    const { hasPermission: canViewOrders } = usePermission('viewOrders');
    const { hasPermission: canManageOrders } = usePermission('manageOrders');
    const { hasPermission: canManageProducts } = usePermission('manageProducts');

    console.log(`🏢 OrganizationContent: canManage=${canManage}, myRole=${myRole}`);

    return (
        <TooltipProvider>
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
                            {props.organization?.logo ? (
                                <img
                                    src={props.organization.logo}
                                    alt={props.organization.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Building2 className="h-8 w-8 text-white" />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-lg text-[#242C5A]">{props.organization?.name}</h3>
                                {props.userRole && (
                                    <Badge
                                        variant={props.userRole === 'owner' ? 'default' : 'secondary'}
                                        className="text-xs"
                                    >
                                        <Shield className="h-3 w-3 ml-1" />
                                        {props.userRole === 'owner' ? 'مالك' : props.userRole === 'admin' ? 'مدير' : 'عضو'}
                                    </Badge>
                                )}
                                {hasOrg && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="cursor-help mr-2 p-1 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                                                <ShieldAlert className={`h-4 w-4 ${canManage ? 'text-green-500' : 'text-gray-400'}`} />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="text-xs p-3">
                                            <div className="font-bold mb-2 border-b pb-1">صلاحياتك الحالية:</div>
                                            <ul className="space-y-1">
                                                <li className={`flex items-center gap-2 ${canViewOrders ? 'text-green-600' : 'text-gray-400'}`}>
                                                    <CheckCircle2 className="h-3 w-3" /> عرض الطلبات
                                                </li>
                                                <li className={`flex items-center gap-2 ${canManageOrders ? 'text-green-600' : 'text-gray-400'}`}>
                                                    <CheckCircle2 className="h-3 w-3" /> إدارة الطلبات
                                                </li>
                                                <li className={`flex items-center gap-2 ${canManageProducts ? 'text-green-600' : 'text-gray-400'}`}>
                                                    <CheckCircle2 className="h-3 w-3" /> إدارة المنتجات
                                                </li>
                                                <li className={`flex items-center gap-2 ${canManage ? 'text-green-600' : 'text-gray-400'}`}>
                                                    <CheckCircle2 className="h-3 w-3" /> إعدادات المنشأة
                                                </li>
                                            </ul>
                                        </TooltipContent>
                                    </Tooltip>
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
                        value={props.formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                        placeholder="اسم شركتك أو متجرك"
                        readOnly={hasOrg && !canManage}
                    />

                    <FormField
                        label="رابط الشعار (Logo)"
                        icon={LinkIcon}
                        value={props.formData.logo}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setFormData((prev: any) => ({ ...prev, logo: e.target.value }))}
                        placeholder="https://example.com/logo.png"
                        dir="ltr"
                        readOnly={hasOrg && !canManage}
                    />

                    <div className="grid gap-6 sm:grid-cols-2">
                        <FormField
                            label="البريد الإلكتروني"
                            icon={Mail}
                            value={props.formData.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
                            placeholder="contact@example.com"
                            readOnly={hasOrg && !canManage}
                        />
                        <FormField
                            label="رقم الهاتف"
                            icon={Phone}
                            value={props.formData.phone}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setFormData((prev: any) => ({ ...prev, phone: e.target.value }))}
                            placeholder="0500000000"
                            dir="ltr"
                            readOnly={hasOrg && !canManage}
                        />
                    </div>

                    <FormField
                        label="العنوان"
                        icon={MapPin}
                        value={props.formData.address}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setFormData((prev: any) => ({ ...prev, address: e.target.value }))}
                        placeholder="المدينة، الحي، الشارع"
                        readOnly={hasOrg && !canManage}
                    />

                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-500">نبذة عن المنشأة</Label>
                        <Textarea
                            value={props.formData.description}
                            onChange={(e) => props.setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                            placeholder="وصف مختصر عن نشاط المنشأة..."
                            className="min-h-[100px] bg-gray-50 border-gray-100 rounded-xl resize-none"
                            readOnly={hasOrg && !canManage}
                        />
                    </div>
                </div>

                {/* Members Section */}
                {hasOrg && props.organization?.id && (
                    <div className="pt-8 border-t border-gray-50 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                    <Users className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[#242C5A]">فريق العمل</h3>
                                    <p className="text-sm text-gray-400">
                                        أعضاء المنشأة وصلاحياتهم
                                    </p>
                                </div>
                            </div>
                            {canManage && (
                                <InviteMemberDialog onSuccess={() => props.setRefreshMembersTrigger((prev: number) => prev + 1)} />
                            )}
                        </div>

                        <MembersList organizationId={props.organization.id} refreshTrigger={props.refreshMembersTrigger} />
                    </div>
                )}

                {/* Sync Settings Section */}
                {hasOrg && props.organization && (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-[#242C5A]">مزامنة البيانات</h3>
                                <p className="text-xs text-gray-500">
                                    مزامنة تلقائية بين WorkOS و Convex
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {props.syncStatus === 'synced' && (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                )}
                                {props.isSyncing && (
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                )}
                                <Switch
                                    checked={props.autoSyncEnabled}
                                    onCheckedChange={props.setAutoSyncEnabled}
                                    disabled={!canManage}
                                />
                            </div>
                        </div>

                        {/* Sync Status */}
                        {props.syncStatus && (
                            <div className="text-xs text-gray-600 space-y-1">
                                {props.syncStatus === 'synced' ? (
                                    <div className="flex items-center gap-2 text-green-700">
                                        <CheckCircle2 className="h-3 w-3" />
                                        <span>البيانات متزامنة</span>
                                    </div>
                                ) : props.syncStatus === 'pending' ? (
                                    <div className="flex items-center gap-2 text-blue-700">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span>جاري المزامنة...</span>
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {/* Manual Sync Button */}
                        <Button
                            onClick={props.handleManualSync}
                            disabled={props.isSyncing || !canManage}
                            variant="outline"
                            size="sm"
                            className="w-full h-9 text-xs"
                        >
                            {props.isSyncing ? (
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
                {!hasOrg && !props.canCreate && (
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
                {(!hasOrg || canManage) && (
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={props.handleSave}
                            disabled={props.isPending || (!hasOrg && !props.canCreate)}
                            className="h-12 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {props.isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
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
                )}
            </div>
        </TooltipProvider>
    );
}
