import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vniieysrmvvrfamaleqg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuaWlleXNybXZ2cmZhbWFsZXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NjU2MTAsImV4cCI6MjA3MDA0MTYxMH0.-zfFJli8mDUbmzxPjVXcxmaYMykuJ6Ss7hXeZWE-tWY';

export const supabase = createClient(supabaseUrl, supabaseKey);