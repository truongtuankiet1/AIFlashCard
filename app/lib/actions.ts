'use server';

import { signIn } from '@/app/lib/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            const cause = error.cause as any;
            const message = cause?.err?.message || error.message || '';

            console.log('[ACTIONS] AuthError caught:', error.type, message);

            if (message.includes('UserNotFound')) return 'UserNotFound';
            if (message.includes('WrongPassword')) return 'WrongPassword';

            return 'CredentialsSignin';
        }
        // If it's a redirect error (success), Next.js will handle it if we re-throw it.
        throw error;
    }
}
