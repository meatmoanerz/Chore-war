import { useState } from 'react';

export default function DashboardPage() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Plocka ur diskmaskinen', points: 50, completed: true, time: '10 min' },
    { id: 2, title: 'Dammsuga vardagsrummet', points: 100, completed: true, time: '20 min' },
    { id: 3, title: 'Ta ut soporna', points: 30, completed: false, time: '5 min' },
    { id: 4, title: 'Bädda sängen', points: 25, completed: false, time: '5 min' },
    { id: 5, title: 'Vika tvätten', points: 75, completed: false, time: '15 min' },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalPoints = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0);

  return (
    <div className="dashboard-page min-h-screen px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>Välkommen tillbaka,</p>
            <h1 style={{ color: '#1A1A1A', fontSize: '24px', fontWeight: '700', margin: 0 }}>Emma! 👋</h1>
          </div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #EDE9FE 0%, #FCE7F3 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}
          >
            👧
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              flex: 1,
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '20px 16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🏆</div>
            <div style={{ fontWeight: '700', color: '#1A1A1A', fontSize: '24px', marginBottom: '4px' }}>1,247</div>
            <div style={{ fontSize: '13px', color: '#6B7280' }}>Totala poäng</div>
          </div>

          <div
            style={{
              flex: 1,
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '20px 16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>⭐</div>
            <div style={{ fontWeight: '700', color: '#1A1A1A', fontSize: '24px', marginBottom: '4px' }}>12</div>
            <div style={{ fontSize: '13px', color: '#6B7280' }}>Dagar i rad</div>
          </div>
        </div>

        {/* Weekly Progress Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
            borderRadius: '24px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 8px 24px rgba(34, 197, 94, 0.25)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginBottom: '4px' }}>Veckomål</div>
              <div style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: '700' }}>85%</div>
            </div>
            <div style={{ fontSize: '48px' }}>🎯</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '10px', height: '8px' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '10px', height: '8px', width: '85%' }}></div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', marginTop: '12px' }}>
            300 / 400 poäng - Bara 100 poäng kvar!
          </div>
        </div>

        {/* Today's Tasks Card */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#1A1A1A', fontSize: '18px', fontWeight: '700', margin: 0 }}>
              Dagens sysslor
            </h2>
            <div style={{
              background: '#DCFCE7',
              color: '#16A34A',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {completedCount}/{tasks.length}
            </div>
          </div>

          {/* Task List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px',
                  borderRadius: '16px',
                  background: task.completed ? '#F0FDF4' : '#F9FAFB',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Checkbox */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: task.completed ? 'none' : '2px solid #D1D5DB',
                    background: task.completed ? '#22C55E' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {task.completed && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>

                {/* Task Info */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '500',
                    color: task.completed ? '#16A34A' : '#1A1A1A',
                    fontSize: '15px',
                    textDecoration: task.completed ? 'line-through' : 'none'
                  }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                    {task.time}
                  </div>
                </div>

                {/* Points */}
                <div style={{
                  fontWeight: '700',
                  color: task.completed ? '#22C55E' : '#1A1A1A',
                  fontSize: '15px'
                }}>
                  +{task.points}
                </div>
              </div>
            ))}
          </div>

          {/* Points earned today */}
          <div style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#6B7280', fontSize: '14px' }}>Poäng idag</span>
            <span style={{ color: '#22C55E', fontSize: '20px', fontWeight: '700' }}>+{totalPoints}</span>
          </div>
        </div>

        {/* Leaderboard Card */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            marginBottom: '20px'
          }}
        >
          <h2 style={{ color: '#1A1A1A', fontSize: '18px', fontWeight: '700', margin: 0, marginBottom: '20px' }}>
            🏆 Leaderboard
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { rank: 1, name: 'Emma', points: 450, emoji: '👧', bg: '#FEF3C7' },
              { rank: 2, name: 'Oscar', points: 380, emoji: '👦', bg: '#EDE9FE' },
              { rank: 3, name: 'Lisa', points: 320, emoji: '👩', bg: '#FCE7F3' },
            ].map((user) => (
              <div
                key={user.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px',
                  borderRadius: '16px',
                  background: user.rank === 1 ? '#FFFBEB' : '#F9FAFB'
                }}
              >
                <div style={{ fontSize: '24px', width: '32px', textAlign: 'center' }}>
                  {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                </div>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: user.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}
                >
                  {user.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#1A1A1A', fontSize: '15px' }}>{user.name}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>{user.points} poäng</div>
                </div>
                {user.rank === 1 && (
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1,2,3,4,5].map(i => (
                      <span key={i} style={{ fontSize: '14px' }}>⭐</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Family Goal Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #EDE9FE 0%, #FCE7F3 100%)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '48px' }}>🎉</div>
            <div>
              <h3 style={{ color: '#1A1A1A', fontSize: '18px', fontWeight: '700', margin: 0, marginBottom: '4px' }}>
                Familjemål uppnått!
              </h3>
              <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
                1,200 / 1,000 poäng
              </p>
            </div>
          </div>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{ fontSize: '32px' }}>🏊</div>
            <div>
              <div style={{ fontWeight: '600', color: '#1A1A1A', fontSize: '15px' }}>Belöning upplåst!</div>
              <div style={{ fontSize: '13px', color: '#6B7280' }}>Hela familjen går på äventyrsbad</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
