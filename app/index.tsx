import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { supabase } from '../src/lib/supabase';
import AuthScreen from '../src/screens/AuthScreen';
import OnboardingScreen from '../src/screens/OnboardingScreen';
import TabNavigator from '../src/navigation/TabNavigator';

export default function Index() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    console.log('Loading profile for userId:', userId);
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    console.log('Loaded profile:', data, 'Error:', error);
    setProfile(data);
    setLoading(false);
  };

  const handleOnboardingComplete = async (profileData) => {
    const { name, role, location, budget, lifestyle, smoking, pets, bio } = profileData;
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, name, role, location, budget, lifestyle, smoking, pets, bio })
      .select()
      .single();
    if (error) { console.log('Error saving profile:', error); return; }
    setProfile(data);
  };

  if (loading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f7ff' }}><ActivityIndicator size='large' color='#534AB7' /></View>;
  }

  if (!user) return <AuthScreen onAuth={(u) => setUser(u)} />;
  if (!profile) return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  return <TabNavigator userProfile={profile} />;
}