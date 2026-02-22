'use client';

import React, { useState } from 'react';

interface ShopItem {
    id: string;
    name: string;
    type: string;
    rarity: string;
    price: number;
    metadata: any;
    petId: string;
    pet?: any;
}

interface ShopUIProps {
    items: ShopItem[];
    userCoins: number;
    ownedPetIds: string[];
    activePetId: string | null;
    onPurchase: (item: ShopItem) => void;
    onEquip: (petId: string) => void;
}

const CoinIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="8" stroke="#CA8A04" fill="#FEF3C7" />
        <text x="9" y="15" fill="#CA8A04" fontSize="10" fontWeight="bold" fontFamily="sans-serif">C</text>
    </svg>
);

export default function ShopUI({ items, userCoins, ownedPetIds, activePetId, onPurchase, onEquip }: ShopUIProps) {
    const [filter, setFilter] = useState('ALL');

    const filteredItems = items.filter(item => filter === 'ALL' || item.type === filter);

    const RarityBadge = ({ rarity }: { rarity: string }) => {
        const colors: any = {
            COMMON: 'bg-gray-100 text-gray-600',
            RARE: 'bg-blue-100 text-blue-600',
            EPIC: 'bg-purple-100 text-purple-600',
            LEGENDARY: 'bg-yellow-100 text-yellow-600',
        };
        return (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors[rarity] || colors.COMMON}`}>
                {rarity}
            </span>
        );
    };

    return (
        <div>
            {/* Category Tabs */}
            <div className="flex gap-4 mb-8">
                {['ALL', 'PET', 'SKIN', 'FOOD'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-xl font-bold transition ${filter === cat ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-shadow group">
                        <div className="aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                            <div className="w-full h-full p-4 group-hover:scale-110 transition-transform flex items-center justify-center">
                                {item.type === 'PET' && item.pet ? (
                                    <img
                                        src={item.pet.baseImage}
                                        alt={item.name}
                                        className="max-w-full max-h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            const parent = (e.target as HTMLImageElement).parentElement;
                                            if (parent) {
                                                const span = document.createElement('span');
                                                span.className = 'text-6xl';
                                                span.innerText = '🥚';
                                                parent.appendChild(span);
                                            }
                                        }}
                                    />
                                ) : item.type === 'PET' ? (
                                    <span className="text-6xl">🥚</span>
                                ) : item.type === 'SKIN' ? (
                                    <span className="text-6xl">👕</span>
                                ) : (
                                    <span className="text-6xl">🍎</span>
                                )}
                            </div>
                            <div className="absolute top-2 right-2">
                                <RarityBadge rarity={item.rarity} />
                            </div>
                        </div>

                        <h4 className="font-bold text-gray-800 mb-1">{item.name}</h4>
                        <p className="text-xs text-gray-500 mb-4 flex-grow">
                            {item.type === 'PET' ? 'A new companion for your journey.' : 'Customize your current pet.'}
                        </p>

                        {item.type === 'PET' && ownedPetIds.includes(item.petId) ? (
                            <button
                                onClick={() => onEquip(item.petId)}
                                disabled={activePetId === item.petId}
                                className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition ${activePetId === item.petId
                                    ? 'bg-green-100 text-green-700 cursor-default'
                                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200 active:scale-95'
                                    }`}
                            >
                                {activePetId === item.petId ? 'EQUIPPED' : 'EQUIP'}
                            </button>
                        ) : (
                            <button
                                disabled={userCoins < item.price}
                                onClick={() => onPurchase(item)}
                                className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition ${userCoins >= item.price
                                    ? 'bg-gradient-to-r from-primary-600 to-accent-indigo text-white shadow-md hover:shadow-lg active:scale-95'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <span className="text-sm">{item.price}</span>
                                <CoinIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
