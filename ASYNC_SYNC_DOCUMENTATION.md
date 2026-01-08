# Async Sync System - WorkOS & Convex

## Overview

The organization sync system allows users to toggle automatic synchronization between WorkOS and Convex databases, with manual sync option and status indicators.

## Features

### 1. Auto-Sync Toggle

**Toggle Switch:**
- Enable/disable automatic synchronization
- Default: **Enabled** (autoSyncEnabled = true)
- Controls whether changes sync to Convex automatically

**Location:** Organization page, sync settings section

### 2. Manual Sync Button

**Manual Sync:**
- "مزامنة يدوية الآن" button
- Syncs WorkOS → Convex immediately
- Works regardless of auto-sync toggle state
- Shows loading state during sync

### 3. Sync Status Indicators

**Status Types:**
- ✅ **Synced** (متزامنة) - Green checkmark, data is in sync
- 🔄 **Pending** (جاري المزامنة) - Blue spinner, sync in progress
- ⚠️ **Differences** (يوجد اختلافات) - Yellow warning, needs sync

### 4. Database Comparison

**Convex Query: `compareWithWorkOS`**
- Compares WorkOS data with Convex data
- Returns differences if any
- Identifies fields that need syncing

## Implementation

### Sync Settings UI

```typescript
// Sync Settings Section
<div className="bg-gray-50 border border-gray-100 rounded-xl p-6 space-y-4">
    {/* Toggle Switch */}
    <Switch
        checked={autoSyncEnabled}
        onCheckedChange={setAutoSyncEnabled}
    />
    
    {/* Status Indicator */}
    {syncStatus === 'synced' && <CheckCircle2 />}
    {isSyncing && <Loader2 className="animate-spin" />}
    
    {/* Manual Sync Button */}
    <Button onClick={handleManualSync}>
        <RefreshCw />
        مزامنة يدوية الآن
    </Button>
</div>
```

### Auto-Sync Logic

**When Auto-Sync Triggers:**
1. When `autoSyncEnabled` is true
2. After organization data changes
3. On page load (if organization exists)
4. After save operations (if enabled)

**Auto-Sync Function:**
```typescript
const handleAutoSync = async () => {
    if (!hasOrg || !organization?.id || isSyncing) return;
    
    setIsSyncing(true);
    const result = await manualSyncOrganization(organization.id);
    
    if (result.success) {
        // Sync to Convex silently
        await syncOrg({...});
        setSyncStatus('synced');
    }
    
    setIsSyncing(false);
};
```

### Manual Sync Logic

**Manual Sync Function:**
```typescript
const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatus('pending');
    
    // Get data from WorkOS
    const result = await manualSyncOrganization(organization.id);
    
    // Sync to Convex
    await syncOrg(result.data);
    
    // Update local store
    updateOrganization(result.data);
    
    setSyncStatus('synced');
    toast.success("تمت المزامنة بنجاح");
};
```

### Save Operations with Auto-Sync

**Update Organization:**
```typescript
// After WorkOS update
if (autoSyncEnabled) {
    syncOrg({
        workosOrgId: org.id,
        name: org.name,
        // ... other fields
    }).catch(err => {
        console.error("Sync failed (non-blocking):", err);
    });
}
```

**Create Organization:**
```typescript
// After WorkOS create
if (autoSyncEnabled) {
    syncOrg({
        workosOrgId: org.id,
        name: org.name,
        // ... other fields
    }).catch(err => {
        console.error("Sync failed (non-blocking):", err);
    });
}
```

## Database Comparison

### Convex Query: `compareWithWorkOS`

**Purpose:** Compare WorkOS and Convex data to detect differences

**Returns:**
```typescript
{
    needsSync: boolean,
    differences: {
        name?: { workos: string, convex: string },
        email?: { workos: string, convex: string },
        // ... other fields
    },
    convexOrg: Organization | null
}
```

**Usage:**
```typescript
const comparison = await compareWithWorkOS({
    workosOrgId: 'org_123',
    workosData: {
        name: 'Org Name',
        email: 'email@example.com',
        // ...
    }
});

if (comparison.needsSync) {
    // Sync differences
}
```

## User Flow

### Scenario 1: Auto-Sync Enabled (Default)

1. User updates organization
2. WorkOS updates immediately
3. Auto-sync triggers (if enabled)
4. Convex syncs in background
5. Status shows "متزامنة" when complete

### Scenario 2: Auto-Sync Disabled

1. User updates organization
2. WorkOS updates immediately
3. Convex does NOT sync automatically
4. User can manually sync using button
5. Status updates after manual sync

### Scenario 3: Manual Sync

1. User clicks "مزامنة يدوية الآن"
2. System fetches latest from WorkOS
3. Syncs to Convex
4. Updates local store
5. Shows success message

## State Management

### State Variables

```typescript
const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);
const [isSyncing, setIsSyncing] = useState<boolean>(false);
const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | null>(null);
```

### Sync Status Flow

```
null → pending → synced
  ↑                ↓
  └────────────────┘ (on error)
```

## Error Handling

### Auto-Sync Errors
- Non-blocking (doesn't show error to user)
- Logs to console
- Doesn't interrupt user flow

### Manual Sync Errors
- Shows error toast
- Reverts status to null
- User can retry

## Benefits

1. **User Control** - Toggle auto-sync on/off
2. **Data Consistency** - Ensures WorkOS and Convex stay in sync
3. **Performance** - Non-blocking sync doesn't slow down UI
4. **Transparency** - Status indicators show sync state
5. **Flexibility** - Manual sync available anytime

## Future Enhancements

1. **Sync History** - Track sync operations
2. **Conflict Resolution** - Handle conflicts between DBs
3. **Bidirectional Sync** - Sync Convex → WorkOS changes
4. **Sync Scheduling** - Schedule periodic syncs
5. **Sync Analytics** - Show sync frequency and success rate

---

**Result:** Users can now control organization sync with a toggle, manually sync when needed, and see sync status in real-time.
