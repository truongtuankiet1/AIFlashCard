'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/app/ui/header';
import MissionDashboard from '@/app/ui/gamification/MissionDashboard';
import PetComponent from '@/app/ui/gamification/PetComponent';

export default function MissionsPage() {
    const router = useRouter();
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/gamification/status');
                if (res.ok) {
                    const data = await res.json();
                    setStatus(data);
                } else if (res.status === 401) {
                    router.push('/login');
                }
            } catch (err) {
                console.error('Error fetching missions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Missions</h1>
                    <p className="text-gray-500">Complete challenges to earn coins and level up your pet!</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : status ? (
                    <div className="space-y-12">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-purple-100 rounded-2xl text-2xl">🎯</div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Your Current Goals</h2>
                                    <p className="text-sm text-gray-500">Track your progress and claim rewards.</p>
                                </div>
                            </div>
                            <MissionDashboard missions={status.missions} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-lg">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span>🔥</span> Keep the Streak!
                                </h3>
                                <p className="text-blue-100 mb-6">Study every day to unlock massive bonus rewards and exclusive pet skins.</p>
                                <div className="bg-white/20 rounded-2xl p-4 flex justify-between items-center">
                                    <span className="font-bold">Current Streak</span>
                                    <span className="text-2xl font-black">7 Days</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl p-8 text-white shadow-lg">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span>📊</span> Monthly Stats
                                </h3>
                                <p className="text-orange-100 mb-6">You've studied more than 85% of users this month. Keep it up!</p>
                                <div className="bg-white/20 rounded-2xl p-4 flex justify-between items-center">
                                    <span className="font-bold">Cards Studied</span>
                                    <span className="text-2xl font-black">{status.missions.reduce((acc: number, m: any) => m.type === 'MONTHLY' ? acc + m.currentValue : acc, 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        Failed to load mission status.
                    </div>
                )}
            </main>

            {status && <PetComponent initialStatus={status} />}
        </div>
    );
}
