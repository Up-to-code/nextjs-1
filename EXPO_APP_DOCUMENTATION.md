# Antig - Expo React Native App Documentation for LLM

## 📱 Project Overview

This document describes the **Expo React Native** mobile app version of the Antig furniture management platform. This is the mobile counterpart to the Next.js web dashboard, providing native iOS and Android experiences.

### Tech Stack
- **Framework**: Expo SDK 52+ (React Native)
- **Language**: TypeScript
- **Navigation**: React Navigation 7 (Stack + Tab Navigator)
- **UI Components**: React Native Paper or NativeBase (or custom with React Native components)
- **State Management**: React Context API / Zustand / Redux Toolkit
- **Forms**: React Hook Form + Zod
- **Charts**: Victory Native / React Native Chart Kit
- **Icons**: Expo Icons / React Native Vector Icons
- **Storage**: AsyncStorage / Expo SecureStore
- **API Client**: Axios / Fetch
- **Font**: Cairo (Arabic font for React Native)

---

## 🚀 Expo App Initialization & Setup

### Prerequisites
```bash
Node.js 18+
npm/yarn/pnpm/bun
Expo CLI: npm install -g expo-cli
```

### Installation
```bash
# Create new Expo app
npx create-expo-app AntigMobile --template blank-typescript

# Navigate to project
cd AntigMobile

# Install dependencies
npx expo install expo-router react-native-screens react-native-safe-area-context
npx expo install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-hook-form zod @hookform/resolvers
npx expo install @react-native-async-storage/async-storage
npx expo install expo-secure-store
npx expo install axios
npx expo install react-native-paper  # or NativeBase
npx expo install react-native-vector-icons
npx expo install expo-font
npx expo install expo-linear-gradient
npx expo install react-native-svg  # for charts/icons

# For charts (choose one):
npm install victory-native
# OR
npm install react-native-chart-kit

# Development
npx expo start
```

### Project Structure
```
AntigMobile/
├── app/                    # Expo Router app directory (if using Expo Router)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/            # Bottom tab navigation
│   │   ├── dashboard.tsx
│   │   ├── products.tsx
│   │   ├── orders.tsx
│   │   └── profile.tsx
│   └── _layout.tsx
├── src/
│   ├── screens/           # Screen components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── categories/
│   │   ├── analytics/
│   │   ├── employees/
│   │   └── settings/
│   ├── components/        # Reusable components
│   │   ├── ui/           # UI primitives
│   │   ├── layout/       # Layout components
│   │   ├── forms/        # Form components
│   │   └── shared/       # Shared components
│   ├── navigation/        # Navigation config
│   ├── services/          # API services
│   ├── hooks/            # Custom hooks
│   ├── context/          # Context providers
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   └── constants/        # Constants (colors, etc.)
├── assets/               # Images, fonts
│   ├── images/
│   ├── fonts/
│   └── icons/
├── app.json              # Expo config
└── package.json
```

---

## 🎨 Design System (React Native)

### Colors
```typescript
// src/constants/colors.ts
export const Colors = {
  // Primary
  primary: '#242C5A',
  primaryDark: '#1a2144',
  primaryLight: '#2a346e',
  
  // Background
  background: '#FDFDFD',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text
  text: '#1B1B1F',
  textSecondary: '#64748B',
  textMuted: '#9CA3AF',
  
  // Borders
  border: '#E2E8F0',
  divider: '#E2E8F0',
  
  // Status
  success: '#10B981',
  successLight: '#ECFDF5',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  info: '#3B82F6',
  infoLight: '#EFF6FF',
  
  // Sidebar (for drawer)
  sidebar: '#1A1A27',
  sidebarActive: '#FFFFFF',
  
  // Grays
  gray50: '#FAFAFA',
  gray100: '#F4F5F7',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
};
```

