import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Force cleaning ALL gamification shop data...');

    // 0. Handle Constraints (Delete related first)
    await prisma.transaction.deleteMany({});
    await prisma.userPet.deleteMany({});
    await prisma.userMission.deleteMany({});

    // 1. Delete Shop Items and Pets
    await prisma.shopItem.deleteMany({});
    await prisma.pet.deleteMany({});

    console.log('Seeding fresh gamification data...');

    // 1. Create Pets (The New Trio Only)
    const petCat = await prisma.pet.create({
        data: {
            id: 'pet_cat',
            baseName: 'Cyber Cat',
            archetype: 'MOTIVATOR',
            baseImage: '/pets/cyber_cat.png',
        },
    });

    const petRabbit = await prisma.pet.create({
        data: {
            id: 'pet_rabbit',
            baseName: 'White Rabbit (Limited Edition)',
            archetype: 'CHILL',
            baseImage: '/pets/white_rabbit.png',
        },
    });

    const petDog = await prisma.pet.create({
        data: {
            id: 'pet_dog',
            baseName: 'Cyber Dog',
            archetype: 'TEACHER',
            baseImage: '/pets/cyber_dog.png',
        },
    });

    // 2. Create Shop Items
    const items = [
        {
            id: 'item_cat',
            name: 'Cyber Cat Mascot',
            type: 'PET',
            rarity: 'COMMON',
            price: 0,
            petId: petCat.id,
        },
        {
            id: 'item_dog',
            name: 'Cyber Dog Sentinel',
            type: 'PET',
            rarity: 'RARE',
            price: 2500,
            petId: petDog.id,
        },
        {
            id: 'item_rabbit',
            name: 'White Rabbit (Limited Edition)',
            type: 'PET',
            rarity: 'LEGENDARY',
            price: 5000,
            petId: petRabbit.id,
        },
    ];

    for (const item of items) {
        await prisma.shopItem.create({
            data: item as any
        });
    }

    // 3. Create Missions
    await prisma.mission.upsert({
        where: { id: 'daily_quick_study' },
        update: {},
        create: {
            id: 'daily_quick_study',
            title: 'Quick Study',
            description: 'Study 5 cards today',
            type: 'DAILY',
            category: 'CARDS',
            targetValue: 5,
            rewardCoins: 50,
        },
    });

    await prisma.mission.upsert({
        where: { id: 'daily_dedicated' },
        update: {},
        create: {
            id: 'daily_dedicated',
            title: 'Dedicated Learner',
            description: 'Study 20 cards today',
            type: 'DAILY',
            category: 'CARDS',
            targetValue: 20,
            rewardCoins: 200,
        },
    });

    await prisma.mission.upsert({
        where: { id: 'monthly_scholar' },
        update: {},
        create: {
            id: 'monthly_scholar',
            title: 'Monthly Scholar',
            description: 'Study 500 cards this month',
            type: 'MONTHLY',
            category: 'CARDS',
            targetValue: 500,
            rewardCoins: 1000,
        },
    });

    console.log('Seed completed successfully. Shop is now fresh.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
