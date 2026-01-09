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
        const result = await convex.query(api.api.getOrganization, {
            id: id as Id<'organizations'>,
        });

        if (!result) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        return NextResponse.json({ data: result });
    } catch (error) {
        console.error('Organization API error:', error);
        return NextResponse.json({ error: 'Failed to fetch organization' }, { status: 500 });
    }
}