### Typography
```typescript
// src/constants/typography.ts
export const Typography = {
  // Font Family (Cairo)
  fontFamily: {
    regular: 'Cairo-Regular',
    medium: 'Cairo-Medium',
    semibold: 'Cairo-SemiBold',
    bold: 'Cairo-Bold',
    extrabold: 'Cairo-ExtraBold',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Font loading in app entry
import { useFonts } from 'expo-font';
import { Cairo_400Regular, Cairo_500Medium, Cairo_600SemiBold, Cairo_700Bold, Cairo_800ExtraBold } from '@expo-google-fonts/cairo';

const [fontsLoaded] = useFonts({
  'Cairo-Regular': Cairo_400Regular,
  'Cairo-Medium': Cairo_500Medium,
  'Cairo-SemiBold': Cairo_600SemiBold,
  'Cairo-Bold': Cairo_700Bold,
  'Cairo-ExtraBold': Cairo_800ExtraBold,
});
```

### Spacing
```typescript
// src/constants/spacing.ts
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};
```

### Border Radius
```typescript
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
};
```

---

## 📱 Mobile App Screens & Navigation

### Navigation Structure

**Bottom Tab Navigator** (Main Navigation):
1. Dashboard (Home icon)
2. Products (Package icon)
3. Orders (ShoppingCart icon)
4. Analytics (BarChart icon)
5. Profile (User icon)

**Stack Navigator** (Secondary Navigation):
- Auth Stack: Login, Register
- Product Stack: Products List, Product Details, Add/Edit Product
- Order Stack: Orders List, Order Details
- Settings Stack: Settings, Profile, Notifications

**Drawer Navigator** (Optional - for more options):
- All main sections
- Employees
- Categories
- Organization
- Help

---

### Screen 1: Login Screen (`/login`)
**File**: `src/screens/auth/LoginScreen.tsx`

**Layout**:
- Logo at top center
- "تسجيل الدخول" title
- Welcome message
- Email input field
- Password input field (with show/hide toggle)
- "Forgot password?" link
- Login button (full width)
- "Create account" link at bottom

**Components**:
```tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>H</Text>
        </View>
        
        {/* Title */}
        <Text style={styles.title}>تسجيل الدخول</Text>
        <Text style={styles.subtitle}>أهلاً بك مجدداً في منصة Houses</Text>
        
        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="البريد الإلكتروني"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="كلمة المرور"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>نسيت كلمة المرور؟</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
          </TouchableOpacity>
          
          <View style={styles.registerLink}>
            <Text>ليس لديك حساب؟ </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLinkText}>أنشئ حساب جديد</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: Spacing.xl,
  },
  form: {
    gap: Spacing.md,
  },
  input: {
    height: 52,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.fontSize.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.fontSize.base,
  },
  eyeButton: {
    paddingHorizontal: Spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
  },
  loginButton: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  loginButtonText: {
    color: Colors.surface,
    fontSize: Typography.fontSize.lg,
    fontWeight: 'bold',
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  registerLinkText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
```

---

### Screen 2: Dashboard Screen (`/dashboard`)
**File**: `src/screens/dashboard/DashboardScreen.tsx`

**Layout**:
- Header: Welcome message, profile icon, notifications icon
- ScrollView with:
  1. **Stats Cards Row** (horizontal ScrollView)
     - Total Sales card
     - New Orders card
     - Active Products card
     - New Customers card
  2. **Revenue Chart** (line chart)
  3. **Sales by Category** (pie/bar chart)
  4. **Recent Orders List** (flat list)
  5. **Quick Actions** (grid of action buttons)

