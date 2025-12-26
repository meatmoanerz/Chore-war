import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="home-page min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div style={{ fontSize: '64px', marginBottom: '8px' }}>🎮</div>
          <h1 style={{ color: '#1A1A1A', fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
            Chore War
          </h1>
          <p style={{ color: '#6B7280', fontSize: '16px', margin: 0 }}>
            Gör sysslor roliga för hela familjen!
          </p>
        </div>

        {/* Main Card */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            marginBottom: '16px'
          }}
        >
          {/* Illustration Area */}
          <div
            style={{
              background: 'linear-gradient(135deg, #EDE9FE 0%, #FCE7F3 100%)',
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '24px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '12px' }}>👨‍👩‍👧‍👦</div>
            <h2 style={{ color: '#1A1A1A', fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
              Great Job!
            </h2>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
              Samla poäng tillsammans och nå familjens mål för att låsa upp belöningar
            </p>
          </div>

          {/* Features List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0
              }}>✓</div>
              <div>
                <div style={{ fontWeight: '600', color: '#1A1A1A', fontSize: '15px' }}>Daily Challenges</div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>Slutför dagliga sysslor för att tjäna coins</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: '#EDE9FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0
              }}>⭐</div>
              <div>
                <div style={{ fontWeight: '600', color: '#1A1A1A', fontSize: '15px' }}>Samla poäng</div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>Tjäna coins för varje slutförd uppgift</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0
              }}>🏆</div>
              <div>
                <div style={{ fontWeight: '600', color: '#1A1A1A', fontSize: '15px' }}>Leaderboard</div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>Tävla med familjen på ett roligt sätt</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <Link
            to="/signup"
            style={{
              display: 'block',
              width: '100%',
              padding: '16px',
              background: '#1A1A1A',
              color: '#FFFFFF',
              borderRadius: '14px',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '16px',
              textDecoration: 'none',
              marginBottom: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            Kom igång gratis
          </Link>

          <Link
            to="/login"
            style={{
              display: 'block',
              width: '100%',
              padding: '16px',
              background: '#FFFFFF',
              color: '#1A1A1A',
              borderRadius: '14px',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '16px',
              textDecoration: 'none',
              border: '2px solid #E5E7EB'
            }}
          >
            Logga in
          </Link>
        </div>

        {/* Bottom Stats Cards */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div
            style={{
              flex: 1,
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '20px 16px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
            <div style={{ fontWeight: '700', color: '#1A1A1A', fontSize: '15px', marginBottom: '4px' }}>Sätt mål</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>Vecko & månads</div>
          </div>

          <div
            style={{
              flex: 1,
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '20px 16px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
            <div style={{ fontWeight: '700', color: '#1A1A1A', fontSize: '15px', marginBottom: '4px' }}>Belöningar</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>Lås upp priser</div>
          </div>
        </div>
      </div>
    </div>
  );
}
