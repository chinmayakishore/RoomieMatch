import { useState, useEffect } from 'react';
import { getCompatibilityScore } from '../lib/claudeApi';

const cache = new Map();

export default function useCompatibility(userProfile, candidateProfile) {
  const [score, setScore] = useState(null);
  const [reason, setReason] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userProfile?.id || !candidateProfile?.id) return;

    const key = `${userProfile.id}:${candidateProfile.id}`;

    if (cache.has(key)) {
      const cached = cache.get(key);
      setScore(cached.score);
      setReason(cached.reason);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setScore(null);
    setReason(null);

    getCompatibilityScore(userProfile, candidateProfile)
      .then(result => {
        if (!cancelled) {
          cache.set(key, result);
          setScore(result.score);
          setReason(result.reason);
        }
      })
      .catch(err => {
        if (!cancelled) console.warn('Compatibility score failed:', err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [userProfile?.id, candidateProfile?.id]);

  return { score, reason, loading };
}