**Components**:
```tsx
import { View, Text, ScrollView, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatCard } from '@/components/shared/StatCard';
import { RevenueChart } from '@/components/charts/RevenueChart';

export function DashboardScreen() {
  const stats = [
    { title: 'إجمالي المبيعات', value: '45,231.89 ر.س', trend: '+20.1%', positive: true },
    { title: 'الطلبات الجديدة', value: '+573', trend: '+12%', positive: true },
    { title: 'المنتجات النشطة', value: '124', description: '12 منتج نفذت كميته' },
    { title: 'العملاء الجدد', value: '+24', trend: '-4%', positive: false },
  ];
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>لوحة التحكم</Text>
          <Text style={styles.headerSubtitle}>مرحباً بك مجدداً، أحمد</Text>
        </View>
        <View style={styles.headerIcons}>
          {/* Notifications icon */}
          {/* Profile icon */}
        </View>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.statsContainer}
          contentContainerStyle={styles.statsContent}
        >
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </ScrollView>
        
        {/* Charts Section */}
        <View style={styles.chartsSection}>
          <RevenueChart />
          <SalesByCategoryChart />
        </View>
        
        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>أحدث الطلبات</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          <RecentOrdersList />
        </View>
        
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
          <QuickActionsGrid />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

### Screen 3: Products List Screen (`/products`)
**File**: `src/screens/products/ProductsScreen.tsx`

**Layout**:
- Header: Title, search bar, filter icon, add button (FAB)
- Search input at top
- Filter chips (Category, Status)
- Products list (FlatList with card items)
- Pull to refresh
- Infinite scroll / pagination

**Product Card Component**:
```tsx
<TouchableOpacity style={styles.productCard}>
  <Image source={{ uri: product.images[0] }} style={styles.productImage} />
  <View style={styles.productInfo}>
    <Text style={styles.productName}>{product.name}</Text>
    <Text style={styles.productSku}>{product.sku}</Text>
    <View style={styles.productMeta}>
      <Text style={styles.productPrice}>{product.price} ر.س</Text>
      <View style={[styles.stockBadge, product.stock === 0 && styles.stockBadgeEmpty]}>
        <Text style={styles.stockText}>
          {product.stock === 0 ? 'نفذت الكمية' : `المخزون: ${product.stock}`}
        </Text>
      </View>
    </View>
  </View>
  <TouchableOpacity style={styles.moreButton}>
    {/* Three dots icon */}
  </TouchableOpacity>
</TouchableOpacity>
```

---

### Screen 4: Product Details Screen (`/products/:id`)
**File**: `src/screens/products/ProductDetailsScreen.tsx`

**Layout**:
- Image carousel at top (swipeable)
- Product name, SKU, category
- Price (large, prominent)
- Stock status badge
- Description section
- Specifications (dimensions, weight)
- Actions: Edit, Delete, Duplicate
- Bottom action bar with primary action

**Components**:
```tsx
<ScrollView>
  {/* Image Carousel */}
  <ImageCarousel images={product.images} />
  
  {/* Product Info */}
  <View style={styles.content}>
    <Text style={styles.productName}>{product.name}</Text>
    <Text style={styles.sku}>{product.sku}</Text>
    
    <View style={styles.priceContainer}>
      <Text style={styles.price}>{product.price} ر.س</Text>
      {product.originalPrice && (
        <Text style={styles.originalPrice}>{product.originalPrice} ر.س</Text>
      )}
    </View>
    
    <View style={styles.stockBadge}>
      <Text>المخزون: {product.stock}</Text>
    </View>
    
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>الوصف</Text>
      <Text style={styles.description}>{product.description}</Text>
    </View>
    
    {/* Specifications */}
    {/* Actions */}
  </View>
</ScrollView>
```

---

### Screen 5: Add/Edit Product Screen (`/products/new` or `/products/:id/edit`)
**File**: `src/screens/products/ProductFormScreen.tsx`

**Layout**:
- ScrollView form
- Image upload section
- Form fields:
  - Name (Arabic)
  - Name (English)
  - Description (multiline)
  - Category (picker)
  - Price
  - Original Price
  - Stock
  - SKU
  - Dimensions (Length, Width, Height)
  - Weight
  - Status toggle
  - Tags (chips input)
- Save button (sticky bottom)

**Form Component**:
```tsx
<ScrollView style={styles.form}>
  <ImageUploadSection />
  
  <FormField label="اسم المنتج (عربي)" required>
    <TextInput value={name} onChangeText={setName} />
  </FormField>
  
  <FormField label="اسم المنتج (إنجليزي)" required>
    <TextInput value={nameEn} onChangeText={setNameEn} />
  </FormField>
  
  <FormField label="الوصف">
    <TextInput 
      multiline 
      numberOfLines={4}
      value={description}
      onChangeText={setDescription}
    />
  </FormField>
  
  <FormField label="التصنيف" required>
    <CategoryPicker value={category} onValueChange={setCategory} />
  </FormField>
  
  {/* More fields */}
