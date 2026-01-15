import { createClient } from '@supabase/supabase-js';
import { Profile } from '../types';

const SUPABASE_URL = 'https://nbtuyrieidgqmntvahvn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5idHV5cmllaWRncW1udHZhaHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMjY1OTEsImV4cCI6MjA4MzkwMjU5MX0.uUmn7euq4GwygfY54F2z6S3ZEUmUGfoo1D9dMvDhvP0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getOrCreateProfile = async (userId: string, email: string, fullName: string): Promise<Profile | null> => {
  try {
    // 1. Try to fetch existing profile
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      return existingProfile as Profile;
    }

    // 2. If not found, create new profile
    const newProfile = {
      id: userId,
      email: email,
      full_name: fullName,
      is_active: false,
    };

    const { data: createdProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating profile:', insertError);
      // Double check if it was created in a race condition
      const { data: retryProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (retryProfile) return retryProfile as Profile;
      return null;
    }

    return createdProfile as Profile;

  } catch (error) {
    console.error('Unexpected error in getOrCreateProfile:', error);
    return null;
  }
};