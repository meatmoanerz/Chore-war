export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-display font-bold text-purple-600">
              Chore War
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Familjen Andersson</span>
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
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
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-sm text-purple-100 mb-1">Totala poäng</div>
            <div className="text-4xl font-bold mb-2">1,247</div>
            <div className="text-sm text-purple-200">+89 denna vecka</div>
          </div>

          {/* Active Chores Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-sm text-gray-600 mb-1">Aktiva sysslor</div>
            <div className="text-4xl font-bold text-gray-900 mb-2">5</div>
            <div className="text-sm text-green-600 font-medium">3 slutförda idag</div>
          </div>

          {/* Goal Progress Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-sm text-gray-600 mb-1">Veckomål</div>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-4xl font-bold text-gray-900">85%</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leaderboard */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-display font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🏆</span>
              Leaderboard (denna vecka)
            </h2>
            <div className="space-y-3">
              {[
                { rank: 1, name: 'Emma', points: 450, avatar: 'E', bgColor: 'bg-blue-500' },
                { rank: 2, name: 'Oscar', points: 380, avatar: 'O', bgColor: 'bg-purple-500' },
                { rank: 3, name: 'Lisa', points: 320, avatar: 'L', bgColor: 'bg-orange-500' },
              ].map((user) => (
                <div
                  key={user.rank}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="text-xl font-bold text-gray-400 w-6">
                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                  </div>
                  <div className={`w-10 h-10 ${user.bgColor} rounded-full flex items-center justify-center text-white font-bold shadow-md`}>
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.points} poäng</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Chores */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-display font-bold text-gray-800 mb-4 flex items-center gap-2">
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
                  className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div>
                    <div className="font-medium text-gray-900">{chore.title}</div>
                    <div className="text-sm text-gray-500">{chore.time}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-purple-600 font-bold">{chore.points}p</span>
                    <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium text-sm shadow-md">
                      Claima
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-display font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🎯</span>
            Mina mål
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Veckomål</h3>
                <span className="text-sm text-gray-500">300 / 400 poäng</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div className="bg-purple-500 h-3 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="text-sm text-gray-600">
                Belöning: <span className="font-medium">Veckopeng + bio</span>
              </div>
            </div>

            <div className="border-2 border-green-300 rounded-xl p-4 bg-green-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-green-800">Familjemål</h3>
                <span className="text-sm text-green-700">1,200 / 1,000 poäng ✓</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-3 mb-2">
                <div className="bg-green-600 h-3 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="text-sm text-green-700">
                <span className="font-medium">Mål uppnått! 🎉</span> Hela familjen går på äventyrsbad!
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
