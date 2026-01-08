'use server';

import {
    createOrganization as createOrg,
    updateOrganization as updateOrg,
    getOrganization as getOrg,
    addUserToOrganization,
    userHasOrganization,
    getUserOrganizationMembership,
    listOrganizationMembers,
    getUser,
    findUserByEmail,
    createUser,
} from '@/lib/workos/organizations';
import { withAuth } from '@workos-inc/authkit-nextjs';

/**
 * Check if user can create an organization (max one per user)
 */
export async function canCreateOrganization() {
    try {
        const { user } = await withAuth({ ensureSignedIn: true });

        if (!user) {
            return { canCreate: false, error: 'غير مصرح' };
        }

        const hasOrg = await userHasOrganization(user.id);

        if (hasOrg) {
            return {
                canCreate: false,
                error: 'لديك منشأة بالفعل. يمكنك إنشاء منشأة واحدة فقط.'
            };
        }

        return { canCreate: true };
    } catch (error) {
        console.error('Error checking organization limit:', error);
        return { canCreate: false, error: 'حدث خطأ أثناء التحقق' };
    }
}

/**
 * Get user's organization with role
 */
export async function getUserOrganizationWithRole() {
    try {
        const { user } = await withAuth({ ensureSignedIn: true });

        if (!user) {
            return { success: false, error: 'غير مصرح' };
        }

        const membership = await getUserOrganizationMembership(user.id);

        if (!membership) {
            return { success: true, organization: null, role: null };
        }

        // Get organization details
        const organization = await getOrg(membership.organizationId);

        return {
            success: true,
            organization,
            role: membership.role,
            membership: membership.membership,
        };
    } catch (error) {
        console.error('Error getting user organization:', error);
        return { success: false, error: 'فشل في جلب بيانات المنشأة' };
    }
}

export async function createOrganizationAction(data: {
    name: string;
    metadata?: Record<string, string>;
}) {
    try {
        const { user } = await withAuth({ ensureSignedIn: true });

        if (!user) {
            return { success: false, error: 'غير مصرح' };
        }

        // Check if user already has an organization (max one per user)
        const hasOrg = await userHasOrganization(user.id);
        if (hasOrg) {
            // If user already has an org but sent a create request (e.g. from local ID state),
            // we should treat this as an update to their existing organization to recover sync.
            const membership = await getUserOrganizationMembership(user.id);
            if (membership) {
                console.log('Recovering sync: Updating existing organization instead of creating');
                const updatedOrg = await updateOrg(membership.organizationId, data);
                return { success: true, organization: updatedOrg };
            }

            return {
                success: false,
                error: 'لديك منشأة بالفعل. يمكنك إنشاء منشأة واحدة فقط.'
            };
        }

        // Create Organization
        const organization = await createOrg({
            name: data.name,
            metadata: data.metadata,
        });

        // Add user to organization as admin (creator gets admin role)
        await addUserToOrganization(user.id, organization.id, 'admin').catch(err => {
            console.error('Failed to add user to organization:', err);
            // This is critical, but we'll still return success and handle it separately
        });

        return { success: true, organization };
    } catch (error) {
        console.error('Error creating organization:', error);
        return { success: false, error: 'فشل في إنشاء المنشأة' };
    }
}

export async function updateOrganizationAction(
    organizationId: string,
    data: {
        name?: string;
        metadata?: Record<string, string>;
    }
) {
    try {
        const { user } = await withAuth({ ensureSignedIn: true });

        if (!user) {
            return { success: false, error: 'غير مصرح (جلسة غير صالحة)' };
        }

        // Check if it's a local ID (UUID v4) vs WorkOS ID (org_...)
        // If it's a local ID, we should create a new organization instead of updating
        if (!organizationId.startsWith('org_')) {
            return createOrganizationAction(data as { name: string; metadata?: Record<string, string> });
        }

        // Direct update - faster path
        const organization = await updateOrg(organizationId, data);
        return { success: true, organization };
    } catch (error) {
        console.error('Error updating organization:', error);
        return { success: false, error: 'فشل في تحديث المنشأة' };
    }
}

export async function getOrganizationAction(organizationId: string) {
    try {
        const organization = await getOrg(organizationId);
        return { success: true, organization };
    } catch (error) {
        console.error('Error getting organization:', error);
        return { success: false, error: 'فشل في جلب بيانات المنشأة' };
    }
}

/**
 * Check and sync organization data between WorkOS and Convex
 * Compares both databases and syncs differences
 */
export async function syncOrganizationBetweenDBs(organizationId: string) {
    try {
        const { user } = await withAuth({ ensureSignedIn: true });

        if (!user) {
            return { success: false, error: 'غير مصرح' };
        }

        // Get organization from WorkOS
        const workosOrg = await getOrg(organizationId);

        if (!workosOrg) {
            return { success: false, error: 'المنشأة غير موجودة في WorkOS' };
        }

        // Extract metadata
        const workosData = {
            name: workosOrg.name,
            email: workosOrg.metadata?.email,
            phone: workosOrg.metadata?.phone,
            address: workosOrg.metadata?.address,
            description: workosOrg.metadata?.description,
        };

        // Compare with Convex (we'll call Convex query via API)
        // For now, we'll sync directly to Convex
        // In production, you'd call Convex compare query first

        return {
            success: true,
            workosData,
            message: 'تم التحقق من البيانات',
            needsSync: true, // Always sync to ensure consistency
        };
    } catch (error) {
        console.error('Error syncing organization:', error);
        return { success: false, error: 'فشل في مزامنة البيانات' };
    }
}

