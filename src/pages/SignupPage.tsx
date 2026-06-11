import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }

    if (password.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, name);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="signup-page min-h-screen px-4 py-8">
        <div className="max-w-md mx-auto">
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '40px 28px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ color: '#1A1A1A', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
              Välkommen till Chore War!
            </h2>
            <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '24px' }}>
              Kolla din e-post för att bekräfta ditt konto.
            </p>
            <div style={{
              background: '#DCFCE7',
              color: '#16A34A',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Omdirigerar till dashboard...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎮</div>
          <h1 style={{ color: '#1A1A1A', fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>
            Chore War
          </h1>
          <p style={{ color: '#6B7280', fontSize: '15px', margin: 0 }}>
            Skapa ditt konto
          </p>
        </div>

        {/* Signup Card */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}
        >
          {/* Avatar placeholder */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px'
              }}
            >
              ✨
            </div>
          </div>

          {error && (
            <div style={{
              background: '#FEF2F2',
              color: '#DC2626',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="name"
                style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' }}
              >
                Namn
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ditt namn"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minst 6 tecken"
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

            <div style={{ marginBottom: '24px' }}>
              <label
                htmlFor="confirmPassword"
                style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' }}
              >
                Bekräfta lösenord
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Upprepa lösenord"
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

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: loading ? '#9CA3AF' : '#22C55E',
                color: '#FFFFFF',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)'
              }}
            >
              {loading ? 'Skapar konto...' : 'Skapa konto'}
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
            Har du redan ett konto?{' '}
            <Link to="/login" style={{ color: '#1A1A1A', fontWeight: '600', textDecoration: 'none' }}>
              Logga in här
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
