"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Edit, Trash, Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEmployees } from "@/hooks/use-employees";
import { AddEmployeeDialog } from "@/components/features/employees/AddEmployeeDialog";
import { Employee } from "@/types";
import { toast } from "sonner";

export default function EmployeesPage() {
    const { employees, isLoading, deleteEmployee } = useEmployees();
    const [isAddOpen, setIsAddOpen] = useState(false);

    const columns: ColumnDef<Employee>[] = [
        {
            accessorKey: "name",
            header: "الموظف",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-gray-100">
                            <AvatarImage src={`/avatars/${row.original.id}.png`} />
                            <AvatarFallback>{row.original.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium text-gray-900">{row.getValue("name")}</div>
                            <div className="text-xs text-gray-500">{row.original.email}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "role",
            header: "الدور",
            cell: ({ row }) => {
                const role = row.getValue("role") as string;
                const config: Record<string, { label: string; icon: any; color: string }> = {
                    admin: { label: "مدير", icon: ShieldCheck, color: "text-blue-600" },
                    editor: { label: "محرر", icon: Shield, color: "text-purple-600" },
                    viewer: { label: "مشاهد", icon: ShieldAlert, color: "text-gray-600" },
                };
                const { label, icon: Icon, color } = config[role] || { label: role, icon: Shield, color: "text-gray-600" };

                return (
                    <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${color}`} />
                        <span className="text-sm text-gray-700 font-medium">
                            {label}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "الحالة",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <Badge variant={status === "active" ? "default" : "secondary"} className="font-normal">
                        {status === "active" ? "نشط" : "غير نشط"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "lastActive",
            header: "آخر ظهور",
            cell: ({ row }) => <div className="text-sm text-gray-500">{row.getValue("lastActive")}</div>,
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <DropdownMenu dir="rtl">
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                            <DropdownMenuItem className="cursor-pointer">
                                <Edit className="ml-2 h-4 w-4" />
                                تعديل
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-700 cursor-pointer"
                                onClick={() => {
                                    deleteEmployee(employee.id);
                                    toast.success("تم حذف الموظف");
                                }}
                            >
                                <Trash className="ml-2 h-4 w-4" />
                                حذف
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">الموظفين</h2>
                    <p className="text-sm text-gray-500 mt-1">إدارة فريق العمل والصلاحيات</p>
                </div>
                <Button onClick={() => setIsAddOpen(true)} className="bg-[#1E1E2D] hover:bg-[#2a2a3f]">
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة موظف
                </Button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={employees}
                    searchKey="name"
                    isLoading={isLoading}
                />
            </div>

            <AddEmployeeDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
        </div>
    );
}
