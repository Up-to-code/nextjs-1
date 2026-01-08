"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface VariantOption {
    type: string;
    values: string[];
}

interface Variant {
    id: string;
    options: { name: string; value: string }[];
    price: number;
    stock: number;
    sku: string;
}

interface ProductVariantsProps {
    options: VariantOption[];
    variants: Variant[];
    basePrice: number;
    onOptionsChange: (options: VariantOption[]) => void;
    onVariantsChange: (variants: Variant[]) => void;
}

export function ProductVariants({
    options,
    variants,
    basePrice,
    onOptionsChange,
    onVariantsChange,
}: ProductVariantsProps) {
    const [newOptionType, setNewOptionType] = useState("");
    const [newOptionValue, setNewOptionValue] = useState("");
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

    // Add a new Option Type (e.g. "Size")
    const addOptionType = () => {
        if (!newOptionType.trim()) return;
        const newOptions = [...options, { type: newOptionType, values: [] }];
        onOptionsChange(newOptions);
        setNewOptionType("");
    };

    // Remove an Option Type
    const removeOptionType = (index: number) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        onOptionsChange(newOptions);
    };

    // Add a value to an Option Type (e.g. "Small" to "Size")
    const addOptionValue = (index: number, value: string) => {
        if (!value.trim()) return;
        const newOptions = [...options];
        if (!newOptions[index].values.includes(value)) {
            newOptions[index].values.push(value);
            onOptionsChange(newOptions);
        }
    };

    // Remove a value from an Option Type
    const removeOptionValue = (optionIndex: number, valueIndex: number) => {
        const newOptions = [...options];
        newOptions[optionIndex].values.splice(valueIndex, 1);
        onOptionsChange(newOptions);
    };

    // Generate Variants based on Options
    useEffect(() => {
        if (options.length === 0 || options.some(o => o.values.length === 0)) {
            // Should likely clear variants or keep existing if safe? 
            // For now, if options change invalidly, maybe we pause.
            // But let's implementing generation logic.
            return;
        }

        // Cartesian product of arrays
        const cartesian = (...a: string[][]) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())), [[]] as string[][]);

        const valueArrays = options.map(o => o.values);
        // Only generate if all defined options have at least one value
        if (valueArrays.some(arr => arr.length === 0)) return;

        const combinations = cartesian(...valueArrays);

        const newVariants: Variant[] = combinations.map((combo) => {
            const variantOptions = combo.map((val, idx) => ({
                name: options[idx].type,
                value: val
            }));

            const variantId = variantOptions.map(o => o.value).join("-");

            // Check if variant already exists to preserve its data
            const existing = variants.find(v =>
                v.options.length === variantOptions.length &&
                v.options.every((o, i) => o.name === variantOptions[i].name && o.value === variantOptions[i].value)
            );

            return existing || {
                id: variantId,
                options: variantOptions,
                price: basePrice, // Default to base price
                stock: 0,
                sku: "",
            };
        });

        // Only update if dimensions changed effectively (simple check)
        // This useEffect might cause loop if not careful. 
        // Better trigger generation on Option Value changes directly? 
        // Let's assume onVariantsChange is stable or handled by parent.
        // Actually, preventing infinite loop is crucial.
        // We will simple compare lengths or IDs for now.
        const currentIds = variants.map(v => v.id).sort().join(",");
        const newIds = newVariants.map(v => v.id).sort().join(",");

        if (currentIds !== newIds) {
            onVariantsChange(newVariants);
        }

    }, [options, basePrice]); // Dependencies: options change triggers regen. variants in dep array would loop.

    const updateVariant = (index: number, field: keyof Variant, value: any) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        onVariantsChange(newVariants);
    };

    return (
        <div className="space-y-6">
            {/* Options Definition */}
            <div className="space-y-4">
                <Label>خيارات المنتج</Label>

                {options.map((option, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-700">{option.type}</span>
                            <Button variant="ghost" size="sm" onClick={() => removeOptionType(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {option.values.map((val, vIndex) => (
                                <Badge key={vIndex} variant="secondary" className="px-3 py-1 bg-white border border-gray-200 text-gray-700 gap-2">
                                    {val}
                                    <X
                                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                                        onClick={() => removeOptionValue(index, vIndex)}
                                    />
                                </Badge>
                            ))}
                            <div className="flex items-center gap-2 max-w-[150px]">
                                <Input
                                    className="h-7 text-xs bg-white"
                                    placeholder="قيمة جديدة..."
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addOptionValue(index, e.currentTarget.value);
                                            e.currentTarget.value = "";
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex gap-2">
                    <Input
                        placeholder="اسم الخيار (مثال: الحجم، اللون)"
                        value={newOptionType}
                        onChange={(e) => setNewOptionType(e.target.value)}
                        className="max-w-[200px]"
                    />
                    <Button type="button" onClick={addOptionType} variant="outline">
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة خيار
                    </Button>
                </div>
            </div>

            {/* Generated Variants Table */}
            {variants.length > 0 && (
                <div className="space-y-2">
                    <Label>المتغيرات ({variants.length})</Label>
                    <div className="border rounded-xl overflow-hidden bg-white">
                        <Table dir="rtl">
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="text-right">المتغير</TableHead>
                                    <TableHead className="text-right">السعر</TableHead>
                                    <TableHead className="text-right">المخزون</TableHead>
                                    <TableHead className="text-right">SKU</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {variants.map((variant, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            {variant.options.map(o => o.value).join(" / ")}
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                className="w-24 h-8"
                                                value={variant.price}
                                                onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                className="w-20 h-8"
                                                value={variant.stock}
                                                onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value))}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                className="w-32 h-8"
                                                value={variant.sku || ""}
                                                onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                                placeholder="اختياري"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    );
}
