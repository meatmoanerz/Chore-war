import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-display font-bold mb-6 text-white drop-shadow-lg">
          Chore War 🎮
        </h1>
        <p className="text-2xl mb-8 text-white drop-shadow-md">
          Gör sysslor roliga för hela familjen!
        </p>
        <p className="text-lg mb-12 max-w-2xl mx-auto text-white/90 drop-shadow-sm">
          Förvandla hemmasysslor till ett spännande spel med poäng, belöningar och leaderboards.
          Motivera barnen samtidigt som du får en tydlig överblick över familjens uppgifter.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/signup"
            className="px-8 py-4 bg-white text-purple-700 rounded-2xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105 shadow-lg"
          >
            Kom igång gratis
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white rounded-2xl font-bold text-lg hover:bg-white/30 transition-all shadow-lg"
          >
            Logga in
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-display font-bold text-xl mb-2 text-white">Sätt mål</h3>
            <p className="text-white/90">
              Skapa vecko- och månadsmål med individuella och gemensamma belöningar
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="font-display font-bold text-xl mb-2 text-white">Samla poäng</h3>
            <p className="text-white/90">
              Barn tjänar poäng genom att slutföra sysslor och nå sina mål
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="font-display font-bold text-xl mb-2 text-white">Leaderboard</h3>
            <p className="text-white/90">
              Tävla på ett roligt sätt och se vem som bidrar mest i familjen
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
