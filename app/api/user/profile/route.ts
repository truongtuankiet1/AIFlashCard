import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db';
import { z } from 'zod';

const ProfileSchema = z.object({
    name: z.string().optional(),
    age: z.number().int().min(0).max(120).optional().nullable(),
    bio: z.string().max(500).optional().nullable(),
    avatar: z.string().optional().or(z.literal('')).nullable(),
});

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                name: true,
                email: true,
                age: true,
                bio: true,
                avatar: true,
            } as any,
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error: any) {
        console.error('Get profile error:', error);
        return NextResponse.json(
            { error: `Internal server error: ${error.message || error}` },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Handle age being passed as string from form
        if (typeof body.age === 'string') {
            if (body.age === '') {
                body.age = null;
            } else {
                const parsedAge = parseInt(body.age, 10);
                body.age = isNaN(parsedAge) ? null : parsedAge;
            }
        }

        const data = ProfileSchema.parse(body);

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.name,
                age: data.age,
                bio: data.bio,
                avatar: data.avatar,
            } as any,
            select: {
                name: true,
                email: true,
                age: true,
                bio: true,
                avatar: true,
            } as any,
        });

        return NextResponse.json({ user: updatedUser });
    } catch (error: any) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: `Failed to update profile: ${error.message || error}` },
            { status: 500 }
        );
    }
}
