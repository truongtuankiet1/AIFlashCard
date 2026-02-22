'use client';

import { useState, useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  const getFriendlyError = (code: string | undefined) => {
    if (!code) return '';
    if (code.includes('UserNotFound')) return 'Email này chưa được đăng ký.';
    if (code.includes('WrongPassword')) return 'Mật khẩu không chính xác.';
    if (code === 'CredentialsSignin') return 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
    return code;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100 to-accent-cyan/10">
      <div className="w-full max-w-md px-6">
        <div className="glass-card p-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-center mb-2 gradient-text">
            📚 VocabCards
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Learn English vocabulary with AI-powered flashcards
          </p>

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {getFriendlyError(errorMessage)}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full btn-primary disabled:opacity-50"
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
