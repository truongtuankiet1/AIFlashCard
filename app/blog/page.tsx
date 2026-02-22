'use client';

import { Header } from '@/app/ui/header';

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-cyan/10">
            <Header />

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="animate-slide-up">
                    <header className="mb-12 text-center">
                        <h1 className="text-5xl font-black text-gray-900 mb-4 gradient-text">Blog & Updates</h1>
                        <p className="text-gray-600 text-lg">Stay updated with the latest news and features from VocabCards.</p>
                    </header>

                    <article className="glass-card overflow-hidden shadow-glow">
                        {/* Header section with gradient background */}
                        <div className="bg-gradient-to-r from-primary-600 to-accent-cyan px-8 py-10 text-white">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border border-white/30">
                                    Release
                                </span>
                                <span className="text-white/80 text-sm">February 15, 2026</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black leading-tight">
                                🚀 v1.0.0 Official Release – Focused English Learning with Flashcards
                            </h2>
                            <div className="mt-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold border border-white/30 text-white">
                                    T
                                </div>
                                <div>
                                    <p className="font-bold">TruongTuanKiet_1</p>
                                    <p className="text-white/70 text-xs">Lead Developer</p>
                                </div>
                            </div>
                        </div>

                        {/* Content section */}
                        <div className="p-8 md:p-12 bg-white space-y-12 text-gray-700 leading-relaxed text-lg">
                            <p className="italic text-xl text-gray-500 font-medium border-l-4 border-gray-200 pl-4">
                                Version v1.0.0 is officially released.
                            </p>

                            <p>
                                This marks the first milestone of the project developed by <span className="font-bold text-primary-600">TruongTuanKiet_1</span>, with a clear and focused goal:
                            </p>

                            <div className="bg-primary-50 border-l-4 border-primary-500 p-6 rounded-r-xl">
                                <p className="font-bold text-primary-800 text-xl">
                                    To build an effective English vocabulary learning system centered around flashcards.
                                </p>
                            </div>

                            {/* Version Info Section */}
                            <section className="space-y-4">
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <span>📌</span> Version Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Version</p>
                                        <p className="font-black text-gray-800">v1.0.0</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Developer</p>
                                        <p className="font-black text-gray-800">TruongTuanKiet_1</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Core Focus</p>
                                        <p className="font-black text-gray-800">Flashcard System</p>
                                    </div>
                                </div>
                            </section>

                            {/* Flashcards Details Section */}
                            <section className="space-y-6">
                                <h3 className="text-3xl font-black text-gray-900 flex items-center gap-3 pt-6 border-t border-gray-50">
                                    <span className="p-2 bg-accent-cyan/10 rounded-lg text-accent-cyan text-2xl">🎯</span>
                                    Flashcards – The Core of the Platform
                                </h3>
                                <p>
                                    In v1.0.0, flashcards are not just a feature — they are the foundation of the entire system.
                                </p>

                                <div className="grid grid-cols-1 gap-6">
                                    {/* Card 1 */}
                                    <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <h4 className="text-xl font-bold text-primary-600 mb-4 flex items-center gap-2">
                                            <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm">1</span>
                                            Active Learning
                                        </h4>
                                        <p className="mb-4">Each flashcard is designed to help you:</p>
                                        <ul className="space-y-3 list-disc list-inside text-gray-600 ml-2">
                                            <li>Recall vocabulary actively</li>
                                            <li>Improve word recognition speed</li>
                                            <li>Self-evaluate your memory retention</li>
                                        </ul>
                                        <p className="mt-6 font-medium text-gray-800 bg-gray-50 p-4 rounded-xl">
                                            Instead of passively reading word lists, you actively engage with each term.
                                        </p>
                                    </div>

                                    {/* Card 2 */}
                                    <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <h4 className="text-xl font-bold text-accent-teal mb-4 flex items-center gap-2">
                                            <span className="w-8 h-8 bg-accent-teal/10 rounded-full flex items-center justify-center text-sm text-accent-teal">2</span>
                                            Long-Term Retention Optimization
                                        </h4>
                                        <p className="mb-4">The system is structured around key memory principles:</p>
                                        <ul className="space-y-3 list-disc list-inside text-gray-600 ml-2">
                                            <li>Repeated review</li>
                                            <li>Reinforcement of forgotten words</li>
                                            <li>Reduced time spent on already-mastered vocabulary</li>
                                        </ul>
                                        <p className="mt-6 font-medium text-gray-800 bg-gray-50 p-4 rounded-xl">
                                            The goal is not to learn as many words as possible in one day, but to remember them long-term and actually use them.
                                        </p>
                                    </div>

                                    {/* Card 3 */}
                                    <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <h4 className="text-xl font-bold text-accent-indigo mb-4 flex items-center gap-2">
                                            <span className="w-8 h-8 bg-accent-indigo/10 rounded-full flex items-center justify-center text-sm text-accent-indigo">3</span>
                                            Clear Progress Tracking
                                        </h4>
                                        <p className="mb-4">You can:</p>
                                        <ul className="space-y-3 list-disc list-inside text-gray-600 ml-2">
                                            <li>Track the number of words learned</li>
                                            <li>See which cards need review</li>
                                            <li>Identify weak areas and improve them</li>
                                        </ul>
                                        <p className="mt-6 font-medium text-gray-800 bg-gray-50 p-4 rounded-xl">
                                            Everything is transparent and focused on measurable learning progress.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Gamification Section */}
                            <section className="p-8 bg-accent-cyan/5 rounded-3xl border border-accent-cyan/10">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span>🎮</span> Gamification – A Supporting Layer
                                </h3>
                                <p className="mb-6">In addition to the flashcard system, v1.0.0 includes:</p>
                                <div className="flex flex-wrap gap-3 mb-8">
                                    <span className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-gray-700 shadow-sm border border-gray-100 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-accent-cyan"></span>
                                        Daily & Monthly Missions
                                    </span>
                                    <span className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-gray-700 shadow-sm border border-gray-100 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                                        Currency Rewards
                                    </span>
                                    <span className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-gray-700 shadow-sm border border-gray-100 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary-400"></span>
                                        Pet System
                                    </span>
                                </div>
                                <div className="p-5 bg-white/50 backdrop-blur-sm rounded-2xl border border-white">
                                    <p className="text-gray-600 italic">
                                        However, these features serve as motivation tools.
                                    </p>
                                    <p className="mt-2 font-black text-gray-900 text-xl">
                                        The true value of the platform lies in the quality and effectiveness of the flashcard system.
                                    </p>
                                </div>
                            </section>

                            {/* Future Direction Section */}
                            <section className="space-y-6 pt-6 border-t border-gray-50">
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <span>🔥</span> Future Direction
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        "Topic-based categorization",
                                        "Smarter review algorithms",
                                        "Detailed performance analytics",
                                        "Personalized learning paths"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-5 bg-gray-50 rounded-2xl hover:bg-primary-50 hover:border-primary-100 border border-transparent transition-all group">
                                            <div className="w-3 h-3 rounded-full bg-accent-cyan group-hover:scale-125 transition-transform shadow-sm"></div>
                                            <span className="font-bold text-gray-800">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Final Thoughts Section */}
                            <section className="pt-10 border-t-2 border-dashed border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span>💬</span> Final Thoughts
                                </h3>
                                <p className="mb-8 text-xl text-gray-600">
                                    Version v1.0.0 lays the foundation for a focused and effective English learning system built around real memory retention.
                                </p>
                                <div className="relative mb-12">
                                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary-600 rounded-full"></div>
                                    <p className="font-black text-primary-600 text-2xl italic pl-6 leading-relaxed">
                                        "If you are serious about building strong vocabulary in a structured and sustainable way, start with flashcards today."
                                    </p>
                                </div>
                                <div className="flex justify-end pt-6">
                                    <div className="text-right p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm min-w-[240px]">
                                        <p className="font-black text-2xl text-gray-900">— TruongTuanKiet_1</p>
                                        <p className="text-primary-600 font-bold tracking-widest text-xs mt-1 uppercase">Founder & Developer</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </article>
                </div>
            </main>

            {/* Footer Decoration */}
            <footer className="py-12 text-center text-gray-400 text-sm">
                <p>© 2026 VocabCards. Built with ❤️ for English learners.</p>
            </footer>
        </div>
    );
}
