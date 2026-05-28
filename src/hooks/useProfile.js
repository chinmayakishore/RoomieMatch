import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function useProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    supabase.from('profiles').select('*').eq('id', userId).single()
      .then(({ data }) => { setProfile(data); setLoading(false); });
  }, [userId]);

  const saveProfile = async (profileData) => {
    const { data, error } = await supabase.from('profiles').upsert({ id: userId, ...profileData }).select().single();
    if (!error) setProfile(data);
    return { data, error };
  };

  return { profile, loading, saveProfile };
}