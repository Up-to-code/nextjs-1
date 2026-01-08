# Organization Limits & Role System

## Overview

Users can create **only one organization maximum**. Each user has a role in their organization that determines their permissions.

## Features Implemented

### 1. One Organization Per User Limit

**Enforcement:**
- ✅ Server-side validation in `createOrganizationAction`
- ✅ Client-side check before allowing creation
- ✅ UI prevents creating if user already has an organization
- ✅ Error messages in Arabic

**Implementation:**

```typescript
// Check if user already has an organization
const hasOrg = await userHasOrganization(user.id);
if (hasOrg) {
    return { 
        success: false, 
        error: 'لديك منشأة بالفعل. يمكنك إنشاء منشأة واحدة فقط.' 
    };
}
```

### 2. Role System

**Available Roles:**
- **owner** (مالك) - Organization creator, full permissions
- **admin** (مدير) - Administrator, can manage organization
- **member** (عضو) - Regular member, limited permissions

**Role Assignment:**
- When user creates an organization, they automatically get `owner` role
- Roles can be edited in the future (ready for future implementation)

**Role Display:**
- Role badge shown next to organization name
- Color-coded badges (owner = primary, admin/member = secondary)
- Shield icon indicates role

### 3. Database Schema

**New Table: `organizationMemberships`**

```typescript
organizationMemberships: defineTable({
    userId: v.id('users'),
    organizationId: v.id('organizations'),
    workosOrgId: v.string(),
    workosMembershipId: v.optional(v.string()),
    
    role: v.union(
        v.literal('owner'),
        v.literal('admin'),
        v.literal('member')
    ),
    
    status: v.union(v.literal('active'), v.literal('inactive')),
    
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
})
```

**Indexes:**
- `by_user` - Get user's organization membership
- `by_organization` - Get all members of an organization
- `by_user_and_org` - Check specific user-org relationship
- `by_role` - Filter by role

## API Functions

### Check if User Can Create Organization

```typescript
// app/actions/organization.ts
export async function canCreateOrganization() {
    const { user } = await withAuth({ ensureSignedIn: true });
    const hasOrg = await userHasOrganization(user.id);
    
    return { 
        canCreate: !hasOrg,
        error: hasOrg ? 'لديك منشأة بالفعل' : null
    };
}
```

### Get User's Organization with Role

```typescript
export async function getUserOrganizationWithRole() {
    const { user } = await withAuth({ ensureSignedIn: true });
    const membership = await getUserOrganizationMembership(user.id);
    
    return {
        organization: membership?.organization,
        role: membership?.role, // 'owner' | 'admin' | 'member'
    };
}
```

### WorkOS Functions

```typescript
// lib/workos/organizations.ts

// Check if user has organization
export async function userHasOrganization(userId: string): Promise<boolean>

// Get user's organization membership with role
export async function getUserOrganizationMembership(userId: string)

// Add user to organization with role
export async function addUserToOrganization(
    userId: string,
    organizationId: string,
    role?: 'owner' | 'admin' | 'member'
)
```

## UI Features

### Organization Page

1. **Role Badge Display**
   - Shows user's role next to organization name
   - Color-coded: owner (primary), admin/member (secondary)
   - Shield icon for visual indication

2. **Create Limit Warning**
   - Yellow alert box if user tries to create when they already have one
   - Disables create button
   - Clear Arabic error message

3. **Validation**
   - Prevents creating if user already has organization
   - Shows error toast if attempted
   - Server-side validation as backup

## Usage Examples

### Check Before Creating

```typescript
// Client component
const { canCreate, error } = await canCreateOrganization();

if (!canCreate) {
    toast.error(error);
    return;
}

// Proceed with creation
```

### Get User's Role

```typescript
// Server component
const { organization, role } = await getUserOrganizationWithRole();

if (role === 'owner') {
    // Show owner-only features
} else if (role === 'admin') {
    // Show admin features
} else {
    // Show member features
}
```

### Display Role Badge

```typescript
<Badge variant={role === 'owner' ? 'default' : 'secondary'}>
    <Shield className="h-3 w-3 ml-1" />
    {role === 'owner' ? 'مالك' : role === 'admin' ? 'مدير' : 'عضو'}
</Badge>
```

## Future Enhancements

### Role Management (Ready for Implementation)

The schema and structure are ready for:
- ✅ Editing user roles in organization
- ✅ Adding/removing members
- ✅ Role-based permissions
- ✅ Transferring ownership

**Example Future Function:**

```typescript
// Future: Update user role
export async function updateUserRole(
    userId: string,
    organizationId: string,
    newRole: 'owner' | 'admin' | 'member'
) {
    // Update WorkOS membership
    await workos.userManagement.updateOrganizationMembership({
        organizationMembership: membershipId,
        roleSlug: newRole,
    });
    
    // Update Convex
    await syncMembershipRole(userId, organizationId, newRole);
}
```

## Error Messages (Arabic)

- **Already has organization:** "لديك منشأة بالفعل. يمكنك إنشاء منشأة واحدة فقط."
- **Cannot create:** "لا يمكنك إنشاء منشأة جديدة"
- **Role display:** 
  - owner: "مالك"
  - admin: "مدير"
  - member: "عضو"

## Testing Checklist

- [ ] User can create one organization
- [ ] User cannot create second organization
- [ ] Error message shows when trying to create second
- [ ] Role badge displays correctly
- [ ] Owner role assigned on creation
- [ ] UI prevents creating if already has org
- [ ] Server validation works as backup
- [ ] Role information syncs to Convex

## Files Modified

1. **lib/workos/organizations.ts**
   - Added `userHasOrganization()`
   - Added `getUserOrganizationMembership()`
   - Updated `addUserToOrganization()` to accept role

2. **app/actions/organization.ts**
   - Added `canCreateOrganization()`
   - Added `getUserOrganizationWithRole()`
   - Updated `createOrganizationAction()` to check limit
   - Assigns 'owner' role on creation

3. **app/(dashboard)/organization/page.tsx**
   - Added role display badge
   - Added create limit warning
   - Added validation before creating

4. **convex/schema.ts**
   - Added `organizationMemberships` table
   - Added role field and indexes

---

**Result:** Users can now create only one organization, and each user has a role (owner/admin/member) that can be edited in the future.
