
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nbtuyrieidgqmntvahvn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5idHV5cmllaWRncW1udHZhaHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMjY1OTEsImV4cCI6MjA4MzkwMjU5MX0.uUmn7euq4GwygfY54F2z6S3ZEUmUGfoo1D9dMvDhvP0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
