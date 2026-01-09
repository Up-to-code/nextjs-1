import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// GET /api/orders - List orders for a customer
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const customerId = searchParams.get('customerId');

        if (!customerId) {
            return NextResponse.json({ error: 'customerId is required' }, { status: 400 });
        }

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const status = searchParams.get('status') as 'pending' | 'processing' | 'completed' | 'cancelled' | undefined;

        const result = await convex.query(api.api.listOrders, {
            customerId: customerId as Id<'customers'>,
            page,
            limit,
            ...(status && { status }),
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Orders list API error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.customerId) {
            return NextResponse.json({ error: 'customerId is required' }, { status: 400 });
        }
        if (!body.orgId) {
            return NextResponse.json({ error: 'orgId is required' }, { status: 400 });
        }
        if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
            return NextResponse.json({ error: 'items array is required and must not be empty' }, { status: 400 });
        }

        const result = await convex.mutation(api.api.createOrder, {
            customerId: body.customerId as Id<'customers'>,
            orgId: body.orgId,
            items: body.items,
        });

        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error) {
        console.error('Orders create API error:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
