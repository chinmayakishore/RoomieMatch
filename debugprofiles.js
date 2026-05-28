const fs = require('fs');

fs.writeFileSync('src/hooks/useProfiles.js', [
  "import { useState, useEffect } from 'react';",
  "import { supabase } from '../lib/supabase';",
  "",
  "export default function useProfiles(currentUserId) {",
  "  const [profiles, setProfiles] = useState([]);",
  "  const [loading, setLoading] = useState(true);",
  "",
  "  useEffect(() => {",
  "    console.log('useProfiles called with userId:', currentUserId);",
  "    if (!currentUserId) {",
  "      console.log('No userId, stopping');",
  "      setLoading(false);",
  "      return;",
  "    }",
  "    supabase",
  "      .from('profiles')",
  "      .select('*')",
  "      .neq('id', currentUserId)",
  "      .then(({ data, error }) => {",
  "        console.log('Profiles fetched:', data, 'Error:', error);",
  "        setProfiles(data || []);",
  "        setLoading(false);",
  "      });",
  "  }, [currentUserId]);",
  "",
  "  return { profiles, loading };",
  "}",
].join('\n'), 'utf8');

console.log('Debug logging added!');
