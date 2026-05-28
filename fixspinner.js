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
  "    if (!currentUserId) {",
  "      setLoading(false);",
  "      return;",
  "    }",
  "    supabase",
  "      .from('profiles')",
  "      .select('*')",
  "      .neq('id', currentUserId)",
  "      .then(({ data, error }) => {",
  "        if (error) console.log('Error fetching profiles:', error);",
  "        setProfiles(data || []);",
  "        setLoading(false);",
  "      });",
  "  }, [currentUserId]);",
  "",
  "  return { profiles, loading };",
  "}",
].join('\n'), 'utf8');

console.log('Fixed! App will reload automatically.');
