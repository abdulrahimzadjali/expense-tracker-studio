
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pkfoozmyjmosabmdyzrc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZm9vem15am1vc2FibWR5enJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjIyODgsImV4cCI6MjA3NzU5ODI4OH0.WMZYJ5UGE4aQNHUPR1HzMepbZeH1GRG36dBWFQEHjxM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
