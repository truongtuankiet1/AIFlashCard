import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db';
import { purchaseItem } from '@/app/lib/services/gamification';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const shopItems = await prisma.shopItem.findMany({
            include: { pet: true }
        });

        return NextResponse.json({ items: shopItems });
    } catch (error: any) {
        return NextResponse.json(
            { error: `Failed to fetch shop items: ${error.message}` },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { itemId } = await request.json();

        if (!itemId) {
            return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
        }

        const result = await purchaseItem(session.user.id, itemId);

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { error: `Purchase failed: ${error.message}` },
            { status: 500 }
        );
    }
}
