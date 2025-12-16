export default function DashboardPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold" style={{ color: '#7c3aed' }}>
              Chore War
            </h1>
            <div className="flex items-center gap-4">
              <span style={{ color: '#374151' }}>Familjen Andersson</span>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                style={{ backgroundColor: '#8b5cf6', color: '#ffffff', boxShadow: '0 4px 6px rgba(139,92,246,0.3)' }}
              >
                FA
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Points Card */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              boxShadow: '0 10px 25px rgba(139,92,246,0.3)'
            }}
          >
            <div className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Totala poäng</div>
            <div className="text-4xl font-bold mb-2" style={{ color: '#ffffff' }}>1,247</div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>+89 denna vecka</div>
          </div>

          {/* Active Chores Card */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: '#ffffff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
          >
            <div className="text-sm mb-1" style={{ color: '#6b7280' }}>Aktiva sysslor</div>
            <div className="text-4xl font-bold mb-2" style={{ color: '#111827' }}>5</div>
            <div className="text-sm font-medium" style={{ color: '#059669' }}>3 slutförda idag</div>
          </div>

          {/* Goal Progress Card */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: '#ffffff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
          >
            <div className="text-sm mb-1" style={{ color: '#6b7280' }}>Veckomål</div>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-4xl font-bold" style={{ color: '#111827' }}>85%</div>
            </div>
            <div className="w-full rounded-full h-2" style={{ backgroundColor: '#e5e7eb' }}>
              <div className="h-2 rounded-full" style={{ width: '85%', backgroundColor: '#10b981' }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leaderboard */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: '#ffffff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1f2937' }}>
              <span>🏆</span>
              Leaderboard (denna vecka)
            </h2>
            <div className="space-y-3">
              {[
                { rank: 1, name: 'Emma', points: 450, avatar: 'E', bgColor: '#3b82f6' },
                { rank: 2, name: 'Oscar', points: 380, avatar: 'O', bgColor: '#8b5cf6' },
                { rank: 3, name: 'Lisa', points: 320, avatar: 'L', bgColor: '#f97316' },
              ].map((user) => (
                <div
                  key={user.rank}
                  className="flex items-center gap-4 p-3 rounded-xl transition-colors"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="text-xl font-bold w-6" style={{ color: '#9ca3af' }}>
                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                    style={{ backgroundColor: user.bgColor, color: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  >
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium" style={{ color: '#111827' }}>{user.name}</div>
                    <div className="text-sm" style={{ color: '#6b7280' }}>{user.points} poäng</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Chores */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: '#ffffff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1f2937' }}>
              <span>✨</span>
              Tillgängliga sysslor
            </h2>
            <div className="space-y-3">
              {[
                { title: 'Plocka ur diskmaskinen', points: 50, time: '10 min' },
                { title: 'Dammsuga vardagsrummet', points: 100, time: '20 min' },
                { title: 'Ta ut soporna', points: 30, time: '5 min' },
              ].map((chore, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer"
                  style={{ border: '2px solid #e5e7eb' }}
                >
                  <div>
                    <div className="font-medium" style={{ color: '#111827' }}>{chore.title}</div>
                    <div className="text-sm" style={{ color: '#6b7280' }}>{chore.time}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold" style={{ color: '#7c3aed' }}>{chore.points}p</span>
                    <button
                      className="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                      style={{
                        backgroundColor: '#8b5cf6',
                        color: '#ffffff',
                        boxShadow: '0 4px 6px rgba(139,92,246,0.3)'
                      }}
                    >
                      Claima
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div
          className="mt-6 rounded-2xl p-6"
          style={{ backgroundColor: '#ffffff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1f2937' }}>
            <span>🎯</span>
            Mina mål
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl p-4" style={{ border: '2px solid #e5e7eb' }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium" style={{ color: '#111827' }}>Veckomål</h3>
                <span className="text-sm" style={{ color: '#6b7280' }}>300 / 400 poäng</span>
              </div>
              <div className="w-full rounded-full h-3 mb-2" style={{ backgroundColor: '#e5e7eb' }}>
                <div className="h-3 rounded-full" style={{ width: '75%', backgroundColor: '#8b5cf6' }}></div>
              </div>
              <div className="text-sm" style={{ color: '#4b5563' }}>
                Belöning: <span className="font-medium">Veckopeng + bio</span>
              </div>
            </div>

            <div
              className="rounded-xl p-4"
              style={{ border: '2px solid #86efac', backgroundColor: '#f0fdf4' }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium" style={{ color: '#166534' }}>Familjemål</h3>
                <span className="text-sm" style={{ color: '#15803d' }}>1,200 / 1,000 poäng ✓</span>
              </div>
              <div className="w-full rounded-full h-3 mb-2" style={{ backgroundColor: '#bbf7d0' }}>
                <div className="h-3 rounded-full" style={{ width: '100%', backgroundColor: '#16a34a' }}></div>
              </div>
              <div className="text-sm" style={{ color: '#15803d' }}>
                <span className="font-medium">Mål uppnått! 🎉</span> Hela familjen går på äventyrsbad!
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
