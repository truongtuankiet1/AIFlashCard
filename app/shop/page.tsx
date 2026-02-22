'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/app/ui/header';
import ShopUI from '@/app/ui/gamification/ShopUI';
import PetComponent from '@/app/ui/gamification/PetComponent';

export default function ShopPage() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const fetchData = async () => {
        try {
            const [shopRes, statusRes] = await Promise.all([
                fetch('/api/gamification/shop'),
                fetch('/api/gamification/status')
            ]);

            if (shopRes.ok) {
                const shopData = await shopRes.json();
                setItems(shopData.items);
            }

            if (statusRes.ok) {
                const statusData = await statusRes.json();
                setStatus(statusData);
            } else if (statusRes.status === 401) {
                router.push('/login');
            }
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, [router]);

    const handlePurchase = async (item: any) => {
        try {
            const res = await fetch('/api/gamification/shop', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId: item.id })
            });

            const result = await res.json();

            if (result.success) {
                setMessage({ text: `Successfully purchased ${item.name}!`, type: 'success' });
                fetchData(); // Refresh coins and status
            } else {
                setMessage({ text: result.error || 'Purchase failed', type: 'error' });
            }
        } catch (err: any) {
            setMessage({ text: 'An unexpected error occurred', type: 'error' });
        }

        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Pet Shop</h1>
                        <p className="text-gray-500">Spend your hard-earned coins on new pets and accessories!</p>
                    </div>

                </div>

                {message && (
                    <div className={`mb-8 p-4 rounded-xl font-bold text-center animate-bounce ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {message.text}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <ShopUI
                        items={items}
                        userCoins={status?.coins || 0}
                        ownedPetIds={status?.ownedPetIds || []}
                        activePetId={status?.activePet?.petId || null}
                        onPurchase={handlePurchase}
                        onEquip={async (petId) => {
                            try {
                                const res = await fetch('/api/gamification/equip', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ petId })
                                });
                                if (res.ok) {
                                    setMessage({ text: 'Pet equipped!', type: 'success' });
                                    fetchData();
                                }
                            } catch (err) {
                                setMessage({ text: 'Failed to equip pet', type: 'error' });
                            }
                            setTimeout(() => setMessage(null), 3000);
                        }}
                    />
                )}
            </main>

            {status && <PetComponent initialStatus={status} />}
        </div>
    );
}
