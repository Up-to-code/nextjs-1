import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || undefined;
        const categoryId = searchParams.get('categoryId') || undefined;
        const status = searchParams.get('status') as 'active' | 'inactive' | undefined;

        const result = await convex.query(api.api.getOrganizationProducts, {
            id: id as Id<'organizations'>,
            page,
            limit,
            search,
            ...(categoryId && { categoryId: categoryId as any }),
            ...(status && { status }),
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Organization products API error:', error);
        return NextResponse.json({ error: 'Failed to fetch organization products' }, { status: 500 });
    }
}