</ScrollView>

<View style={styles.bottomActions}>
  <TouchableOpacity style={styles.saveButton}>
    <Text style={styles.saveButtonText}>حفظ</Text>
  </TouchableOpacity>
</View>
```

---

### Screen 6: Orders List Screen (`/orders`)
**File**: `src/screens/orders/OrdersScreen.tsx`

**Layout**:
- Header with stats summary (4 small cards)
- Filter tabs (All, Pending, Processing, Delivered, Cancelled)
- Search bar
- Orders list (FlatList)
- Pull to refresh

**Order Card Component**:
```tsx
<TouchableOpacity style={styles.orderCard}>
  <View style={styles.orderHeader}>
    <View>
      <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
      <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
    </View>
    <StatusBadge status={order.orderStatus} />
  </View>
  
  <View style={styles.orderCustomer}>
    <Text style={styles.customerName}>{order.customer.name}</Text>
    <Text style={styles.itemsCount}>{order.items.length} منتج</Text>
  </View>
  
  <View style={styles.orderFooter}>
    <Text style={styles.orderTotal}>{order.total} ر.س</Text>
    <View style={[styles.paymentBadge, order.paymentStatus === 'paid' && styles.paid]}>
      <Text>{order.paymentStatus === 'paid' ? 'مدفوع' : 'غير مدفوع'}</Text>
    </View>
  </View>
</TouchableOpacity>
```

---

### Screen 7: Order Details Screen (`/orders/:id`)
**File**: `src/screens/orders/OrderDetailsScreen.tsx`

**Layout**:
- Order header card (order number, status, total)
- Customer info card
- Order items list
- Order summary (subtotal, shipping, tax, total)
- Payment info
- Shipping info
- Status timeline
- Action buttons (Update status, Cancel, etc.)

**Components**:
```tsx
<ScrollView>
  {/* Order Header */}
  <View style={styles.orderHeaderCard}>
    <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
    <StatusBadge status={order.orderStatus} />
    <Text style={styles.orderTotal}>{order.total} ر.س</Text>
  </View>
  
  {/* Customer Info */}
  <View style={styles.card}>
    <Text style={styles.cardTitle}>معلومات العميل</Text>
    <Text>{order.customer.name}</Text>
    <Text>{order.customer.phone}</Text>
    <Text>{order.customer.address}</Text>
  </View>
  
  {/* Order Items */}
  <View style={styles.card}>
    <Text style={styles.cardTitle}>المنتجات</Text>
    {order.items.map(item => (
      <OrderItemRow key={item.productId} item={item} />
    ))}
  </View>
  
  {/* Summary */}
  <View style={styles.card}>
    <SummaryRow label="المجموع الفرعي" value={order.subtotal} />
    <SummaryRow label="تكلفة الشحن" value={order.shippingCost} />
    <SummaryRow label="الضريبة" value={order.tax} />
    <SummaryRow label="الإجمالي" value={order.total} isTotal />
  </View>
  
  {/* Status Timeline */}
  <StatusTimeline history={order.statusHistory} />
  
  {/* Actions */}
  <View style={styles.actions}>
    <TouchableOpacity style={styles.primaryButton}>
      <Text>تحديث الحالة</Text>
    </TouchableOpacity>
  </View>
</ScrollView>
```

---

### Screen 8: Categories Screen (`/categories`)
**File**: `src/screens/categories/CategoriesScreen.tsx`

**Layout**:
- Header with search, add button
- Categories grid (2 columns) or list
- Category card shows: name, product count, image/icon

**Category Card**:
```tsx
<TouchableOpacity style={styles.categoryCard}>
  <View style={styles.categoryIcon}>
    {/* Icon or image */}
  </View>
  <Text style={styles.categoryName}>{category.name}</Text>
  <Text style={styles.productCount}>{category.productCount} منتج</Text>
