import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)' }}
    >
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#7c3aed' }}>
            Chore War
          </h1>
          <h2 className="text-2xl font-bold" style={{ color: '#1f2937' }}>
            Välkommen tillbaka!
          </h2>
          <p className="mt-2" style={{ color: '#4b5563' }}>
            Logga in för att fortsätta
          </p>
        </div>

        <form
          className="mt-8 space-y-6 p-8 rounded-2xl"
          style={{ backgroundColor: '#ffffff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
                style={{ color: '#374151' }}
              >
                E-post
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2"
                style={{
                  border: '1px solid #d1d5db',
                  color: '#111827',
                  backgroundColor: '#ffffff'
                }}
                placeholder="din@email.se"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
                style={{ color: '#374151' }}
              >
                Lösenord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2"
                style={{
                  border: '1px solid #d1d5db',
                  color: '#111827',
                  backgroundColor: '#ffffff'
                }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded"
                style={{ accentColor: '#7c3aed' }}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm" style={{ color: '#374151' }}>
                Kom ihåg mig
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium" style={{ color: '#7c3aed' }}>
                Glömt lösenord?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 text-base font-medium rounded-xl transition-colors"
              style={{
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)'
              }}
            >
              Logga in
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid #d1d5db' }}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2" style={{ backgroundColor: '#ffffff', color: '#6b7280' }}>Eller</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-base font-medium transition-colors"
              style={{
                border: '1px solid #d1d5db',
                color: '#374151',
                backgroundColor: '#ffffff'
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Fortsätt med Google
            </button>
          </div>

          <div className="text-center text-sm" style={{ color: '#4b5563' }}>
            Inget konto än?{' '}
            <Link to="/signup" className="font-medium" style={{ color: '#7c3aed' }}>
              Registrera dig här
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
