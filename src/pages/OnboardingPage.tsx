import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type Step = 'welcome' | 'choose' | 'create-household' | 'join-household';

const AVATAR_EMOJIS = ['👧', '👦', '👩', '👨', '👴', '👵', '🧑', '👶', '🐱', '🐶', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯'];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [avatarEmoji, setAvatarEmoji] = useState('👤');
  const [householdName, setHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [role, setRole] = useState<'admin' | 'member' | 'child'>('member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreateProfile = async () => {
    if (!name.trim()) {
      setError('Ange ditt namn');
      return;
    }
    setError('');
    setStep('choose');
  };

  const handleCreateHousehold = async () => {
    if (!householdName.trim()) {
      setError('Ange ett namn för hushållet');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user!.id,
          name: name.trim(),
          avatar_emoji: avatarEmoji,
        });

      if (profileError) throw profileError;

      // Create household
      const { data: household, error: householdError } = await supabase
        .from('households')
        .insert({
          name: householdName.trim(),
          created_by: user!.id,
        })
        .select()
        .single();

      if (householdError) throw householdError;

      // Add user as admin member
      const { error: memberError } = await supabase
        .from('household_members')
        .insert({
          household_id: household.id,
          user_id: user!.id,
          role: 'admin',
        });

      if (memberError) throw memberError;

      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating household:', err);
      setError('Kunde inte skapa hushållet. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinHousehold = async () => {
    if (!inviteCode.trim()) {
      setError('Ange en inbjudningskod');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Find household by invite code
      const { data: household, error: findError } = await supabase
        .from('households')
        .select('id')
        .eq('invite_code', inviteCode.trim().toUpperCase())
        .single();

      if (findError || !household) {
        setError('Ogiltig inbjudningskod. Kontrollera och försök igen.');
        setLoading(false);
        return;
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user!.id,
          name: name.trim(),
          avatar_emoji: avatarEmoji,
        });

      if (profileError) throw profileError;

      // Add user as member
      const { error: memberError } = await supabase
        .from('household_members')
        .insert({
          household_id: household.id,
          user_id: user!.id,
          role: role,
        });

      if (memberError) throw memberError;

      navigate('/dashboard');
    } catch (err) {
      console.error('Error joining household:', err);
      setError('Kunde inte gå med i hushållet. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Progress indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
          {['welcome', 'choose', 'final'].map((s, i) => (
            <div
              key={s}
              style={{
                width: '40px',
                height: '4px',
                borderRadius: '2px',
                background: i <= (step === 'welcome' ? 0 : step === 'choose' ? 1 : 2) ? '#22C55E' : '#E5E7EB'
              }}
            />
          ))}
        </div>

        {/* Step: Welcome */}
        {step === 'welcome' && (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '32px 24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎮</div>
              <h1 style={{ color: '#1A1A1A', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                Välkommen till Chore War!
              </h1>
              <p style={{ color: '#6B7280', fontSize: '15px' }}>
                Låt oss börja med att sätta upp din profil
              </p>
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' }}>
                Vad heter du?
              </label>
              <input
                type="text"
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

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '12px' }}>
                Välj din avatar
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {AVATAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setAvatarEmoji(emoji)}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      border: avatarEmoji === emoji ? '3px solid #22C55E' : '2px solid #E5E7EB',
                      background: avatarEmoji === emoji ? '#DCFCE7' : '#F9FAFB',
                      fontSize: '24px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreateProfile}
              style={{
                width: '100%',
                padding: '16px',
                background: '#1A1A1A',
                color: '#FFFFFF',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Fortsätt
            </button>
          </div>
        )}

        {/* Step: Choose */}
        {step === 'choose' && (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '32px 24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px'
                }}
              >
                {avatarEmoji}
              </div>
              <h1 style={{ color: '#1A1A1A', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                Hej {name}! 👋
              </h1>
              <p style={{ color: '#6B7280', fontSize: '15px' }}>
                Vad vill du göra?
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => setStep('create-household')}
                style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                  color: '#FFFFFF',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)'
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>🏠</div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Skapa nytt hushåll</div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>Starta ett nytt hushåll och bjud in familjen</div>
              </button>

              <button
                onClick={() => setStep('join-household')}
                style={{
                  padding: '20px',
                  background: '#FFFFFF',
                  color: '#1A1A1A',
                  borderRadius: '16px',
                  border: '2px solid #E5E7EB',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔗</div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Gå med i hushåll</div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>Ange inbjudningskod för att gå med</div>
              </button>
            </div>

            <button
              onClick={() => setStep('welcome')}
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                color: '#6B7280',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                marginTop: '16px'
              }}
            >
              ← Tillbaka
            </button>
          </div>
        )}

        {/* Step: Create Household */}
        {step === 'create-household' && (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '32px 24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏠</div>
              <h1 style={{ color: '#1A1A1A', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                Skapa ditt hushåll
              </h1>
              <p style={{ color: '#6B7280', fontSize: '15px' }}>
                Ge ditt hushåll ett namn
              </p>
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

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' }}>
                Hushållets namn
              </label>
              <input
                type="text"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                placeholder="t.ex. Familjen Andersson"
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
              onClick={handleCreateHousehold}
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
                marginBottom: '12px',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)'
              }}
            >
              {loading ? 'Skapar...' : 'Skapa hushåll'}
            </button>

            <button
              onClick={() => setStep('choose')}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                color: '#6B7280',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ← Tillbaka
            </button>
          </div>
        )}

        {/* Step: Join Household */}
        {step === 'join-household' && (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '32px 24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔗</div>
              <h1 style={{ color: '#1A1A1A', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                Gå med i hushåll
              </h1>
              <p style={{ color: '#6B7280', fontSize: '15px' }}>
                Ange inbjudningskoden du fått
              </p>
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

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' }}>
                Inbjudningskod
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="t.ex. ABC12345"
                maxLength={8}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: '2px solid #E5E7EB',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1A1A1A',
                  background: '#FFFFFF',
                  outline: 'none',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  letterSpacing: '2px'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' }}>
                Din roll i hushållet
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { value: 'member', label: 'Vuxen', emoji: '👨' },
                  { value: 'child', label: 'Barn', emoji: '👧' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setRole(option.value as 'member' | 'child')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: role === option.value ? '#DCFCE7' : '#F9FAFB',
                      border: role === option.value ? '2px solid #22C55E' : '2px solid #E5E7EB',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{option.emoji}</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A' }}>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleJoinHousehold}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: loading ? '#9CA3AF' : '#1A1A1A',
                color: '#FFFFFF',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '12px'
              }}
            >
              {loading ? 'Går med...' : 'Gå med i hushåll'}
            </button>

            <button
              onClick={() => setStep('choose')}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                color: '#6B7280',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ← Tillbaka
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
