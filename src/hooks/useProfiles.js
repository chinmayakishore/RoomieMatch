import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export default function useProfiles(currentUserId, refreshTrigger) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) { setLoading(false); return; }
    fetchProfiles();
  }, [currentUserId, refreshTrigger]);

  const fetchProfiles = async () => {
    // Get already matched user IDs
    const { data: matchData } = await supabase
      .from('matches')
      .select('matched_user_id, user_id')
      .or('user_id.eq.' + currentUserId + ',matched_user_id.eq.' + currentUserId);

    const matchedIds = new Set();
    (matchData || []).forEach(m => {
      if (m.user_id !== currentUserId) matchedIds.add(m.user_id);
      if (m.matched_user_id !== currentUserId) matchedIds.add(m.matched_user_id);
    });

    console.log('Excluding matched IDs:', [...matchedIds]);

    let query = supabase.from('profiles').select('*').neq('id', currentUserId);
    if (matchedIds.size > 0) {
      query = query.not('id', 'in', '(' + [...matchedIds].join(',') + ')');
    }
    const { data, error } = await query;
    if (error) console.log('Error fetching profiles:', error);
    setProfiles(data || []);
    setLoading(false);
  };

  return { profiles, loading };
}