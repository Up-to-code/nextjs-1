import { ProductForm } from "@/components/features/products/ProductForm";

export default function NewProductPage() {
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">إضافة منتج جديد</h2>
                <p className="text-muted-foreground mt-2">
                    أدخل تفاصيل المنتج الجديد بدقة ليظهر للعملاء بشكل جذاب
                </p>
            </div>

            <ProductForm />
        </div>
    );
}
