import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
});

export const registerSchema = z.object({
    name: z.string().min(2, 'الاسم مطلوب'),
    businessName: z.string().min(2, 'اسم المتجر مطلوب'),
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    phone: z.string().regex(/^(05|5)([0-9]{8})$/, 'رقم الجوال غير صحيح'),
    password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
});

// Product Schemas
export const productSchema = z.object({
    name: z.string().min(2, 'اسم المنتج مطلوب'),
    nameEn: z.string().min(2, 'Product name is required'),
    description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
    categoryId: z.string().min(1, 'الفئة مطلوبة'),
    price: z.number().positive('السعر يجب أن يكون أكبر من صفر'),
    originalPrice: z.number().positive().optional(),
    stock: z.number().min(0, 'المخزون لا يمكن أن يكون سالباً'),
    sku: z.string().min(1, 'رمز المنتج مطلوب'),
    images: z.array(z.string()).min(1, 'صورة واحدة على الأقل مطلوبة'),
    weight: z.number().positive().optional(),
    dimensions: z.object({
        length: z.number().positive(),
        width: z.number().positive(),
        height: z.number().positive(),
    }).optional(),
    tags: z.array(z.string()).optional(),
});

// Category Schema
export const categorySchema = z.object({
    name: z.string().min(2, 'اسم الفئة مطلوب'),
    nameEn: z.string().min(2, 'Category name is required'),
    description: z.string().optional(),
    image: z.string().optional(),
    parentId: z.string().optional(),
    order: z.number().min(0).optional(),
});

// Order Status Update Schema
export const orderStatusSchema = z.object({
    orderId: z.string(),
    status: z.enum(['pending', 'processing', 'shipping', 'delivered', 'completed', 'cancelled', 'returning', 'returned']),
    note: z.string().optional(),
    notifyCustomer: z.boolean().optional(),
});

// Settings Schema
export const profileSettingsSchema = z.object({
    name: z.string().min(2, 'الاسم مطلوب'),
    businessName: z.string().min(2, 'اسم المتجر مطلوب'),
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    phone: z.string().regex(/^(05|5)([0-9]{8})$/, 'رقم الجوال غير صحيح'),
    address: z.string().min(5, 'العنوان مطلوب'),
    businessDescription: z.string().optional(),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(8, 'كلمة المرور الحالية مطلوبة'),
    newPassword: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
});

// Type inference
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type OrderStatusInput = z.infer<typeof orderStatusSchema>;
export type ProfileSettingsInput = z.infer<typeof profileSettingsSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
