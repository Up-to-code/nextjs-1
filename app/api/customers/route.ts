import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// GET /api/customers - Get customer with orders
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const customerId = searchParams.get('customerId');

        if (!customerId) {
            return NextResponse.json({ error: 'customerId is required' }, { status: 400 });
        }

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const result = await convex.query(api.api.getCustomerWithOrders, {
            customerId: customerId as Id<'customers'>,
            page,
            limit,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Customer get API error:', error);
        if (error.message?.includes('not found')) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
    }
}

// POST /api/customers - Find or create customer
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result = await convex.mutation(api.api.findOrCreateCustomer, {
            customerId: body.customerId,
            email: body.email,
            name: body.name,
            phone: body.phone,
            address: body.address,
            city: body.city,
        });

        return NextResponse.json(result, { status: result.created ? 201 : 200 });
    } catch (error: any) {
        console.error('Customer create API error:', error);
        return NextResponse.json({ error: error.message || 'Failed to process customer' }, { status: 500 });
    }
}
