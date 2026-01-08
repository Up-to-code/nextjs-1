# Antig - Complete Project Documentation

## 📋 Project Overview

**Antig** (أثاث بلس) is a modern, Arabic-first (RTL) furniture management platform built with Next.js 16, React 19, TypeScript, and Tailwind CSS. It provides a comprehensive dashboard for furniture retailers to manage products, orders, categories, employees, and analytics.

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Icons**: Lucide React
- **Auth**: Clerk
- **Font**: Cairo (Arabic-optimized)

---

## 🚀 Initialization & Setup

### Prerequisites
```bash
Node.js 20+ (or Bun)
npm/yarn/pnpm/bun
```

### Installation
```bash
# Install dependencies
bun install

# Run development server
bun dev

# Build for production
bun build

# Start production server
bun start
```

### Environment Variables (.env.local)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

---

## 📁 Project Structure

```
nextjs-1/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── dashboard/      # Main dashboard
│   │   ├── products/       # Products management
│   │   │   └── new/       # Add product
│   │   ├── categories/     # Categories management
│   │   ├── orders/         # Orders management
│   │   │   └── [id]/      # Order details
│   │   ├── analytics/      # Analytics & reports
│   │   ├── employees/      # Employee management
│   │   ├── organization/   # Organization settings
│   │   ├── settings/       # User settings
│   │   ├── notifications/  # Notifications center
│   │   └── help/          # Help & support
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── layout/             # Layout components
│   ├── dashboard/          # Dashboard components
│   ├── features/           # Feature components
│   ├── landing/            # Landing page components
│   └── shared/             # Shared components
├── types/
│   ├── models.ts           # Data models
│   └── index.ts            # Type exports
├── services/
│   └── mock-data.ts        # Mock data
├── hooks/                  # Custom React hooks
├── lib/
│   ├── utils.ts            # Utility functions
│   └── validations.ts      # Zod schemas
└── design-system.json      # Complete design system
```

---

## 🖥️ Application Screens & Pages

### Public Pages

#### 1. Landing Page (`/`)
**File**: `app/page.tsx`

**Components**:
- `LandingHeader` - Navigation header with logo, links, CTA
- `HeroSection` - Hero with title, description, CTA buttons
- `FeaturesSection` - 3-column feature cards grid
- `StatsSection` - Statistics with numbers (500+ partners, 10K+ products, etc.)
- `HowItWorksSection` - Process steps
- `CTASection` - Call-to-action section
- `Footer` - Footer with links

**Purpose**: Marketing/landing page for partner signup

**Key Features**:
- Arabic RTL layout
- Primary color: #242C5A
- Large hero text with gradient
- Responsive design

---

#### 2. Login Page (`/login`)
**File**: `app/(auth)/login/page.tsx`

**Features**:
- Email/password login form
- Password visibility toggle
- Form validation (Zod)
- Loading states
- Links to register and forgot password
- Mobile-optimized header

**Form Fields**:
- Email (required, email format)
- Password (required, min 6 chars)

**Actions**:
- Submit → Redirect to `/dashboard`
- "Create Account" → Navigate to `/register`

---

#### 3. Register Page (`/register`)
**File**: `app/(auth)/register/page.tsx`

**Features**:
- Registration form
- Business information fields
- Form validation
- Terms acceptance
- Redirect to dashboard after registration

---

### Dashboard Pages (Protected)

