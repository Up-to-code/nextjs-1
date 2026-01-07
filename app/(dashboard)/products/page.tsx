import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "@/components/features/products/ProductColumns";
import { MOCK_PRODUCTS } from "@/services/mock-data";
import { ProductSearch } from "@/components/features/products/ProductSearch";

interface ProductsPageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const { q } = await searchParams;
    const query = q || "";

    const filteredProducts = MOCK_PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.sku.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">المنتجات</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        إدارة منتجاتك، تتبع المخزون، وتحديث الأسعار
                    </p>
                </div>
                <Link href="/dashboard/products/new">
                    <Button className="bg-[#1E1E2D] hover:bg-[#2a2a3f] h-12 rounded-xl font-bold">
                        <Plus className="ml-2 h-4 w-4" />
                        إضافة منتج جديد
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200/60 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/30">
                    <ProductSearch defaultValue={query} />
                </div>

                <div className="p-0">
                    <DataTable
                        columns={columns}
                        data={filteredProducts}
                    />
                </div>
            </div>
        </div>
    );
}
