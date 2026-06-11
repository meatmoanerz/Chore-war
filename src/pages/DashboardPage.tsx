import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Chore, ChoreCompletion, HouseholdMember, Profile } from '../types/database';

interface MemberWithPoints extends HouseholdMember {
  profile: Profile;
  total_points: number;
}

export default function DashboardPage() {
  const { profile, household, householdMember, signOut } = useAuth();
  const [chores, setChores] = useState<Chore[]>([]);
  const [todayCompletions, setTodayCompletions] = useState<ChoreCompletion[]>([]);
  const [members, setMembers] = useState<MemberWithPoints[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [showAddChore, setShowAddChore] = useState(false);
  const [newChoreTitle, setNewChoreTitle] = useState('');
  const [newChorePoints, setNewChorePoints] = useState(10);
  const [newChoreTime, setNewChoreTime] = useState(10);

  useEffect(() => {
    if (household) {
      fetchData();
    }
  }, [household]);

  const fetchData = async () => {
    if (!household) return;

    try {
      // Fetch chores
      const { data: choresData } = await supabase
        .from('chores')
        .select('*')
        .eq('household_id', household.id)
        .order('created_at', { ascending: false });

      setChores(choresData || []);

      // Fetch today's completions
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: completionsData } = await supabase
        .from('chore_completions')
        .select('*')
        .eq('household_id', household.id)
        .gte('completed_at', today.toISOString());

      setTodayCompletions(completionsData || []);

      // Fetch all members with their profiles and points
      const { data: membersData } = await supabase
        .from('household_members')
        .select('*, profiles(*)')
        .eq('household_id', household.id);

      if (membersData) {
        // Calculate points for each member
        const membersWithPoints = await Promise.all(
          membersData.map(async (member) => {
            const { data: pointsData } = await supabase
              .from('chore_completions')
              .select('points_earned')
              .eq('user_id', member.user_id)
              .eq('household_id', household.id);

            const total = pointsData?.reduce((sum, c) => sum + c.points_earned, 0) || 0;

            return {
              ...member,
              profile: member.profiles as unknown as Profile,
              total_points: total,
            };
          })
        );

        // Sort by points
        membersWithPoints.sort((a, b) => b.total_points - a.total_points);
        setMembers(membersWithPoints);

        // Set current user's total points
        const currentMember = membersWithPoints.find(m => m.user_id === profile?.user_id);
        setTotalPoints(currentMember?.total_points || 0);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteChore = async (chore: Chore) => {
    if (!profile || !household) return;

    try {
      const { error } = await supabase
        .from('chore_completions')
        .insert({
          chore_id: chore.id,
          user_id: profile.user_id,
          household_id: household.id,
          points_earned: chore.points,
        });

      if (error) throw error;

      // Refresh data
      fetchData();
    } catch (err) {
      console.error('Error completing chore:', err);
    }
  };

  const handleAddChore = async () => {
    if (!newChoreTitle.trim() || !household || !profile) return;

    try {
      const { error } = await supabase
        .from('chores')
        .insert({
          household_id: household.id,
          title: newChoreTitle.trim(),
          points: newChorePoints,
          estimated_minutes: newChoreTime,
          created_by: profile.user_id,
        });

      if (error) throw error;

      setNewChoreTitle('');
      setNewChorePoints(10);
      setNewChoreTime(10);
      setShowAddChore(false);
      fetchData();
    } catch (err) {
      console.error('Error adding chore:', err);
    }
  };

  const isChoreCompletedToday = (choreId: string) => {
    return todayCompletions.some(c => c.chore_id === choreId && c.user_id === profile?.user_id);
  };

  const todayPointsEarned = todayCompletions
    .filter(c => c.user_id === profile?.user_id)
    .reduce((sum, c) => sum + c.points_earned, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎮</div>
          <p style={{ color: '#6B7280', fontSize: '16px' }}>Laddar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page min-h-screen px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>
              {household?.name}
            </p>
            <h1 style={{ color: '#1A1A1A', fontSize: '24px', fontWeight: '700', margin: 0 }}>
              Hej {profile?.name}! 👋
            </h1>
          </div>
          <button
            onClick={() => signOut()}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #EDE9FE 0%, #FCE7F3 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {profile?.avatar_emoji || '👤'}
          </button>
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
            <div style={{ fontWeight: '700', color: '#1A1A1A', fontSize: '24px', marginBottom: '4px' }}>
              {totalPoints}
            </div>
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
            <div style={{ fontWeight: '700', color: '#1A1A1A', fontSize: '24px', marginBottom: '4px' }}>
              +{todayPointsEarned}
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280' }}>Poäng idag</div>
          </div>
        </div>

        {/* Invite Code Card */}
        {householdMember?.role === 'admin' && (
          <div
            onClick={() => setShowInviteCode(!showInviteCode)}
            style={{
              background: 'linear-gradient(135deg, #EDE9FE 0%, #FCE7F3 100%)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>🔗</span>
                <div>
                  <div style={{ fontWeight: '600', color: '#1A1A1A', fontSize: '14px' }}>Bjud in familjen</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>Tryck för att visa kod</div>
                </div>
              </div>
              <span style={{ fontSize: '20px' }}>{showInviteCode ? '👆' : '👇'}</span>
            </div>
            {showInviteCode && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                background: '#FFFFFF',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '4px', color: '#1A1A1A' }}>
                  {household?.invite_code}
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                  Dela denna kod med familjemedlemmar
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chores Card */}
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
              Sysslor
            </h2>
            {householdMember?.role === 'admin' && (
              <button
                onClick={() => setShowAddChore(!showAddChore)}
                style={{
                  background: '#DCFCE7',
                  color: '#16A34A',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                + Lägg till
              </button>
            )}
          </div>

          {/* Add Chore Form */}
          {showAddChore && (
            <div style={{
              background: '#F9FAFB',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <input
                type="text"
                value={newChoreTitle}
                onChange={(e) => setNewChoreTitle(e.target.value)}
                placeholder="Sysslans namn"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '2px solid #E5E7EB',
                  fontSize: '14px',
                  marginBottom: '12px',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#6B7280' }}>Poäng</label>
                  <input
                    type="number"
                    value={newChorePoints}
                    onChange={(e) => setNewChorePoints(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '2px solid #E5E7EB',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#6B7280' }}>Minuter</label>
                  <input
                    type="number"
                    value={newChoreTime}
                    onChange={(e) => setNewChoreTime(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '2px solid #E5E7EB',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              <button
                onClick={handleAddChore}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#22C55E',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Spara
              </button>
            </div>
          )}

          {/* Chore List */}
          {chores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
              <p>Inga sysslor ännu. Lägg till din första!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chores.map((chore) => {
                const isCompleted = isChoreCompletedToday(chore.id);
                return (
                  <div
                    key={chore.id}
                    onClick={() => !isCompleted && handleCompleteChore(chore)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px',
                      borderRadius: '16px',
                      background: isCompleted ? '#F0FDF4' : '#F9FAFB',
                      cursor: isCompleted ? 'default' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Checkbox */}
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: isCompleted ? 'none' : '2px solid #D1D5DB',
                        background: isCompleted ? '#22C55E' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {isCompleted && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>

                    {/* Task Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: '500',
                        color: isCompleted ? '#16A34A' : '#1A1A1A',
                        fontSize: '15px',
                        textDecoration: isCompleted ? 'line-through' : 'none'
                      }}>
                        {chore.title}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                        {chore.estimated_minutes} min
                      </div>
                    </div>

                    {/* Points */}
                    <div style={{
                      fontWeight: '700',
                      color: isCompleted ? '#22C55E' : '#1A1A1A',
                      fontSize: '15px'
                    }}>
                      +{chore.points}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Leaderboard Card */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}
        >
          <h2 style={{ color: '#1A1A1A', fontSize: '18px', fontWeight: '700', margin: 0, marginBottom: '20px' }}>
            🏆 Leaderboard
          </h2>

          {members.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>
              <p>Inga medlemmar ännu</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {members.map((member, index) => (
                <div
                  key={member.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: '16px',
                    background: index === 0 ? '#FFFBEB' : '#F9FAFB'
                  }}
                >
                  <div style={{ fontSize: '24px', width: '32px', textAlign: 'center' }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </div>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: index === 0 ? '#FEF3C7' : index === 1 ? '#EDE9FE' : '#FCE7F3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}
                  >
                    {member.profile?.avatar_emoji || '👤'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1A1A1A', fontSize: '15px' }}>
                      {member.profile?.name}
                      {member.user_id === profile?.user_id && ' (du)'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>
                      {member.total_points} poäng
                    </div>
                  </div>
                  {index === 0 && member.total_points > 0 && (
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(i => (
                        <span key={i} style={{ fontSize: '14px' }}>⭐</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
