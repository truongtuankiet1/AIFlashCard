import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db';
import { encryptApiKey, decryptApiKey } from '@/app/lib/crypto';
import { z } from 'zod';

const ApiKeySchema = z.object({
  apiKey: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { apiKey } = ApiKeySchema.parse(body);

    // Encrypt the API key
    const encryptedKey = encryptApiKey(apiKey);

    // Save to database
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        encryptedApiKey: encryptedKey,
      },
    });

    return NextResponse.json({
      message: 'API key saved successfully',
    });
  } catch (error) {
    console.error('Save API key error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
        encryptedApiKey: true,
      },
    });

    const hasApiKey = !!user?.encryptedApiKey;

    return NextResponse.json({
      hasApiKey,
    });
  } catch (error) {
    console.error('Get API key status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