</TouchableOpacity>
```

---

### Screen 9: Analytics Screen (`/analytics`)
**File**: `src/screens/analytics/AnalyticsScreen.tsx`

**Layout**:
- Date range picker
- Revenue chart (line/area chart)
- Sales by category (pie chart)
- Top products table/list
- Export button

**Chart Components**:
```tsx
// Using Victory Native
import { VictoryLine, VictoryChart, VictoryAxis } from 'victory-native';

<VictoryChart>
  <VictoryAxis />
  <VictoryAxis dependentAxis />
  <VictoryLine data={revenueData} />
</VictoryChart>
```

---

### Screen 10: Settings Screen (`/settings`)
**File**: `src/screens/settings/SettingsScreen.tsx`

**Layout**:
- Profile section (avatar, name, email)
- Settings sections list:
  - Profile Settings
  - Security & Privacy
  - Notifications
  - Appearance & Language
  - About
- Logout button

**Settings Item Component**:
```tsx
<TouchableOpacity style={styles.settingsItem}>
  <View style={styles.settingsItemLeft}>
    <Icon name="user" />
    <Text style={styles.settingsItemText}>الملف الشخصي</Text>
  </View>
  <Icon name="chevron-left" />
</TouchableOpacity>
```

---

### Screen 11: Profile Screen (`/profile`)
**File**: `src/screens/profile/ProfileScreen.tsx`

**Layout**:
- Avatar with edit button
- User info (name, email, phone, business name)
- Edit button
- Form fields for editing

---

### Screen 12: Notifications Screen (`/notifications`)
**File**: `src/screens/notifications/NotificationsScreen.tsx`

**Layout**:
- Notification list (grouped by date)
- Filter by type
- Mark all as read button
- Empty state if no notifications

**Notification Item**:
```tsx
<TouchableOpacity style={[styles.notificationItem, !notification.read && styles.unread]}>
  <View style={styles.notificationIcon}>
    {/* Icon based on type */}
  </View>
  <View style={styles.notificationContent}>
    <Text style={styles.notificationTitle}>{notification.title}</Text>
    <Text style={styles.notificationMessage}>{notification.message}</Text>
    <Text style={styles.notificationTime}>{formatTime(notification.createdAt)}</Text>
  </View>
</TouchableOpacity>
```

---

## 🧩 React Native Component Patterns

### StatCard Component
```tsx
// src/components/shared/StatCard.tsx
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; positive: boolean };
  description?: string;
}

export function StatCard({ title, value, icon, trend, description }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        {trend && (
          <View style={[styles.trendBadge, trend.positive && styles.trendPositive]}>
            <Text style={styles.trendText}>
              {trend.positive ? '+' : '-'}{trend.value}%
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    width: 160,
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
  trendBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.errorLight,
  },
  trendPositive: {
    backgroundColor: Colors.successLight,
  },
  trendText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: 'bold',
    color: Colors.success,
  },
});
```

### Status Badge Component
```tsx
// src/components/shared/StatusBadge.tsx
export function StatusBadge({ status }: { status: OrderStatus }) {
  const statusConfig = {
    pending: { label: 'قيد الانتظار', color: Colors.warning },
    processing: { label: 'قيد المعالجة', color: Colors.info },
    shipping: { label: 'قيد الشحن', color: Colors.info },
    delivered: { label: 'تم التسليم', color: Colors.success },
    completed: { label: 'مكتمل', color: Colors.success },
    cancelled: { label: 'ملغى', color: Colors.error },
  };
  
  const config = statusConfig[status];
  
  return (
    <View style={[styles.badge, { backgroundColor: config.color + '20' }]}>
      <Text style={[styles.badgeText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}
```

### Button Component
```tsx
// src/components/ui/Button.tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  disabled?: boolean;
}

export function Button({ 
  title, 
  onPress, 
  variant = 'primary',
  fullWidth = false,
  disabled = false 
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, styles[`${variant}Text`]]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  primaryText: {
    color: Colors.surface,
    fontWeight: 'bold',
    fontSize: Typography.fontSize.base,
  },
  // ... other variants
});
```

### Input Component
```tsx
// src/components/ui/Input.tsx
export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  ...props
}: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={Colors.textMuted}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 52,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.fontSize.base,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlign: 'right',
  },
});
```

---

## 🧭 Navigation Setup

### React Navigation Configuration
```tsx
// src/navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
          tabBarLabel: 'الرئيسية',
        }}
      />
      <Tab.Screen 
        name="Products" 
        component={ProductsScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="package" color={color} />,
          tabBarLabel: 'المنتجات',
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="shopping-cart" color={color} />,
          tabBarLabel: 'الطلبات',
        }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="bar-chart" color={color} />,
          tabBarLabel: 'التحليلات',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="user" color={color} />,
          tabBarLabel: 'الملف الشخصي',
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

