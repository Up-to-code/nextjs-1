import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// POST /api/webhooks/orders - Handle order creation webhook
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate webhook structure
        if (!body.event || body.event !== 'order.created') {
            return NextResponse.json({ error: 'Invalid or unsupported event type' }, { status: 400 });
        }

        if (!body.customer) {
            return NextResponse.json({ error: 'customer data is required' }, { status: 400 });
        }

        if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
            return NextResponse.json({ error: 'items array is required and must not be empty' }, { status: 400 });
        }

        if (!body.customer.name || !body.customer.email || !body.customer.phone) {
            return NextResponse.json({ error: 'customer must have name, email, and phone' }, { status: 400 });
        }

        const result = await convex.mutation(api.webhooks.processOrderWebhook, {
            event: body.event,
            timestamp: body.timestamp || Date.now(),
            customer: {
                name: body.customer.name,
                email: body.customer.email,
                phone: body.customer.phone,
                address: body.customer.address,
                city: body.customer.city,
            },
            items: body.items,
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error('Order webhook error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to process webhook' }, { status: 500 });
    }
}
