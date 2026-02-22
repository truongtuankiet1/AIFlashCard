import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { action } = await request.json();
        const userId = session.user.id;

        // Get active pet
        const activePet = await prisma.userPet.findFirst({
            where: { userId, isActive: true },
            include: { pet: true }
        });

        if (!activePet) {
            return NextResponse.json({ error: 'No active pet found' }, { status: 404 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { coins: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        let updateData: any = {};
        let coinCost = 0;
        let message = '';

        if (action === 'FEED') {
            coinCost = 50;
            if (Number(user.coins) < coinCost) {
                return NextResponse.json({ error: 'Insufficient coins' }, { status: 400 });
            }
            updateData = {
                hunger: { increment: 30 },
                mood: { increment: 10 },
                affection: { increment: 2 }
            };
            message = 'Yum! Your pet is happy and full! 🍎';
        } else if (action === 'PAT') {
            // Free action, maybe add a cooldown later
            updateData = {
                mood: { increment: 5 },
                affection: { increment: 1 }
            };
            message = 'Your pet loves the attention! ❤️';
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Clamp stats at 100 in the database level or application level? 
        // Prisma increment doesn't clamp easily. We'll do a raw update for better control if needed, 
        // but for now let's just use increment and handle caps in UI/logic.

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            if (coinCost > 0) {
                await tx.$executeRaw`UPDATE "User" SET "coins" = "coins" - ${BigInt(coinCost)} WHERE "id" = ${userId}`;
            }

            const updatedPet = await tx.userPet.update({
                where: { id: activePet.id },
                data: updateData
            });

            // Ensure stats don't exceed 100 (though affection can go higher)
            if (updatedPet.hunger > 100 || updatedPet.mood > 100) {
                await tx.userPet.update({
                    where: { id: activePet.id },
                    data: {
                        hunger: Math.min(100, updatedPet.hunger),
                        mood: Math.min(100, updatedPet.mood)
                    }
                });
            }
        });

        return NextResponse.json({ success: true, message });

    } catch (error: any) {
        console.error('Pet interaction error:', error);
        return NextResponse.json(
            { error: 'Failed to interact with pet' },
            { status: 500 }
        );
    }
}
