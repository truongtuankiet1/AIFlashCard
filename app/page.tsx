export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-indigo/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="text-center px-6 relative z-10 animate-fade-in max-w-4xl mx-auto">
        <h1 className="text-7xl font-extrabold mb-6 tracking-tight drop-shadow-2xl">
          <span className="gradient-text">VocabCards</span>
        </h1>
        <p className="text-2xl mb-12 text-primary-900 font-semibold leading-relaxed max-w-2xl mx-auto">
          Learn English vocabulary with AI-powered flashcards
        </p>
        <div className="flex gap-6 justify-center flex-wrap">
          <a
            href="/login"
            className="btn-glass px-10 py-4 text-lg backdrop-blur-md hover:scale-105 transition-transform"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="px-10 py-4 bg-white text-primary-600 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all shadow-glow hover:shadow-glow-lg hover:scale-105"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
