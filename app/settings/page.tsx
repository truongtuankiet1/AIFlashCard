'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/app/ui/header';

export default function SettingsPage() {
  const router = useRouter();

  // Profile State
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  // API Key State
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoRedeeming, setPromoRedeeming] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch API Key Status
      try {
        const response = await fetch('/api/settings/api-key');
        if (response.ok) {
          const data = await response.json();
          setHasApiKey(data.hasApiKey);
        }
      } catch (err) {
        console.error('Error fetching API key status:', err);
      } finally {
        setLoading(false);
      }

      // Fetch Profile Data
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setName(data.user.name || '');
            setAge(data.user.age?.toString() || '');
            setBio(data.user.bio || '');
            setAvatar(data.user.avatar || '');
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileMessage('');
    setProfileSaving(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          age: age ? parseInt(age, 10) : null,
          bio,
          avatar,
        }),
      });

      if (response.ok) {
        setProfileMessage('Profile updated successfully! ✅');
        router.refresh(); // Refresh to update dashboard if navigated
      } else {
        const data = await response.json();
        setProfileError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setProfileError('An error occurred. Please try again.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    if (!apiKey.trim()) {
      setError('Please enter an API key');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/settings/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });

      if (response.ok) {
        setMessage('API key saved successfully! ✅');
        setApiKey('');
        setHasApiKey(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save API key');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRedeemCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoMessage('');
    setPromoRedeeming(true);

    try {
      const response = await fetch('/api/gamification/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setPromoMessage(data.message || 'Code redeemed successfully! 💰');
        setPromoCode('');
      } else {
        setPromoError(data.error || 'Invalid code');
      }
    } catch (err) {
      setPromoError('An error occurred. Please try again.');
    } finally {
      setPromoRedeeming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-cyan/10">
      {/* Header */}
      <Header />

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="glass-card p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">⚙️ Settings</h2>
          <p className="text-gray-600 mb-8">Manage your preferences and profile</p>

          {/* Profile Section */}
          <div className="border-b border-gray-200 pb-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Profile</h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Your Name"
                />
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Your Age"
                />
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent h-24"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Avatar
                </label>
                <div className="flex items-center gap-4">
                  {avatar && (
                    <img
                      src={avatar}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-full object-cover border border-gray-200"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-2"
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          setProfileLoading(true);
                          const formData = new FormData();
                          formData.append('file', file);

                          try {
                            const res = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData,
                            });

                            if (res.ok) {
                              const data = await res.json();
                              setAvatar(data.url);
                              setProfileMessage('Image uploaded! Don\'t forget to save.');
                            } else {
                              setProfileError('Upload failed');
                            }
                          } catch (err) {
                            console.error(err);
                            setProfileError('Upload failed');
                          } finally {
                            setProfileLoading(false);
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Paste a URL or upload an image from your computer.
                    </p>
                  </div>
                </div>
              </div>

              {profileMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  {profileMessage}
                </div>
              )}

              {profileError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {profileError}
                </div>
              )}

              <button
                type="submit"
                disabled={profileSaving || profileLoading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {profileSaving ? 'Saving Profile...' : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* API Key Section */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">OpenAI API Key</h3>
            <p className="text-gray-600 text-sm mb-6">
              Add your personal OpenAI API key to use your own credits for generating flashcards.
              Your key will be encrypted and never shared.
            </p>

            {hasApiKey && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                <p className="text-green-700 font-semibold">✅ You have a personal API key configured</p>
              </div>
            )}

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-semibold text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="sk-..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  Get your API key from{' '}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    OpenAI Platform
                  </a>
                </p>
              </div>

              {message && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  {message}
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={saving || loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save API Key'}
              </button>
            </form>
          </div>

          {/* Promo Code Section */}
          <div className="border-b border-gray-200 pb-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🎁 Special Code</h3>
            <p className="text-gray-600 text-sm mb-6">
              Enter a secret code to unlock special rewards or coins.
            </p>

            <form onSubmit={handleRedeemCode} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter code here..."
                />
              </div>

              {promoMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  {promoMessage}
                </div>
              )}

              {promoError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {promoError}
                </div>
              )}

              <button
                type="submit"
                disabled={promoRedeeming}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition disabled:opacity-50"
              >
                {promoRedeeming ? 'Redeeming...' : 'Redeem Code'}
              </button>
            </form>
          </div>

          {/* Account Info */}
          <div className="pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Account</h3>
            <button
              onClick={async () => {
                // Logout
                router.push('/login');
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
