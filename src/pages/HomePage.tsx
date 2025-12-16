import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="home-page min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1
          className="text-6xl font-bold mb-6"
          style={{ color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
        >
          Chore War 🎮
        </h1>
        <p
          className="text-2xl mb-8"
          style={{ color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}
        >
          Gör sysslor roliga för hela familjen!
        </p>
        <p
          className="text-lg mb-12 max-w-2xl mx-auto"
          style={{ color: 'rgba(255,255,255,0.9)' }}
        >
          Förvandla hemmasysslor till ett spännande spel med poäng, belöningar och leaderboards.
          Motivera barnen samtidigt som du får en tydlig överblick över familjens uppgifter.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/signup"
            className="px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105"
            style={{
              backgroundColor: '#ffffff',
              color: '#7c3aed',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
          >
            Kom igång gratis
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 rounded-2xl font-bold text-lg transition-all"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              border: '2px solid #ffffff',
              backdropFilter: 'blur(8px)'
            }}
          >
            Logga in
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-bold text-xl mb-2" style={{ color: '#ffffff' }}>Sätt mål</h3>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              Skapa vecko- och månadsmål med individuella och gemensamma belöningar
            </p>
          </div>
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="font-bold text-xl mb-2" style={{ color: '#ffffff' }}>Samla poäng</h3>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              Barn tjänar poäng genom att slutföra sysslor och nå sina mål
            </p>
          </div>
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="font-bold text-xl mb-2" style={{ color: '#ffffff' }}>Leaderboard</h3>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              Tävla på ett roligt sätt och se vem som bidrar mest i familjen
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