All dashboard routes are wrapped in `app/(dashboard)/layout.tsx` which provides:
- `DashboardSidebar` - Side navigation (dark sidebar #1A1A27)
- `DashboardHeader` - Top header with user menu and notifications
- Authentication protection
- Mobile responsive layout

---

#### 4. Main Dashboard (`/dashboard`)
**File**: `app/(dashboard)/dashboard/page.tsx`

**Layout**:
1. **Header Section**
   - Title: "لوحة التحكم"
   - Welcome message with name
   - Action buttons: "Annual Stats", "Export Report"

2. **Statistics Cards Grid (4 cards)**
   - Total Sales: "45,231.89 ر.س" with +20.1% trend
   - New Orders: "+573" with +12% trend
   - Active Products: "124" with warning for out-of-stock
   - New Customers: "+24" with -4% trend

3. **Charts Section**
   - Revenue chart (line chart, monthly: يناير, فبراير, etc.)
   - Sales by category (bar/pie chart: غرف النوم, المكاتب, الكنب, الطاولات)

4. **Recent Orders Table**
   - Latest 5-10 orders
   - Columns: Order number, customer, status, total, date
   - Link to view all orders

5. **Quick Actions**
   - Add Product button
   - Add Category button
   - Create Order button
   - View Analytics button

**Components Used**:
- `StatCard` - Statistics display card
- `DashboardCharts` - Chart components wrapper
- `RecentOrdersTable` - Orders table component
- `QuickActions` - Action buttons grid

---

#### 5. Products Page (`/products`)
**File**: `app/(dashboard)/products/page.tsx`

**Features**:
- Products list with search functionality
- Filter by category/status
- Data table with pagination
- "Add Product" button (links to `/products/new`)
- Server-side filtering with searchParams

**Table Columns** (ProductColumns):
- Name (Arabic & English)
- SKU
- Category
- Price (in ر.س)
- Stock (with warning if low/out)
- Status (active/inactive badge)
- Actions (edit, delete)

**Components Used**:
- `DataTable` - Reusable table component
- `ProductColumns` - Column definitions
- `ProductSearch` - Search input component

**Data**: `MOCK_PRODUCTS` from `services/mock-data.ts`

---

#### 6. Add/Edit Product (`/products/new` or `/products/[id]`)
**File**: `app/(dashboard)/products/new/page.tsx`

**Form Fields**:
- Product name (Arabic) - required
- Product name (English) - required
- Description - textarea
- Category - dropdown/select (from MOCK_CATEGORIES)
- Price - number input
- Original Price (optional) - number input
- Stock quantity - number input
- SKU - text input
- Images - multiple file upload or URL input
- Dimensions:
  - Length - number
  - Width - number
  - Height - number
- Weight - number
- Status - toggle/select (active/inactive)
- Tags - multi-select or comma-separated

**Components Used**:
- `ProductForm` - Main form component
- Form validation with Zod schema
- Image upload/preview

**Actions**:
- Save → Redirect to products list
- Cancel → Go back to products list

---

#### 7. Categories Page (`/categories`)
**File**: `app/(dashboard)/categories/page.tsx`

**Features**:
- Categories grid/list view
- Search categories (name or description)
- "Add Category" button
- Server-side filtering

**Category Card/Row Displays**:
- Name (Arabic & English)
- Description
- Product count badge
- Status badge (active/inactive)
- Actions (edit, delete)

**Components Used**:
- `CategoriesClient` - Client component for interactivity
- `CategorySearch` - Search input
- `CategoryDialog` / `AddCategoryDialog` - Add/edit dialogs

**Data**: `MOCK_CATEGORIES` from `services/mock-data.ts`

**Categories Include**:
- مكاتب (Desks) - 15 products
- كراسي (Chairs) - 24 products
- طاولات (Tables) - 8 products
- كنب (Sofas) - 12 products

---

#### 8. Orders Page (`/orders`)
**File**: `app/(dashboard)/orders/page.tsx`

**Layout**:
1. **Header**
   - Title: "الطلبات"
   - Description: "تتبع وإدارة جميع طلبات العملاء وحالات التوصيل"

2. **Summary Stats Cards (4 cards)**
   - Total Orders
   - Pending Orders
   - Completed Orders
   - Cancelled Orders

3. **Orders Table/List**
   - Search/filter functionality
   - Server-side filtering

**Table Columns** (OrderColumns):
- Order Number
- Customer Name
- Items Count
- Total Amount (in ر.س)
- Payment Status (paid/unpaid/refunded)
- Order Status (pending/processing/shipping/delivered/completed/cancelled/returning/returned)
- Date Created
- Actions (view, update status, cancel)

**Components Used**:
- `OrdersClient` - Client-side orders management
- `OrderSearch` - Search/filter component
- `OrderStatusBadge` - Status indicator component
- `StatCard` - Summary cards

**Actions**:
- View order details → `/orders/[id]`
- Update order status
- Filter by status/payment method
- Export orders

---

#### 9. Order Details (`/orders/[id]`)
**File**: `app/(dashboard)/orders/[id]/page.tsx`

**Sections**:

1. **Order Header**
   - Order number (large, prominent)
   - Status badge
   - Total amount (large)
   - Created date

2. **Customer Information Card**
   - Customer name
   - Email
   - Phone
   - Shipping address (full address with city, postal code)

3. **Order Items Table**
   - Product image
   - Product name
   - SKU
   - Quantity
   - Unit price
   - Total price per item
   - Subtotal

4. **Order Summary Card**
   - Subtotal
   - Shipping cost
   - Tax
   - Discount (if any)
   - Total (large, highlighted)

5. **Payment Information**
   - Payment method (cash/card/bank_transfer)
   - Payment status (paid/unpaid/refunded)

6. **Shipping Information**
   - Shipping method
   - Tracking number (if available)
   - Scheduled delivery date (if scheduled)

7. **Status History Timeline**
   - Chronological list of status changes
   - Timestamp for each change
   - Notes for each status change
   - Updated by (user/admin name)

8. **Notes Section**
   - Order notes
   - Internal notes

9. **Actions**
   - Update status (dropdown with all statuses)
   - Schedule delivery (date picker)
   - Cancel order (with confirmation)
   - Print invoice
   - Mark as paid

**Components Used**:
- `OrderDetail` - Main order detail component
- `CustomerInfoCard` - Customer information display
- Status timeline component

---

#### 10. Analytics Page (`/analytics`)
**File**: `app/(dashboard)/analytics/page.tsx`

**Features**:
- Revenue chart (time series line/area chart)
- Sales by category chart (pie/bar chart)
- Top products table (sorted by sales/revenue)
- Date range picker (filter by date range)
- Export reports button

**Metrics Shown**:
- Revenue trends (daily/weekly/monthly)
- Category performance (sales by category)
- Product rankings (top 10 products)
- Customer insights
- Sales comparison (period over period)

**Components Used**:
- `RevenueChart` - Revenue visualization component
- `SalesByCategoryChart` - Category breakdown chart
- `TopProductsTable` - Top selling products table
- Date range picker component

**Chart Data**:
- Revenue by month: يناير (1500), فبراير (2300), مارس (3200), etc.
- Sales by category: غرف النوم (45), المكاتب (32), الكنب (78), الطاولات (25)

---

#### 11. Employees Page (`/employees`)
**File**: `app/(dashboard)/employees/page.tsx`

**Features**:
- Employee list table
- "Add Employee" button
- Employee management

**Employee Information**:
- Name
- Email
- Role (admin/editor/viewer)
  - Admin: Full access
  - Editor: Can edit products/orders
  - Viewer: Read-only access
- Status (active/inactive)
- Last active (timestamp)
- Actions: Edit, Delete, Change role

**Components Used**:
- `AddEmployeeDialog` - Add employee form
- Data table for employee list
- Role management UI

**Form Fields for Add Employee**:
- Name
- Email
- Role (dropdown)
- Send invitation email (checkbox)

---

#### 12. Organization Page (`/organization`)
**File**: `app/(dashboard)/organization/page.tsx`

**Features**:
- Business profile settings
- Company information management

**Sections**:

1. **Business Information**
   - Business name
   - Business description
   - Business address (full address)
   - City
   - Postal code
   - Commercial registration number
   - Tax ID

2. **Bank Account Information**
   - Account number
   - Bank name
   - IBAN

3. **Verification Status**
   - Verification badge/indicator
   - Verification documents upload
   - Pending/approved/rejected status

**Actions**:
- Save changes
- Upload verification documents
- Request verification

---

#### 13. Settings Page (`/settings`)
**File**: `app/(dashboard)/settings/page.tsx`

**Sections** (Tabs or accordion):

1. **Profile Settings**
   - Personal information:
     - Name
     - Email
     - Phone
   - Avatar upload
   - Business name
   - Business description

2. **Security & Privacy**
   - Change password
   - Two-factor authentication toggle
   - Privacy settings
   - Session management

3. **Team Management**
   - Employee list (same as /employees)
   - Add employee
   - Role management

4. **Notifications**
   - Email notifications (toggle)
   - SMS notifications (toggle)
   - In-app notifications (toggle)
   - Notification preferences by type

5. **Appearance & Language**
   - Theme selection (light/dark - if implemented)
   - Language selection (Arabic/English)
   - Timezone selection
   - Currency selection (ر.س, USD, etc.)

**Components Used**:
- Tabs component for sections
- Form components for each section
- Avatar upload component

---

#### 14. Notifications Page (`/notifications`)
**File**: `app/(dashboard)/notifications/page.tsx`

**Features**:
- Notification list (all notifications)
- Filter by type:
  - Info
  - Success
  - Warning
  - Error
  - Order updates
  - Product alerts
  - System messages
- Mark as read/unread
- Delete notifications
- Real-time updates (if implemented)
- Unread count badge

**Notification Display**:
- Icon (based on type)
- Title
- Message/description
- Timestamp
- Read/unread indicator
- Link to related item (if applicable)
- Actions: Mark as read, Delete

**Components Used**:
- Notification list component
- Filter dropdown
- Badge for unread count

---

#### 15. Help Page (`/help`)
**File**: `app/(dashboard)/help/page.tsx`

**Features**:
- FAQ sections (collapsible accordion)
- Search help articles
- Categories:
  - Getting Started
  - Products Management
  - Orders Management
  - Account Settings
  - Billing
  - Troubleshooting
- Contact support button/form
- Documentation links
- Video tutorials (if available)

**Components Used**:
- Accordion component for FAQs
- Search input
- Support contact form

---

## 📊 Data Models

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  businessName: string;
  businessDescription?: string;
  address: string;
  city: string;
  commercialRegistration?: string;
  taxId?: string;
  bankAccount?: {
    accountNumber: string;
    bankName: string;
    iban: string;
  };
  settings: {
    language: 'ar' | 'en';
    timezone: string;
    currency: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    inAppNotifications: boolean;
  };
  verified: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
}
```

### Product
```typescript
{
  id: string;
  name: string;              // Arabic name
  nameEn: string;            // English name
  description: string;
  category: string;          // Category name
  categoryId: string;
  price: number;             // In ر.س
  originalPrice?: number;
  stock: number;
  sku: string;
  images: string[];          // Array of image URLs
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  status: 'active' | 'inactive';
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Category
```typescript
{
  id: string;
  name: string;              // Arabic name
  nameEn: string;            // English name
  description?: string;
  image?: string;
  parentId?: string | null;  // For nested categories
  order: number;
  slug: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt?: Date;
}
```

### Order
```typescript
{
  id: string;
  orderNumber: string;       // e.g., "ORD-2024-001"
  customerId: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
  };
  items: {
    productId: string;
    productName: string;
    productImage: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipping' | 'delivered' | 'completed' | 'cancelled' | 'returning' | 'returned';
  shippingMethod?: string;
  trackingNumber?: string;
  notes?: string;
  scheduledDate?: Date;
  statusHistory: {
    status: OrderStatus;
    note?: string;
    timestamp: Date;
    updatedBy: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Employee
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  lastActive: string;        // ISO date string
}
```

### Notification
```typescript
{
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'order' | 'product' | 'system';
  read: boolean;
  createdAt: string;         // ISO date string
  link?: string;             // Optional link to related page
}
```

---

## 🎨 Design System

### Colors

**Primary Brand Colors**:
- Primary: `#242C5A` (hsl(231, 43%, 25%))
- Primary Hover: `#1a2144`
- Primary Light: `#2a346e`

**Sidebar**:
- Background: `#1A1A27` / `#1E1E2D` / `#0F172A`
- Text: `#FFFFFF`
- Border: `rgba(255, 255, 255, 0.05)`
- Active Item: White background (`bg-white`) with primary text (`text-[#242C5A]`)

**Neutrals**:
- Background: `#FDFDFD`
- Card: `#FFFFFF`
- Border: `#E2E8F0`
- Muted Background: `#F4F5F7`
- Text Primary: `#1B1B1F`
- Text Secondary: `#64748B`
- Text Muted: `#9CA3AF`

**Status Colors**:
- Success: `#10B981` (bg: `#ECFDF5`, text: `#065F46`)
- Error: `#EF4444` (bg: `#FEF2F2`, text: `#991B1B`)
- Warning: `#F59E0B` (bg: `#FFFBEB`, text: `#92400E`)
- Info: `#3B82F6` (bg: `#EFF6FF`, text: `#1E40AF`)

**Chart Colors**:
- Chart 1: `#242C5A`
- Chart 2: `#3B4270`
- Chart 3: `#5B6395`
- Chart 4: `#838AB9`
- Chart 5: `#B2B8DB`

### Typography

**Font Family**: Cairo (Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800
- Variable: `--font-cairo`
- Optimized for Arabic

**Font Sizes**:
- Hero: `text-9xl` (8rem) - `text-8xl` (6rem)
- Display: `text-5xl` (3rem) - `text-7xl` (4.5rem)
- Page Titles: `text-4xl` (2.25rem) - `text-3xl` (1.875rem)
- Section Headings: `text-2xl` (1.5rem)
- Body: `text-base` (1rem) - `text-lg` (1.125rem)
- Small: `text-sm` (0.875rem) - `text-xs` (0.75rem)

**Font Weights**:
- Light: `font-light` (300)
- Normal: `font-normal` (400)
- Medium: `font-medium` (500)
- Semibold: `font-semibold` (600)
- Bold: `font-bold` (700)
- Extrabold: `font-extrabold` (800)
- Black: `font-[1000]` (900) - for hero text

**Letter Spacing**:
- Tighter: `tracking-tighter` (-0.05em) - for headings
- Custom: `tracking-[0.2em]`, `tracking-[0.3em]`, `tracking-[0.4em]` - for labels

### Spacing

Base unit: 4px (0.25rem)

Common spacing:
- `space-y-4` (1rem) - `space-y-10` (2.5rem): Vertical spacing
- `gap-4` (1rem) - `gap-8` (2rem): Grid/flex gaps
- `p-4` (1rem) - `p-10` (2.5rem): Padding
- `px-6` (1.5rem), `py-4` (1rem): Specific padding
- `mb-4` (1rem) - `mb-8` (2rem): Margins

### Border Radius

- Small: `rounded-xl` (0.75rem / 12px)
- Medium: `rounded-2xl` (1rem / 16px)
- Large: `rounded-3xl` (1.5rem / 24px)
- Custom: `rounded-[1.5rem]`, `rounded-[2rem]`, `rounded-[2.5rem]`
- Full: `rounded-full`

### Shadows

- Subtle: `shadow-sm`
- Default: `shadow-md`
- Large: `shadow-lg` / `shadow-xl`
- Extra Large: `shadow-2xl`
- Custom Primary: `shadow-2xl shadow-primary/20`

### Component Patterns

**Card**:
```tsx
<div className="bg-white border border-gray-100 rounded-3xl p-6 hover:border-primary/20 transition-all">
```

**Premium Card** (from globals.css):
```tsx
<div className="premium-card">
  {/* bg-card border border-border/60 rounded-3xl transition-all duration-300 hover:border-primary/20 hover:bg-muted/30 */}
</div>
```

**Primary Button**:
```tsx
<Button className="bg-[#242C5A] hover:bg-[#1a2144] text-white rounded-xl font-bold h-12 px-6">
```

**Outline Button**:
```tsx
<Button variant="outline" className="border-2 border-gray-100 rounded-xl h-12 hover:bg-gray-50">
```

**Input**:
```tsx
<Input className="h-12 rounded-xl bg-muted border border-border px-6 focus:bg-white focus:ring-1 focus:ring-primary/20" />
```

**Premium Input** (from globals.css):
```tsx
<input className="premium-input" />
{/* h-12 rounded-xl bg-muted border border-border px-6 focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all duration-200 */}
```

**Stat Card**:
- Icon container (rounded-xl, bg-gray-50, h-12 w-12)
- Title (text-sm, text-muted-foreground)
- Value (text-3xl, font-extrabold, text-[#242C5A])
- Optional trend indicator (badge with percentage)

---

## 📱 Mobile UI Creation Guidelines

### Responsive Design

**Breakpoints**:
- `sm:` 640px (small tablets)
- `md:` 768px (tablets)
- `lg:` 1024px (desktop)
- `xl:` 1280px (large desktop)
- `2xl:` 1536px (extra large)

**Mobile-First Approach**:
- Start with mobile styles (default)
- Enhance for larger screens with `sm:`, `md:`, `lg:` prefixes

### RTL (Right-to-Left) Support

**Layout Direction**:
- Root layout: `dir="rtl"` on `<html>`
- Text alignment: `text-right` (default in RTL)
- Flex direction: Default is RTL-friendly
- Icons: Usually positioned on left side (`left-4` = visual right in RTL)
- Padding: `pr-4` = right padding (visual left in RTL)

**Example**:
```tsx
<div className="flex items-center gap-4 text-right">
  <Icon className="h-5 w-5" />
  <span>Text</span>
</div>
```

### Mobile Component Patterns

#### 1. Mobile Card Layout
```tsx
<div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
  <div className="flex flex-col sm:flex-row gap-4">
    {/* Mobile: stacked, Desktop: horizontal */}
  </div>
</div>
```

#### 2. Mobile Button
```tsx
<Button className="w-full sm:w-auto h-12 rounded-xl bg-[#242C5A] hover:bg-[#1a2144] text-white font-bold">
  Action
</Button>
```

#### 3. Mobile Input
```tsx
<Input 
  className="h-12 rounded-xl bg-muted border border-border px-6 focus:bg-white focus:ring-1 focus:ring-primary/20"
  placeholder="Placeholder"
/>
```

#### 4. Mobile Navigation
```tsx
{/* Hamburger menu (mobile only) */}
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="right" className="w-72 p-0">
    <DashboardSidebar />
  </SheetContent>
</Sheet>
```

#### 5. Mobile Table Alternative
```tsx
{/* Mobile: Cards */}
<div className="md:hidden space-y-4">
  {items.map(item => (
    <Card key={item.id} className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-[#242C5A]">{item.name}</h3>
          <p className="text-sm text-gray-400">{item.description}</p>
        </div>
        <Badge>{item.status}</Badge>
      </div>
      <div className="flex gap-4 text-sm mt-4">
        <span>Price: {item.price} ر.س</span>
        <span>Stock: {item.stock}</span>
      </div>
      <div className="flex gap-2 mt-4">
        <Button size="sm" variant="outline">Edit</Button>
        <Button size="sm" variant="destructive">Delete</Button>
      </div>
    </Card>
  ))}
</div>

{/* Desktop: Table */}
<div className="hidden md:block">
  <DataTable columns={columns} data={items} />
</div>
```

#### 6. Bottom Sheet (Mobile)
```tsx
<Sheet>
  <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
    <div className="p-6">
      {/* Content */}
    </div>
  </SheetContent>
</Sheet>
```

#### 7. Floating Action Button (Mobile)
```tsx
<Button 
  className="fixed bottom-6 left-6 right-6 sm:hidden rounded-full h-14 shadow-xl bg-[#242C5A] hover:bg-[#1a2144]"
>
  <Plus className="h-6 w-6 ml-2" />
  إضافة منتج جديد
</Button>
```

#### 8. Sticky Header
```tsx
<header className="sticky top-0 z-50 bg-white border-b border-gray-100 p-4">
  {/* Header content */}
</header>
```

### Touch Targets

**Minimum Sizes**:
- Buttons: `h-12` (3rem / 48px) minimum
- Touch targets: 44x44px minimum
- Inputs: `h-12` minimum
- Icons in buttons: `h-5 w-5` (1.25rem)

**Spacing**:
- Adequate spacing between interactive elements
- `gap-4` (1rem) minimum between buttons

### Typography for Mobile

**Font Sizes**:
- Page titles: `text-2xl sm:text-4xl`
- Section headings: `text-xl sm:text-2xl`
- Body: `text-sm sm:text-base`
- Small text: `text-xs`

**Line Height**:
- Use default Tailwind line heights
- `leading-relaxed` for body text
- `leading-tight` for headings

### Form Layouts for Mobile

```tsx
<form className="space-y-4">
  <FormField
    name="field"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Label</FormLabel>
        <FormControl>
          <Input 
            className="h-12 rounded-xl bg-muted border-border"
            placeholder="Placeholder"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  <Button 
    type="submit" 
    className="w-full h-12 rounded-xl bg-[#242C5A] hover:bg-[#1a2144] text-white font-bold"
  >
    Submit
  </Button>
</form>
```

### Image Handling

```tsx
<div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
  <Image
    src={imageUrl}
    alt={alt}
    fill
    className="object-cover"
  />
</div>
```

### Mobile-Specific Component Structure

```tsx
export function MobileComponent() {
  return (
    <div className="space-y-4 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#242C5A]">
            Title
          </h2>
          <p className="text-sm text-gray-400 mt-1">Description</p>
        </div>
        <Button className="w-full sm:w-auto">Action</Button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Items */}
      </div>
    </div>
  );
}
```

### Mobile Checklist

When creating mobile UI components:

- [ ] Works on 320px width (iPhone SE)
- [ ] Touch targets are at least 44x44px (h-11 minimum)
- [ ] RTL layout is correct (text-right, icons on left)
- [ ] Text is readable (minimum 14px font-size)
- [ ] Forms are usable on mobile (adequate input height)
- [ ] Tables convert to card layout on mobile
- [ ] Navigation works on mobile (hamburger menu)
- [ ] Buttons are easy to tap (h-12 minimum)
- [ ] Images are responsive (aspect-ratio, object-cover)
- [ ] No horizontal scrolling
- [ ] Loading states work properly
- [ ] Error states are clear and actionable
- [ ] Proper spacing (no cramped elements)
- [ ] Consistent with design system colors

---

## 🧩 Key Components Reference

### Shared Components

#### StatCard (`components/shared/StatCard.tsx`)
**Props**:
```typescript
{
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
}
```

**Usage**:
```tsx
<StatCard
  title="Total Sales"
  value="45,231.89 ر.س"
  icon={DollarSign}
  trend={{ value: 20.1, label: "vs last month", positive: true }}
/>
```

#### DataTable (`components/shared/DataTable.tsx`)
**Props**:
```typescript
{
  columns: ColumnDef<T>[];
  data: T[];
  searchable?: boolean;
  pagination?: boolean;
}
```

**Usage**: Uses `@tanstack/react-table` for sorting, filtering, pagination

#### OrderStatusBadge (`components/shared/OrderStatusBadge.tsx`)
**Props**:
```typescript
{
  status: OrderStatus;
  className?: string;
}
```

**Usage**: Displays order status with appropriate color

### Layout Components

#### DashboardSidebar (`components/layout/DashboardSidebar.tsx`)
**Features**:
- Dark sidebar (#1A1A27 background)
- Three sections:
  1. Main routes (Dashboard, Products, Categories, Orders, Analytics)
  2. Organization routes (Organization, Employees)
  3. Account routes (Settings, Notifications, Help)
- Active route highlighting
- User profile footer
- Mobile: Use `MobileSidebar` wrapper with Sheet

#### DashboardHeader (`components/layout/DashboardHeader.tsx`)
**Features**:
- Top bar with user menu
- Notifications dropdown
- Search (optional)
- Mobile responsive

---

## 🔧 Development Patterns

### Creating a New Page

1. Create route file in `app/(dashboard)/new-page/page.tsx`
2. If needed, add to sidebar navigation in `DashboardSidebar.tsx`
3. Use TypeScript types from `types/models.ts`
4. Follow existing component patterns
5. Ensure RTL support
6. Make mobile responsive

### Creating a Component

1. Choose appropriate folder:
   - `components/ui/` - Base UI components (shadcn/ui)
   - `components/shared/` - Reusable shared components
   - `components/features/` - Feature-specific components
   - `components/layout/` - Layout components

2. Use TypeScript:
```typescript
interface ComponentProps {
  // props
}

export function Component({ ...props }: ComponentProps) {
  return (
    // JSX
  );
}
```

3. Follow styling patterns:
- Use Tailwind classes
- Follow design system colors
- Ensure mobile responsiveness
- Test RTL layout

### Forms

1. Define Zod schema in `lib/validations.ts`:
```typescript
export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be positive"),
  // ...
});

export type ProductInput = z.infer<typeof productSchema>;
```

2. Use React Hook Form:
```tsx
const form = useForm<ProductInput>({
  resolver: zodResolver(productSchema),
  defaultValues: { /* ... */ }
});
```

3. Use shadcn/ui Form components:
```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="field"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Label</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

---

## 📚 Additional Resources

### Files to Reference

1. **design-system.json** - Complete design system documentation
2. **types/models.ts** - All TypeScript types and interfaces
3. **services/mock-data.ts** - Mock data examples
4. **components/shared/StatCard.tsx** - Example card component
5. **components/layout/DashboardSidebar.tsx** - Navigation example
6. **app/(dashboard)/dashboard/page.tsx** - Dashboard layout example

### External Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [TanStack Table](https://tanstack.com/table)
- [Recharts](https://recharts.org)

---

## 🎯 Summary for LLM Mobile UI Generation

When generating mobile UI components:

1. **Check design-system.json** for colors, spacing, typography
2. **Follow existing patterns** from the codebase
3. **Ensure RTL support** - text right-aligned, icons on left
4. **Mobile-first responsive** - start with mobile, enhance for desktop
5. **Use Tailwind breakpoints** - `sm:`, `md:`, `lg:` prefixes
6. **Follow Arabic UX patterns** - right-to-left reading
7. **Touch-friendly** - large tap targets (h-12 minimum)
8. **Consistent styling** - match existing component styles
9. **TypeScript types** - use types from `types/models.ts`
10. **Accessibility** - proper labels, ARIA attributes

**Key Colors**:
- Primary: `#242C5A`
- Sidebar: `#1A1A27`
- Background: `#FDFDFD`
- Card: `#FFFFFF`
- Border: `#E2E8F0`

**Key Patterns**:
- Cards: `rounded-3xl`, `border-gray-100`, `p-6`
- Buttons: `h-12`, `rounded-xl`, `font-bold`
- Inputs: `h-12`, `rounded-xl`, `bg-muted`
- Mobile: Convert tables to cards, use bottom sheets, floating buttons

---

**Last Updated**: 2024
**Project Version**: 1.0.0
**Framework**: Next.js 16 App Router
**Language**: TypeScript + Arabic (RTL)