## 📦 Data Models (Same as Web)

All data models are identical to the web version (see COMPLETE_PROJECT_DOC.md):
- User
- Product
- Category
- Order
- Employee
- Notification

---

## 🔄 State Management Patterns

### Context API Example
```tsx
// src/context/AuthContext.tsx
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const login = async (email, password) => {
    // Login logic
    setUser(userData);
  };
  
  const logout = () => {
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Custom Hooks
```tsx
// src/hooks/useProducts.ts
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchProducts = async () => {
    setLoading(true);
    const data = await api.getProducts();
    setProducts(data);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  return { products, loading, refetch: fetchProducts };
}
```

---

## 📱 Mobile-Specific Patterns

### Pull to Refresh
```tsx
<FlatList
  data={items}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[Colors.primary]}
    />
  }
  renderItem={({ item }) => <ItemCard item={item} />}
/>
```

### Bottom Sheet / Modal
```tsx
import { Modal, View, StyleSheet } from 'react-native';

export function BottomSheet({ visible, onClose, children }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.content}>
          {children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
```

### Floating Action Button (FAB)
```tsx
<View style={styles.fab}>
  <TouchableOpacity 
    style={styles.fabButton}
    onPress={onPress}
  >
    <Icon name="plus" size={24} color={Colors.surface} />
  </TouchableOpacity>
</View>

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
```

### Image Picker
```tsx
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  
  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
};
```

---

## 🎯 Key Differences from Web Version

1. **Navigation**: React Navigation instead of Next.js routing
2. **Styling**: StyleSheet instead of Tailwind CSS (or use NativeWind)
3. **Components**: React Native components (View, Text, ScrollView) instead of HTML
4. **Images**: Image component instead of Next Image
5. **Forms**: React Native TextInput instead of HTML input
6. **Touch**: TouchableOpacity/TouchableHighlight instead of buttons
7. **Layout**: Flexbox-only (no CSS Grid)
8. **Charts**: Victory Native instead of Recharts
9. **Icons**: React Native Vector Icons instead of Lucide
10. **Storage**: AsyncStorage instead of localStorage

---

## ✅ Mobile App Checklist for LLM

When generating Expo/React Native components:

- [ ] Use React Native components (View, Text, ScrollView, FlatList, etc.)
- [ ] Use StyleSheet.create() for styles
- [ ] Ensure RTL support (textAlign: 'right', flexDirection: 'row-reverse')
- [ ] Use SafeAreaView for safe areas
- [ ] Implement pull-to-refresh
- [ ] Use FlatList for long lists (performance)
- [ ] Add loading states and error handling
- [ ] Use TouchableOpacity for buttons/interactive elements
- [ ] Implement proper keyboard handling (KeyboardAvoidingView)
- [ ] Use appropriate input types (keyboardType, secureTextEntry)
- [ ] Add proper accessibility labels
- [ ] Handle image loading and errors
- [ ] Use proper navigation patterns (React Navigation)
- [ ] Implement proper state management
- [ ] Test on both iOS and Android

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Victory Native](https://formidable.com/open-source/victory/docs/native/)
- [NativeWind](https://www.nativewind.dev/) - Tailwind CSS for React Native

---

**This documentation provides everything needed for an LLM to generate a complete Expo React Native mobile app version of the Antig platform.**
