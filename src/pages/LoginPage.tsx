import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="login-page min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎮</div>
          <h1 style={{ color: '#1A1A1A', fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>
            Chore War
          </h1>
          <p style={{ color: '#6B7280', fontSize: '15px', margin: 0 }}>
            Välkommen tillbaka!
          </p>
        </div>

        {/* Login Card */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}
        >
          {/* Avatar/Profile placeholder */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #EDE9FE 0%, #FCE7F3 100%)',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px'
              }}
            >
              👋
            </div>
          </div>

          <form>
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="email"
                style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' }}
              >
                E-post
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="din@email.se"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: '2px solid #E5E7EB',
                  fontSize: '15px',
                  color: '#1A1A1A',
                  background: '#FFFFFF',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="password"
                style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' }}
              >
                Lösenord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: '2px solid #E5E7EB',
                  fontSize: '15px',
                  color: '#1A1A1A',
                  background: '#FFFFFF',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ width: '18px', height: '18px', accentColor: '#22C55E', borderRadius: '4px' }}
                />
                <span style={{ fontSize: '14px', color: '#6B7280' }}>Kom ihåg mig</span>
              </label>
              <a href="#" style={{ fontSize: '14px', color: '#1A1A1A', fontWeight: '500', textDecoration: 'none' }}>
                Glömt lösenord?
              </a>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                background: '#1A1A1A',
                color: '#FFFFFF',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              Logga in
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
              <span style={{ padding: '0 16px', color: '#6B7280', fontSize: '14px' }}>eller</span>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              style={{
                width: '100%',
                padding: '14px',
                background: '#FFFFFF',
                color: '#1A1A1A',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: '500',
                border: '2px solid #E5E7EB',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Fortsätt med Google
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6B7280' }}>
            Inget konto än?{' '}
            <Link to="/signup" style={{ color: '#1A1A1A', fontWeight: '600', textDecoration: 'none' }}>
              Registrera dig här
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
