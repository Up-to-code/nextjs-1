"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Shield, MoreHorizontal, Check, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EditMemberDialog } from "./EditMemberDialog";
import { usePermission } from "@/hooks/use-permission";
import { useMembers } from "@/hooks/queries/use-members";

interface MembersListProps {
    organizationId: string;
    // refreshTrigger removed as it's handled by reactive hook
}

export function MembersList({ organizationId }: MembersListProps) {
    const { hasPermission: canManage, role: myRole } = usePermission('manageSettings');
    console.log(`👥 MembersList: canManage=${canManage}, myRole=${myRole}`);
    const { members, isLoading } = useMembers(); // Use the new hook
    // const [members, setMembers] = useState<any[]>([]); // Data moved to hook
    // const [isLoading, setIsLoading] = useState(true); // Loading state moved to hook
    const [editingMember, setEditingMember] = useState<any>(null);
    const [editOpen, setEditOpen] = useState(false);

    // Removed fetchMembers function and useEffect as data is now reactive via Convex hook

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
        );
    }

    const PermissionIcon = ({ has }: { has: boolean }) => (
        has ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-red-300" />
    );

    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow>
                        <TableHead className="text-right">العضو</TableHead>
                        <TableHead className="text-right">الدور</TableHead>
                        <TableHead className="text-center text-xs">عرض الطلبات</TableHead>
                        <TableHead className="text-center text-xs">إدارة الطلبات</TableHead>
                        <TableHead className="text-center text-xs">إدارة المنتجات</TableHead>
                        <TableHead className="text-center text-xs">الإعدادات</TableHead>
                        {canManage && <TableHead className="w-[50px]"></TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.map((member: any) => (
                        <TableRow key={member._id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={member.user?.avatar} />
                                        <AvatarFallback>{member.user?.name?.substring(0, 2) || "U"}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium text-sm text-[#242C5A]">
                                            {member.user?.name || "مستخدم"}
                                        </div>
                                        <div className="text-xs text-gray-500">{member.user?.email || "No Email"}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1">
                                    {member.role === 'owner' && <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-0 text-[10px]">المالك</Badge>}
                                    {member.role === 'admin' && <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-0 text-[10px]">مدير</Badge>}
                                    {member.role === 'member' && <Badge variant="secondary" className="text-[10px]">موظف</Badge>}
                                </div>
                            </TableCell>

                            {/* Permissions Columns */}
                            <TableCell className="text-center">
                                <div className="flex justify-center">
                                    <PermissionIcon has={(member.role !== 'member') || !!member.permissions?.viewOrders} />
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex justify-center">
                                    <PermissionIcon has={(member.role !== 'member') || !!member.permissions?.manageOrders} />
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex justify-center">
                                    <PermissionIcon has={(member.role !== 'member') || !!member.permissions?.manageProducts} />
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex justify-center">
                                    <PermissionIcon has={(member.role !== 'member') || !!member.permissions?.manageSettings} />
                                </div>
                            </TableCell>

                            {canManage && (
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setEditingMember(member);
                                                    setEditOpen(true);
                                                }}
                                            >
                                                تعديل الصلاحيات
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600 focus:text-red-700">
                                                إزالة العضو
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                    {members.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={canManage ? 7 : 6} className="h-24 text-center text-gray-500">
                                لا يوجد أعضاء في هذه المنشأة
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <EditMemberDialog
                member={editingMember}
                open={editOpen}
                onOpenChange={(open: boolean) => {
                    setEditOpen(open);
                    if (!open) setEditingMember(null);
                }}
                onSuccess={() => {
                    // fetchMembers(); // No need to refetch, Convex is reactive
                    setEditOpen(false);
                }}
            />
        </div>
    );
}
