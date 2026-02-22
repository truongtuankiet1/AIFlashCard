import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';

/**
 * Middleware to protect API routes
 * Usage: wrap your API route handler with this function
 */
export async function withAuth(
  handler: (req: NextRequest, session: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(request, session);
  };
}

/**
 * Validate request body against a schema
 */
export async function validateBody<T>(
  request: NextRequest,
  schema: any
): Promise<T | null> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    return null;
  }
}

/**
 * Rate limit helper (basic implementation)
 * In production, use Redis for distributed rate limiting
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count < limit) {
    record.count++;
    return true;
  }

  return false;
}

/**
 * Handle API errors uniformly
 */
export function handleError(error: unknown, context: string): NextResponse {
  console.error(`[${context}]`, error);

  if (error instanceof Error) {
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message.includes('not found')) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
