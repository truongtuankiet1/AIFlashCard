import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { handleSessionCompletion } from '@/app/lib/services/gamification';
import { z } from 'zod';

const SessionCompleteSchema = z.object({
    cardsStudied: z.number().int().min(0),
    accuracy: z.number().min(0).max(1),
    durationMinutes: z.number().min(0),
});

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const data = SessionCompleteSchema.parse(body);

        const result = await handleSessionCompletion({
            userId: session.user.id,
            ...data
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Session complete error:', error);
        return NextResponse.json(
            { error: `Failed to process session: ${error.message}` },
            { status: 500 }
        );
    }
}