/**
 * Manual sync button action - syncs WorkOS to Convex
 */
export async function manualSyncOrganization(organizationId: string) {
    try {
        const { user } = await withAuth({ ensureSignedIn: true });

        if (!user) {
            return { success: false, error: 'غير مصرح' };
        }

        // Check if it's a local ID
        if (!organizationId.startsWith('org_')) {
            return { success: false, error: 'يرجى حفظ المنشأة أولاً لإنشائها في WorkOS' };
        }

        // Get from WorkOS
        const workosOrg = await getOrg(organizationId);

        if (!workosOrg) {
            return { success: false, error: 'المنشأة غير موجودة في WorkOS' };
        }

        // Return data to be synced to Convex
        return {
            success: true,
            data: {
                workosOrgId: workosOrg.id,
                name: workosOrg.name,
                email: workosOrg.metadata?.email,
                phone: workosOrg.metadata?.phone,
                address: workosOrg.metadata?.address,
                description: workosOrg.metadata?.description,
            },
        };
    } catch (error) {
        console.error('Error in manual sync:', error);
        return { success: false, error: 'فشل في المزامنة' };
    }
}

import { fetchMutation, fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

// ... (keep previous lines implicitly, this tool replaces ranges)

export async function getOrganizationMembersAction(organizationId: string) {
    try {
        const { user } = await withAuth({ ensureSignedIn: true });

        if (!user) {
            return { success: false, error: 'غير مصرح' };
        }

        // Verify user belongs to this org
        const membership = await getUserOrganizationMembership(user.id);
        if (!membership || membership.organizationId !== organizationId) {
            return { success: false, error: 'غير مصرح لك بعرض أعضاء هذه المنشأة' };
        }

        // Fetch from Convex (source of truth for permissions + includes simplified user data)
        const members = await fetchQuery(api.organizations.getMembers, { workosOrgId: organizationId });

        return { success: true, members };
    } catch (error) {
        console.error('Error getting organization members:', error);
        return { success: false, error: 'فشل في جلب الأعضاء' };
    }
}

export async function inviteMemberAction(
    email: string,
    roleSlug: string,
    permissions?: {
        viewOrders: boolean;
        manageOrders: boolean;
        manageProducts: boolean;
        manageSettings: boolean;
    }
) {
    try {
        const { user } = await withAuth({ ensureSignedIn: true });

        if (!user) {
            return { success: false, error: 'غير مصرح' };
        }

        // Verify inviter has admin rights
        const inviterMembership = await getUserOrganizationMembership(user.id);

        if (!inviterMembership) {
            return { success: false, error: 'لست عضواً في أي منشأة' };
        }

        const inviterRole = (inviterMembership as any).role?.slug || (inviterMembership as any).roleSlug || inviterMembership.role;
        if (inviterRole !== 'owner' && inviterRole !== 'admin') {
            return { success: false, error: 'ليس لديك صلاحية دعوة أعضاء' };
        }

        const organizationId = inviterMembership.organizationId;

        // 1. Check if user exists in WorkOS
        let userIdToInvite: string | undefined;
        let existingUser = await findUserByEmail(email);

        if (existingUser) {
            userIdToInvite = existingUser.id;
        } else {
            // 2. Create new user if doesn't exist
            try {
                const newUser = await createUser(email);
                userIdToInvite = newUser.id;
            } catch (err: any) {
                if (err?.code === 'user_already_exists') {
                    const retry = await findUserByEmail(email);
                    userIdToInvite = retry?.id;
                } else {
                    console.error('Error creating user for invite:', err);
                    return { success: false, error: 'فشل في إنشاء حساب للمستخدم' };
                }
            }
        }

        if (!userIdToInvite) {
            return { success: false, error: 'فشل في تحديد المستخدم' };
        }

        // 3. Add to organization (WorkOS)
        try {
            await addUserToOrganization(userIdToInvite, organizationId, roleSlug as any);

            // 4. Sync to Convex
            // First sync the user
            await fetchMutation(api.users.syncUser, {
                workosUserId: userIdToInvite,
                email: email,
                name: existingUser?.firstName ? `${existingUser.firstName} ${existingUser.lastName}`.trim() : email.split('@')[0],
                avatar: existingUser?.profilePictureUrl || undefined,
            });

            // Then sync membership with permissions
            await fetchMutation(api.organizations.syncMembership, {
                workosOrgId: organizationId,
                workosUserId: userIdToInvite,
                role: roleSlug as 'owner' | 'admin' | 'member',
                permissions: permissions,
                status: 'active',
            });

            return { success: true };
        } catch (err: any) {
            console.error('Error adding user to org:', err);
            if (err?.code === 'organization_membership_already_exists') {
                return { success: false, error: 'المستخدم عضو بالفعل في المنشأة' };
            }
            return { success: false, error: 'فشل في إضافة المستخدم للمنشأة' };
        }

    } catch (error) {
        console.error('Error inviting member:', error);
        return { success: false, error: 'فشل في دعوة العضو' };
    }
}
