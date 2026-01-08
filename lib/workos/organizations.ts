import { WorkOS } from '@workos-inc/node';

// Initialize WorkOS client (server-side only)
const workos = new WorkOS(process.env.WORKOS_API_KEY!);

// Organization interface matching WorkOS
export interface WorkOSOrganization {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    domains?: { domain: string; state: string }[];
    externalId?: string;
    metadata?: Record<string, string>;
}

/**
 * Create a new organization
 */
export async function createOrganization(data: {
    name: string;
    externalId?: string;
    metadata?: Record<string, string>;
}): Promise<WorkOSOrganization> {
    const organization = await workos.organizations.createOrganization({
        name: data.name,
        externalId: data.externalId,
        metadata: data.metadata,
    });

    return organization as WorkOSOrganization;
}

/**
 * Get an organization by ID
 */
export async function getOrganization(organizationId: string): Promise<WorkOSOrganization> {
    const organization = await workos.organizations.getOrganization(organizationId);
    return organization as WorkOSOrganization;
}

/**
 * Update an existing organization
 */
export async function updateOrganization(
    organizationId: string,
    data: {
        name?: string;
        externalId?: string;
        metadata?: Record<string, string>;
    }
): Promise<WorkOSOrganization> {
    const organization = await workos.organizations.updateOrganization({
        organization: organizationId,
        name: data.name,
        externalId: data.externalId,
        metadata: data.metadata,
    });

    return organization as WorkOSOrganization;
}

/**
 * List all organizations
 */
export async function listOrganizations(): Promise<WorkOSOrganization[]> {
    const result = await workos.organizations.listOrganizations();
    return result.data as WorkOSOrganization[];
}

/**
 * Delete an organization
 */
export async function deleteOrganization(organizationId: string): Promise<void> {
    await workos.organizations.deleteOrganization(organizationId);
}

/**
 * Add a user to an organization with a role
 */
export async function addUserToOrganization(
    userId: string,
    organizationId: string,
    role?: 'owner' | 'admin' | 'member'
): Promise<void> {
    await workos.userManagement.createOrganizationMembership({
        userId,
        organizationId,
        roleSlug: role || 'admin', // Default to admin for organization creator
    });
}

/**
 * Get user's organization memberships
 */
export async function getUserOrganizations(userId: string) {
    const result = await workos.userManagement.listOrganizationMemberships({
        userId,
    });
    return result.data;
}

/**
 * Check if user already has an organization
 */
export async function userHasOrganization(userId: string): Promise<boolean> {
    try {
        const memberships = await getUserOrganizations(userId);
        return memberships.length > 0;
    } catch (error) {
        console.error('Error checking user organizations:', error);
        return false;
    }
}

/**
 * Get user's organization membership with role
 */
export async function getUserOrganizationMembership(userId: string) {
    try {
        const memberships = await getUserOrganizations(userId);
        if (memberships.length === 0) {
            return null;
        }
        // Return the first organization (user can only have one)
        return {
            organizationId: memberships[0].organizationId,
            role: (memberships[0] as any).role?.slug || (memberships[0] as any).roleSlug || 'member',
            membership: memberships[0],
        };
    } catch (error) {
        console.error('Error getting user organization membership:', error);
        return null;
    }
}

/**
 * List all members of an organization
 */
export async function listOrganizationMembers(organizationId: string) {
    const result = await workos.userManagement.listOrganizationMemberships({
        organizationId,
    });
    return result.data;
}

/**
 * Get a user by ID
 */
/**
 * Get a user by ID
 */
export async function getUser(userId: string) {
    return workos.userManagement.getUser(userId);
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string) {
    const result = await workos.userManagement.listUsers({
        email,
        limit: 1,
    });
    return result.data[0] || null;
}

/**
 * Create a new user
 */
export async function createUser(email: string, firstName?: string, lastName?: string) {
    return workos.userManagement.createUser({
        email,
        firstName,
        lastName,
        emailVerified: true, // Auto-verify for simplicity in this flow, or false
    });
}
