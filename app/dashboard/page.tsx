'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DeckList } from '@/app/ui/deck-card';
import { Header } from '@/app/ui/header';
import PetComponent from '@/app/ui/gamification/PetComponent';
import MissionDashboard from '@/app/ui/gamification/MissionDashboard';


interface Deck {
  id: string;
  topic: string;
  title: string;
  _count: { cards: number };
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardsToReviewCount, setCardsToReviewCount] = useState(0);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [gamificationStatus, setGamificationStatus] = useState<any>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [decksRes, profileRes, gamificationRes] = await Promise.all([
          fetch('/api/decks'),
          fetch('/api/user/profile'),
          fetch('/api/gamification/status')
        ]);


        if (decksRes.ok) {
          const decksData = await decksRes.json();
          setDecks(
            decksData.decks.map((deck: any) => ({
              id: deck.id,
              topic: deck.topic,
              title: deck.title,
              cardCount: deck._count.cards,
              _count: deck._count,
              createdAt: deck.createdAt,
            }))
          );
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUserProfile(profileData.user);
        } else {
          // Only redirect if both fail or auth fails specifically
          if (decksRes.status === 401 || profileRes.status === 401) {
            router.push('/login');
          }
        }

        if (gamificationRes.ok) {
          const gamificationData = await gamificationRes.json();
          setGamificationStatus(gamificationData);
        }


      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600/90 to-accent-indigo/80 backdrop-blur-md text-white rounded-3xl p-10 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow border border-white/20">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar Placeholder */}
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-2 border-white/30 overflow-hidden">
                {userProfile?.avatar ? (
                  <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{userProfile?.name?.charAt(0) || '👋'}</span>
                )}
              </div>
              <div>
                <h2 className="text-4xl font-bold">Welcome back, {userProfile?.name || 'User'}!</h2>
                <div className="flex gap-3 text-sm opacity-90 mt-1">
                  <span>🎓 Age: {userProfile?.age || '--'}</span>
                  <span>✨ Bio: {userProfile?.bio || 'Learning vocabulary...'}</span>
                </div>
              </div>
            </div>

            <p className="text-lg opacity-90 mb-6 max-w-xl">
              Continue learning and mastering new vocabulary. You're doing great!
            </p>

            <Link
              href="/generate"
              className="inline-block px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-50 transition shadow-md hover:shadow-lg"
            >
              ➕ Generate New Deck
            </Link>
          </div>

          {/* Profile Quick View */}
          <div className="hidden md:block w-72 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Profile
            </h3>
            <div className="space-y-3">
              <p className="text-white/90">Name: <span className="font-semibold">{userProfile?.name || 'User'}</span></p>
              <Link href="/settings" className="inline-block text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors border border-white/10">
                Edit Profile →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-b-4 border-primary-500 transform hover:-translate-y-1 transition-transform">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Decks</p>
            <p className="text-5xl font-black text-primary-600 leading-none">{decks.length}</p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-8 border-b-4 border-accent-cyan transform hover:-translate-y-1 transition-transform">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Cards</p>
            <p className="text-5xl font-black text-accent-cyan leading-none">
              {decks.reduce((sum, d) => sum + d._count.cards, 0)}
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-8 border-b-4 border-accent-teal transform hover:-translate-y-1 transition-transform">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Cards Due Today</p>
            <p className="text-5xl font-black text-accent-teal leading-none">{cardsToReviewCount}</p>
          </div>
        </div>

        {/* Decks */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Decks</h3>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading your decks...</p>
            </div>
          ) : decks.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">No decks yet</p>
              <Link
                href="/generate"
                className="inline-block px-6 py-3 btn-primary"
              >
                Create your first deck
              </Link>
            </div>
          ) : (
            <DeckList
              decks={decks.map((d) => ({
                id: d.id,
                topic: d.topic,
                title: d.title,
                cardCount: d._count.cards,
                createdAt: d.createdAt,
              }))}
            />
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/generate"
            className="px-6 py-3 bg-primary-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-primary-200 hover:scale-105 active:scale-95 transition-all"
          >
            Create New Deck ✨
          </Link>
        </div>
      </main>

      {/* Persistent Pet */}
      {gamificationStatus && <PetComponent initialStatus={gamificationStatus} />}
    </div>

  );
}
