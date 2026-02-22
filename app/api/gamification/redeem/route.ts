import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { code } = await request.json();
        const userId = session.user.id;

        if (!code) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        const cleanCode = code.trim().toLowerCase();

        // Secret codes
        const validCodes = ['kiet', 'nttn'];

        if (validCodes.includes(cleanCode)) {
            const rewardAmount = BigInt(6767676767);

            // Update user balance using raw query to bypass outdated Prisma Client
            await prisma.$executeRaw`
                UPDATE "User"
                SET "coins" = "coins" + ${rewardAmount}
                WHERE "id" = ${userId}
            `;

            return NextResponse.json({
                success: true,
                message: `Congratulations! You redeemed ${rewardAmount.toString()} coins! 💰✨`,
                reward: rewardAmount.toString()
            });
        }

        return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });

    } catch (error: any) {
        console.error('CRITICAL REDEEM ERROR:', error);
        return NextResponse.json(
            { error: `Failed to redeem code: ${error.message}` },
            { status: 500 }
        );
    }
}
