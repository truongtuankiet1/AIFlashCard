'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';

// Simple Coin SVG to avoid emoji/font issues
const CoinIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="8" cy="8" r="6" stroke="#CA8A04" fill="#FEF3C7" />
        <path d="M18 8a6 6 0 0 1-7.74 5.74" stroke="#CA8A04" />
        <path d="M12 11v6a2 2 0 1 1-4 0v-2" stroke="#CA8A04" />
        <path d="M12 17h4" stroke="#CA8A04" />
        <text x="5" y="11" fill="#CA8A04" fontSize="8" fontWeight="bold" fontFamily="sans-serif">C</text>
    </svg>
);

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [coins, setCoins] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchCoins = async () => {
            try {
                const res = await fetch('/api/gamification/status');
                if (res.ok) {
                    const data = await res.json();
                    setCoins(data.coins);
                }
            } catch (err) {
                // Silently fail for header
            }
        };
        fetchCoins();
    }, [pathname]);

    const isActive = (path: string) => pathname === path;

    return (
        <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-10 border-b border-white/20">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition shrink-0">
                    <span className="text-3xl">📚</span>
                    <h1 className="text-2xl font-bold text-gray-900">VocabCards</h1>
                </Link>

                <div className="flex-1 flex justify-center px-4">
                    {coins !== null && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-2xl border border-yellow-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
                            <CoinIcon className="w-5 h-5 flex-shrink-0" />
                            <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Your Coin:</span>
                            <span className="text-lg font-black text-yellow-800 tabular-nums">
                                {mounted ? coins.toLocaleString() : '---'}
                            </span>
                        </div>
                    )}
                </div>

                <nav className="flex items-center gap-6 shrink-0">
                    <Link
                        href="/dashboard"
                        className={`font-semibold transition ${isActive('/dashboard')
                            ? 'text-purple-600 font-bold border-b-2 border-purple-600'
                            : 'text-gray-700 hover:text-purple-600'
                            }`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/missions"
                        className={`font-semibold transition ${isActive('/missions')
                            ? 'text-purple-600 font-bold border-b-2 border-purple-600'
                            : 'text-gray-700 hover:text-purple-600'
                            }`}
                    >
                        Missions
                    </Link>
                    <Link
                        href="/shop"
                        className={`font-semibold transition ${isActive('/shop')
                            ? 'text-purple-600 font-bold border-b-2 border-purple-600'
                            : 'text-gray-700 hover:text-purple-600'
                            }`}
                    >
                        Shop
                    </Link>
                    <Link
                        href="/settings"
                        className={`font-semibold transition ${isActive('/settings')
                            ? 'text-purple-600 font-bold border-b-2 border-purple-600'
                            : 'text-gray-700 hover:text-purple-600'
                            }`}
                    >
                        Settings
                    </Link>
                    <Link
                        href="/blog"
                        className={`font-semibold transition ${isActive('/blog')
                            ? 'text-purple-600 font-bold border-b-2 border-purple-600'
                            : 'text-gray-700 hover:text-purple-600'
                            }`}
                    >
                        Blog
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
}
