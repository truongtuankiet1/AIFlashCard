import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db';
import { initializeMissions } from '@/app/lib/services/gamification';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            console.warn('[GAMIFICATION] Unauthorized access attempt to /status');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        console.log(`[GAMIFICATION] Fetching status for userId: ${userId} (${session.user.email})`);
        const now = new Date();

        // 1. Ensure missions are initialized for the user
        await initializeMissions(userId);

        // 2. Fetch User Data
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                userPets: {
                    include: { pet: true }
                },
                userMissions: {
                    where: {
                        resetAt: { gt: now }
                    },
                    include: { mission: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        let activePet = user.userPets.find((up: any) => up.isActive) || null;

        // 3. Auto-assign logic
        if (user.userPets.length === 0) {
            const starterPet = await prisma.pet.findFirst({ where: { id: 'pet_cat' } });
            if (starterPet) {
                activePet = await prisma.userPet.create({
                    data: {
                        userId,
                        petId: starterPet.id,
                        isActive: true,
                        level: 1,
                        exp: 0,
                    },
                    include: { pet: true }
                });
            }
        } else if (!activePet) {
            // User owns pets but none are active (happens if previous active pet was deleted)
            activePet = await prisma.userPet.update({
                where: { id: user.userPets[0].id },
                data: { isActive: true },
                include: { pet: true }
            });
            // Update the local list to reflect this change for ownedPetIds
            (user.userPets[0] as any).isActive = true;
        }

        // Fetch coins using raw query since the Prisma Client might be outdated/locked
        const rawUserData: any[] = await prisma.$queryRaw`
            SELECT "coins", "totalExp" FROM "User" WHERE "id" = ${userId}
        `;
        const coins = rawUserData[0]?.coins ? Number(rawUserData[0].coins) : 0;
        const totalExp = rawUserData[0]?.totalExp ? Number(rawUserData[0].totalExp) : 0;

        return NextResponse.json({
            coins,
            totalExp,
            activePet,
            ownedPetIds: user.userPets.map((up: any) => up.petId),
            missions: user.userMissions.map((um: any) => ({
                id: um.id,
                title: um.mission.title,
                description: um.mission.description,
                type: um.mission.type,
                currentValue: um.currentValue,
                targetValue: um.mission.targetValue,
                rewardCoins: um.mission.rewardCoins,
                isClaimed: um.isClaimed,
                category: um.mission.category
            }))
        });
    } catch (error: any) {
        console.error('Gamification status error:', error);
        return NextResponse.json(
            { error: `Failed to fetch status: ${error.message}` },
            { status: 500 }
        );
    }
}
