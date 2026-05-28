import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uwgmkazkusuvwyfhtpuu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3Z21rYXprdXN1dnd5Zmh0cHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNjg3NzUsImV4cCI6MjA5NDY0NDc3NX0.u3SIFeaI03NIPqSq6YG3C4sK3lTRWrF_qhXmWmmp3S4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);