import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // 1. Get active pet
        const activePet = await prisma.userPet.findFirst({
            where: { userId, isActive: true },
            include: { pet: true }
        });

        if (!activePet) {
            return NextResponse.json({ error: 'No active pet found' }, { status: 404 });
        }

        // 2. Fetch all purchased SKINS from transactions
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                type: 'PURCHASE',
                item: {
                    type: 'SKIN'
                }
            },
            include: {
                item: true
            }
        });

        // 3. Extract unique list of skins
        const uniqueSkins = Array.from(new Set(transactions.map(t => t.itemId)))
            .map(id => transactions.find(t => t.itemId === id)?.item);

        return NextResponse.json({
            activeOutfit: activePet.activeOutfit,
            skins: uniqueSkins
        });

    } catch (error: any) {
        console.error('Inventory fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch inventory' },
            { status: 500 }
        );
    }
}
