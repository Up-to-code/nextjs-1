import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || undefined;
        const orgId = searchParams.get('orgId') || undefined;
        const status = searchParams.get('status') as 'active' | 'inactive' | undefined;

        const result = await convex.query(api.api.listCategories, {
            page,
            limit,
            search,
            orgId,
            ...(status && { status }),
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Categories API error:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
