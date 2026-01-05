"use client";

import { useState, useCallback, useEffect } from "react";
import { Employee } from "@/types";
import { MOCK_EMPLOYEES } from "@/services/mock-data";

export function useEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setEmployees(MOCK_EMPLOYEES);
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const addEmployee = useCallback((employee: Omit<Employee, "id" | "lastActive">) => {
        const newEmployee: Employee = {
            ...employee,
            id: Math.random().toString(36).substr(2, 9),
            lastActive: "الآن",
        };
        setEmployees((prev) => [newEmployee, ...prev]);
        return newEmployee;
    }, []);

    const updateEmployee = useCallback((id: string, data: Partial<Employee>) => {
        setEmployees((prev) =>
            prev.map((emp) => (emp.id === id ? { ...emp, ...data } : emp))
        );
    }, []);

    const deleteEmployee = useCallback((id: string) => {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }, []);

    return {
        employees,
        isLoading,
        addEmployee,
        updateEmployee,
        deleteEmployee,
    };
}
