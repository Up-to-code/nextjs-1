import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// GET /api/orders/[id] - Get specific order
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;
        const customerId = searchParams.get('customerId');

        if (!customerId) {
            return NextResponse.json({ error: 'customerId is required' }, { status: 400 });
        }

        const result = await convex.query(api.api.getOrder, {
            id: id as Id<'orders'>,
            customerId: customerId as Id<'customers'>,
        });

        return NextResponse.json({ data: result });
    } catch (error: any) {
        console.error('Order get API error:', error);
        if (error.message?.includes('not found') || error.message?.includes('Access denied')) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (!body.customerId) {
            return NextResponse.json({ error: 'customerId is required' }, { status: 400 });
        }
        if (!body.status) {
            return NextResponse.json({ error: 'status is required' }, { status: 400 });
        }

        const result = await convex.mutation(api.api.updateOrderStatus, {
            id: id as Id<'orders'>,
            customerId: body.customerId as Id<'customers'>,
            status: body.status,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Order update API error:', error);
        if (error.message?.includes('not found') || error.message?.includes('Access denied')) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

// DELETE /api/orders/[id] - Cancel order
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;
        const customerId = searchParams.get('customerId');

        if (!customerId) {
            return NextResponse.json({ error: 'customerId is required' }, { status: 400 });
        }

        const result = await convex.mutation(api.api.cancelOrder, {
            id: id as Id<'orders'>,
            customerId: customerId as Id<'customers'>,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Order cancel API error:', error);
        if (error.message?.includes('not found') || error.message?.includes('Access denied') || error.message?.includes('Cannot cancel')) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
    }
}
