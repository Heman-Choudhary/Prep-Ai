import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please check your environment variables.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      interviews: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          experience_level: string;
          interview_type: string;
          duration_minutes: number;
          difficulty: string;
          score: number | null;
          feedback: string | null;
          questions: string[];
          responses: string[];
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          experience_level: string;
          interview_type: string;
          duration_minutes: number;
          difficulty: string;
          score?: number | null;
          feedback?: string | null;
          questions?: string[];
          responses?: string[];
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          experience_level?: string;
          interview_type?: string;
          duration_minutes?: number;
          difficulty?: string;
          score?: number | null;
          feedback?: string | null;
          questions?: string[];
          responses?: string[];
          created_at?: string;
          completed_at?: string | null;
        };
      };
    };
  };
};