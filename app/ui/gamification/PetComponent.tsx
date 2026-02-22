'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PetProps {
    initialStatus: any;
}

export default function PetComponent({ initialStatus }: PetProps) {
    const [status, setStatus] = useState(initialStatus);
    const [dialogue, setDialogue] = useState<string | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'STATS' | 'OUTFITS'>('STATS');
    const [inventory, setInventory] = useState<any>(null);
    const [isInteracting, setIsInteracting] = useState(false);
    const [interactionEffect, setInteractionEffect] = useState<string | null>(null);

    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch('/api/gamification/status');
            const data = await res.json();
            if (data && !data.error) {
                setStatus(data);
            }
        } catch (err) {
            console.error('Failed to fetch pet status', err);
        }
    }, []);

    const fetchInventory = useCallback(async () => {
        try {
            const res = await fetch('/api/gamification/pet/inventory');
            const data = await res.json();
            if (!data.error) setInventory(data);
        } catch (err) {
            console.error('Failed to fetch inventory', err);
        }
    }, []);

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchStatus]);

    const handleInteract = async (action: 'FEED' | 'PAT') => {
        if (isInteracting) return;
        setIsInteracting(true);
        try {
            const res = await fetch('/api/gamification/pet/interact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            const data = await res.json();
            if (data.success) {
                setDialogue(data.message);
                setInteractionEffect(action === 'FEED' ? '🍎' : '❤️');
                fetchStatus();
                setTimeout(() => setInteractionEffect(null), 1500);
            } else {
                setDialogue(data.error || 'Failed to interact');
            }
        } catch (err) {
            setDialogue('Oops, something went wrong!');
        } finally {
            setIsInteracting(false);
            setTimeout(() => setDialogue(null), 3000);
        }
    };

    const handleEquipSkin = async (skinId: string | null) => {
        try {
            const res = await fetch('/api/gamification/pet/equip-skin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skinId })
            });
            const data = await res.json();
            if (data.success) {
                fetchInventory();
                fetchStatus();
                setDialogue('New look! Do I look cool? 😎');
            }
        } catch (err) {
            console.error('Failed to equip skin', err);
        }
    };



    useEffect(() => {
        if (isPanelOpen && activeTab === 'OUTFITS') fetchInventory();
    }, [isPanelOpen, activeTab, fetchInventory]);

    if (!status?.activePet) return null;

    const { activePet } = status;
    const petImage = activePet.activeOutfit?.imageUrl || activePet.pet.baseImage;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Dialogue Bubble */}
            <AnimatePresence>
                {dialogue && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="mb-2 max-w-[200px] rounded-2xl bg-white p-3 shadow-xl border border-blue-100 text-sm text-gray-700 relative"
                    >
                        {dialogue}
                        <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white border-r border-b border-blue-100 rotate-45"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Interaction Effect */}
            <AnimatePresence>
                {interactionEffect && (
                    <motion.div
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 1, y: -100, scale: 2 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-12 bottom-32 text-4xl pointer-events-none z-[60]"
                    >
                        {interactionEffect}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pet Image */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className="cursor-pointer relative group"
            >
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative w-32 h-32 bg-white/70 backdrop-blur-md rounded-full shadow-2xl border-4 border-white flex items-center justify-center overflow-hidden p-2 transition-all hover:border-blue-200">
                    <img
                        src={petImage}
                        alt={activePet.pet.baseName}
                        className="w-full h-full object-contain drop-shadow-lg"
                    />
                </div>

                {/* Level Badge */}
                <div className="absolute -top-1 -left-1 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border-2 border-white uppercase tracking-tighter">
                    LVL {activePet.level}
                </div>
            </motion.div>

            {/* Main Panel */}
            <AnimatePresence>
                {isPanelOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        className="mt-4 w-80 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white p-0 overflow-hidden flex flex-col h-[450px]"
                    >
                        {/* Panel Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white flex items-center justify-between shadow-md shrink-0">
                            <div>
                                <h3 className="font-black text-xl tracking-tight leading-none mb-1">
                                    {activePet.customName || activePet.pet.baseName}
                                </h3>
                                <p className="text-[10px] font-bold text-white/70 uppercase">
                                    {activePet.pet.archetype} Companion
                                </p>
                            </div>
                            <button onClick={() => setIsPanelOpen(false)} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex bg-gray-50 border-b border-gray-100 shrink-0">
                            {[
                                { id: 'STATS', icon: '📊', label: 'Stats' },
                                { id: 'OUTFITS', icon: '👕', label: 'Outfits' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 flex flex-col items-center py-2 transition-all ${activeTab === tab.id
                                        ? 'bg-white text-blue-600 shadow-inner'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    <span className="text-xl">{tab.icon}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none mt-1">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                            {activeTab === 'STATS' && (
                                <div className="space-y-5">
                                    <div className="flex gap-3 mb-6">
                                        <button
                                            onClick={() => handleInteract('FEED')}
                                            disabled={isInteracting}
                                            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-2xl p-3 flex flex-col items-center shadow-md hover:shadow-lg transition-all active:scale-95"
                                        >
                                            <span className="text-2xl">🍎</span>
                                            <span className="text-[10px] font-black uppercase mt-1">Feed (50)</span>
                                        </button>
                                        <button
                                            onClick={() => handleInteract('PAT')}
                                            disabled={isInteracting}
                                            className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white rounded-2xl p-3 flex flex-col items-center shadow-md hover:shadow-lg transition-all active:scale-95"
                                        >
                                            <span className="text-2xl">✋</span>
                                            <span className="text-[10px] font-black uppercase mt-1">Pat Pet</span>
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase mb-1">
                                                <span>Experience</span>
                                                <span className="text-gray-700">{activePet.exp} XP</span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden border border-gray-50 p-0.5">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${Math.min(100, (activePet.exp / (Math.pow(activePet.level, 2) * 100)) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-orange-50/50 p-3 rounded-2xl border border-orange-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-lg">🍖</span>
                                                    <span className="text-[10px] font-black text-orange-600 uppercase">Hunger</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 bg-orange-200/30 h-1.5 rounded-full overflow-hidden">
                                                        <div className="bg-orange-500 h-full rounded-full" style={{ width: `${activePet.hunger}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-orange-800">{activePet.hunger}%</span>
                                                </div>
                                            </div>

                                            <div className="bg-yellow-50/50 p-3 rounded-2xl border border-yellow-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-lg">🎭</span>
                                                    <span className="text-[10px] font-black text-yellow-600 uppercase">Mood</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 bg-yellow-200/30 h-1.5 rounded-full overflow-hidden">
                                                        <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${activePet.mood}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-yellow-800">{activePet.mood}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl border border-pink-100">❤️</div>
                                                <div>
                                                    <p className="text-[10px] font-black text-pink-600 uppercase">Affection</p>
                                                    <p className="text-sm font-bold text-pink-800">Friendly Companion</p>
                                                </div>
                                            </div>
                                            <span className="text-2xl font-black text-pink-600">{activePet.affection}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'OUTFITS' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleEquipSkin(null)}
                                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center ${!activePet.activeOutfit ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center mb-2 overflow-hidden p-1">
                                            <img src={activePet.pet.baseImage} className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-800 uppercase">Default</span>
                                    </button>

                                    {inventory?.skins?.map((skin: any) => (
                                        <button
                                            key={skin.id}
                                            onClick={() => handleEquipSkin(skin.id)}
                                            className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center ${activePet.activeOutfit?.imageUrl === skin.metadata.imageUrl ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center mb-2 overflow-hidden p-1">
                                                <img src={skin.metadata.imageUrl} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-800 uppercase text-center leading-none">{skin.name}</span>
                                        </button>
                                    ))}

                                    {(!inventory?.skins || inventory.skins.length === 0) && (
                                        <div className="col-span-2 text-center py-10">
                                            <p className="text-gray-400 text-xs italic">No outfits owned yet.</p>
                                            <p className="text-gray-400 text-[10px] mt-1">Visit the Shop to buy some!</p>
                                        </div>
                                    )}
                                </div>
                            )}


                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
