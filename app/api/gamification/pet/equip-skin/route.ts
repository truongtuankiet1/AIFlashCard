import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { skinId } = await request.json();
        const userId = session.user.id;

        // 1. Get active pet
        const activePet = await prisma.userPet.findFirst({
            where: { userId, isActive: true }
        });

        if (!activePet) {
            return NextResponse.json({ error: 'No active pet found' }, { status: 404 });
        }

        // 2. Verify ownership (if skinId is provided, otherwise it's "unequip")
        let metadata = null;
        if (skinId) {
            const hasPurchased = await prisma.transaction.findFirst({
                where: {
                    userId,
                    itemId: skinId,
                    item: { type: 'SKIN' }
                },
                include: { item: true }
            });

            if (!hasPurchased) {
                return NextResponse.json({ error: 'You do not own this skin' }, { status: 403 });
            }
            metadata = hasPurchased.item.metadata;
        }

        // 3. Update activeOutfit
        await prisma.userPet.update({
            where: { id: activePet.id },
            data: {
                activeOutfit: metadata as any
            }
        });

        return NextResponse.json({ success: true, message: 'Skin equipped successfully' });

    } catch (error: any) {
        console.error('Equip skin error:', error);
        return NextResponse.json(
            { error: 'Failed to equip skin' },
            { status: 500 }
        );
    }
}
