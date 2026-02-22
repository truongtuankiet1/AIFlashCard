import { prisma } from '../db';

export interface SessionResult {
    userId: string;
    cardsStudied: number;
    accuracy: number;
    durationMinutes: number;
}

export interface GamificationUpdate {
    coinsEarned: number | string;
    expEarned: number | string;
    leveledUp: boolean;
    newLevel: number;
    completedMissions: string[];
    petDialogue?: string;
    totalCoins?: number | string;
}

const LEVEL_EXP_BASE = 100;
const COINS_PER_CARD = 2;

export async function handleSessionCompletion(result: SessionResult): Promise<GamificationUpdate> {
    const { userId, cardsStudied, accuracy, durationMinutes } = result;

    // 1. Basic Anti-cheat
    if (durationMinutes < 0.5 && cardsStudied > 5) {
        return {
            coinsEarned: 0,
            expEarned: 0,
            leveledUp: false,
            newLevel: 0,
            completedMissions: [],
            petDialogue: "Bạn học nhanh quá, tôi theo không kịp! Hãy tập trung hơn nhé. 🐢"
        };
    }

    // 2. Calculate Base Rewards
    const coinsEarned = cardsStudied * COINS_PER_CARD;
    const expEarned = cardsStudied * 10;

    // 3. Update User & Pet
    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            coins: { increment: coinsEarned },
            totalExp: { increment: expEarned }
        },
        include: {
            userPets: {
                where: { isActive: true },
                include: { pet: true }
            }
        }
    });

    let leveledUp = false;
    let newLevel = 1;

    const activePet = user.userPets[0];
    if (activePet) {
        const nextLevelExp = Math.pow(activePet.level, 2) * LEVEL_EXP_BASE;
        const totalExp = activePet.exp + expEarned;

        if (totalExp >= nextLevelExp) {
            leveledUp = true;
            newLevel = activePet.level + 1;
            await prisma.userPet.update({
                where: { id: activePet.id },
                data: {
                    level: newLevel,
                    exp: totalExp - nextLevelExp,
                    mood: { increment: 20 }, // Mood boost on level up
                    affection: { increment: 5 }
                }
            });
        } else {
            newLevel = activePet.level;
            await prisma.userPet.update({
                where: { id: activePet.id },
                data: {
                    exp: { increment: expEarned },
                    mood: { increment: 5 }
                }
            });
        }
    }

    // 4. Update Missions
    const completedMissions: string[] = [];
    const now = new Date();

    // Get active missions for the user
    const userMissions = await prisma.userMission.findMany({
        where: {
            userId,
            resetAt: { gt: now },
            isClaimed: false
        },
        include: { mission: true }
    });

    for (const um of userMissions) {
        let progressAdded = 0;
        const mission = um.mission;

        switch (mission.category) {
            case 'CARDS':
                progressAdded = cardsStudied;
                break;
            case 'TIME':
                progressAdded = Math.floor(durationMinutes);
                break;
            case 'ACCURACY':
                if (accuracy >= mission.targetValue) {
                    progressAdded = mission.targetValue; // Instant complete
                }
                break;
        }

        const newValue = um.currentValue + progressAdded;
        const isNowComplete = newValue >= mission.targetValue;

        if (isNowComplete) {
            completedMissions.push(mission.title);
            await prisma.userMission.update({
                where: { id: um.id },
                data: {
                    currentValue: mission.targetValue,
                    isClaimed: true
                }
            });
            // Add mission reward
            await prisma.user.update({
                where: { id: userId },
                data: { coins: { increment: mission.rewardCoins } }
            });
        } else {
            await prisma.userMission.update({
                where: { id: um.id },
                data: { currentValue: newValue }
            });
        }
    }

    // 5. Select Dialogue
    let petDialogue = undefined;
    if (activePet) {
        // This would ideally pull from a localized json file or database
        if (leveledUp) {
            petDialogue = "Wow! Chúng ta đã lên cấp rồi! Bạn thật tuyệt vời! ✨";
        } else if (accuracy > 0.9) {
            petDialogue = "Tuyệt đối chính xác! Bạn là một thiên tài! 🧠";
        } else {
            petDialogue = "Học tốt lắm! Tiếp tục phát huy nhé! 👍";
        }
    }

    return {
        coinsEarned: Number(coinsEarned),
        expEarned: Number(expEarned),
        leveledUp,
        newLevel,
        completedMissions,
        petDialogue,
        totalCoins: Number(user.coins)
    };
}

export async function initializeMissions(userId: string) {
    const dailyReset = new Date();
    dailyReset.setHours(24, 0, 0, 0);

    const monthlyReset = new Date();
    monthlyReset.setMonth(monthlyReset.getMonth() + 1, 1);
    monthlyReset.setHours(0, 0, 0, 0);

    // This should fetch from a Mission template table
    // For now, hardcode initial missions
    const missions = await prisma.mission.findMany();

    for (const mission of missions) {
        await prisma.userMission.upsert({
            where: {
                userId_missionId_resetAt: {
                    userId,
                    missionId: mission.id,
                    resetAt: mission.type === 'DAILY' ? dailyReset : monthlyReset
                }
            },
            create: {
                userId,
                missionId: mission.id,
                resetAt: mission.type === 'DAILY' ? dailyReset : monthlyReset,
                currentValue: 0,
                isClaimed: false
            },
            update: {}
        });
    }
}

export async function purchaseItem(userId: string, itemId: string) {
    const item = await prisma.shopItem.findUnique({
        where: { id: itemId }
    });

    if (!item) throw new Error('Item not found');

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user || user.coins < item.price) {
        throw new Error('Insufficient coins');
    }

    return await prisma.$transaction(async (tx) => {
        // 1. Deduct coins
        await tx.user.update({
            where: { id: userId },
            data: { coins: { decrement: item.price } }
        });

        // 2. Record transaction
        await tx.transaction.create({
            data: {
                userId,
                itemId,
                amount: item.price,
                type: 'PURCHASE'
            }
        });

        // 3. Add item to user (if it's a pet, create UserPet; if it's a skin, update UserPet)
        if (item.type === 'PET' && item.petId) {
            await tx.userPet.create({
                data: {
                    userId,
                    petId: item.petId,
                    level: 1,
                    exp: 0,
                    isActive: false
                }
            });
        } else if (item.type === 'SKIN') {
            // Find active pet and update outfit
            const activePet = await tx.userPet.findFirst({
                where: { userId, isActive: true }
            });
            if (activePet) {
                await tx.userPet.update({
                    where: { id: activePet.id },
                    data: { activeOutfit: item.metadata as any }
                });
            }
        }

        return { success: true, item };
    });
}

