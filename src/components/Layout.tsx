import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const tabs = [
  { to: '/', label: 'Hem', icon: '🏠' },
  { to: '/sysslor', label: 'Sysslor', icon: '🧹' },
  { to: '/topplista', label: 'Topplista', icon: '🏆' },
  { to: '/mal', label: 'Mål', icon: '🎯' },
  { to: '/mer', label: 'Mer', icon: '⚙️' },
]

export default function Layout() {
  const { household, unread } = useApp()
  const nav = useNavigate()

  return (
    <div className="min-h-dvh bg-krita flex flex-col">
      <header className="sticky top-0 z-20 bg-krita/90 backdrop-blur border-b border-blck/5">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
          <button onClick={() => nav('/')} className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden>⚡</span>
            <div className="text-left">
              <div className="font-display font-extrabold text-blck leading-none">Chore War</div>
              {household && <div className="text-xs text-blck/50 leading-tight">{household.name}</div>}
            </div>
          </button>
          <button
            onClick={() => nav('/notiser')}
            className="relative w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-lg"
            aria-label="Notiser"
          >
            🔔
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-hallon text-white text-[10px] font-bold flex items-center justify-center">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-4 pb-28">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-blck/5 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-lg mx-auto grid grid-cols-5">
          {tabs.map(t => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-colors ${
                  isActive ? 'text-hallon' : 'text-blck/40'
                }`
              }
            >
              <span className="text-xl leading-none">{t.icon}</span>
              {t.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
