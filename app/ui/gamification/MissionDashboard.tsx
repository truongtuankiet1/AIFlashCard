'use client';

import React from 'react';

interface Mission {
    id: string;
    title: string;
    description: string;
    type: string;
    currentValue: number;
    targetValue: number;
    rewardCoins: number;
    isClaimed: boolean;
    category: string;
}

interface MissionDashboardProps {
    missions: Mission[];
}

export default function MissionDashboard({ missions }: MissionDashboardProps) {
    const dailyMissions = missions.filter(m => m.type === 'DAILY');
    const monthlyMissions = missions.filter(m => m.type === 'MONTHLY');

    const MissionItem = ({ mission }: { mission: Mission }) => (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="font-bold text-gray-800">{mission.title}</h4>
                    <p className="text-xs text-gray-500">{mission.description}</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                    <span className="text-xs font-bold text-yellow-700">+{mission.rewardCoins}</span>
                    <span className="text-xs">🪙</span>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between text-[10px] mb-1 font-bold uppercase tracking-wider">
                    <span className="text-blue-600">Progress</span>
                    <span className="text-gray-400">{mission.currentValue} / {mission.targetValue}</span>
                </div>
                <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden border border-gray-100">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${mission.isClaimed ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(100, (mission.currentValue / mission.targetValue) * 100)}%` }}
                    ></div>
                </div>
            </div>

            {mission.currentValue >= mission.targetValue && !mission.isClaimed && (
                <button className="mt-3 w-full py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition shadow-sm">
                    Claim Reward
                </button>
            )}
            {mission.isClaimed && (
                <div className="mt-3 w-full py-1.5 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg text-center cursor-default">
                    Completed ✅
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-8">
            <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="bg-orange-100 p-1.5 rounded-lg text-lg">📅</span>
                    Daily Missions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dailyMissions.map(m => <MissionItem key={m.id} mission={m} />)}
                    {dailyMissions.length === 0 && <p className="text-gray-500 text-sm">No daily missions available.</p>}
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="bg-purple-100 p-1.5 rounded-lg text-lg">🌙</span>
                    Monthly Challenges
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {monthlyMissions.map(m => <MissionItem key={m.id} mission={m} />)}
                    {monthlyMissions.length === 0 && <p className="text-gray-500 text-sm">No monthly missions available.</p>}
                </div>
            </section>
        </div>
    );
}
