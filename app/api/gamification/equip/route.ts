import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { petId } = await request.json();
        const userId = session.user.id;

        if (!petId) {
            return NextResponse.json({ error: 'Pet ID is required' }, { status: 400 });
        }

        // 1. Check if user owns this pet
        const userPet = await prisma.userPet.findFirst({
            where: { userId, petId }
        });

        if (!userPet) {
            return NextResponse.json({ error: 'You do not own this pet' }, { status: 403 });
        }

        // 2. Un-equip current active pet and equip the new one in a transaction using raw SQL
        await prisma.$transaction([
            prisma.$executeRaw`UPDATE "UserPet" SET "isActive" = false WHERE "userId" = ${userId} AND "isActive" = true`,
            prisma.$executeRaw`UPDATE "UserPet" SET "isActive" = true WHERE "userId" = ${userId} AND "petId" = ${petId}`
        ]);

        return NextResponse.json({ success: true, message: 'Pet equipped successfully' });

    } catch (error: any) {
        console.error('Equip pet error:', error);
        return NextResponse.json(
            { error: 'Failed to equip pet' },
            { status: 500 }
        );
    }
}
