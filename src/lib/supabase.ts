import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          current_role?: string;
          target_role?: string;
          experience_level?: string;
          preferred_difficulty?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          current_role?: string;
          target_role?: string;
          experience_level?: string;
          preferred_difficulty?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          current_role?: string;
          target_role?: string;
          experience_level?: string;
          preferred_difficulty?: string;
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
          difficulty: string;
          industry: string;
          duration: number;
          status: 'pending' | 'in-progress' | 'completed';
          started_at: string;
          completed_at?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          experience_level: string;
          interview_type: string;
          difficulty: string;
          industry: string;
          duration: number;
          status?: 'pending' | 'in-progress' | 'completed';
          started_at?: string;
          completed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          experience_level?: string;
          interview_type?: string;
          difficulty?: string;
          industry?: string;
          duration?: number;
          status?: 'pending' | 'in-progress' | 'completed';
          started_at?: string;
          completed_at?: string;
          created_at?: string;
        };
      };
      interview_questions: {
        Row: {
          id: string;
          interview_id: string;
          question: string;
          question_type: 'behavioral' | 'technical' | 'situational';
          difficulty: 'easy' | 'medium' | 'hard';
          category: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          interview_id: string;
          question: string;
          question_type: 'behavioral' | 'technical' | 'situational';
          difficulty: 'easy' | 'medium' | 'hard';
          category: string;
          order_index: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          interview_id?: string;
          question?: string;
          question_type?: 'behavioral' | 'technical' | 'situational';
          difficulty?: 'easy' | 'medium' | 'hard';
          category?: string;
          order_index?: number;
          created_at?: string;
        };
      };
      interview_responses: {
        Row: {
          id: string;
          interview_id: string;
          question_id: string;
          response_text: string;
          response_duration: number;
          audio_url?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          interview_id: string;
          question_id: string;
          response_text: string;
          response_duration: number;
          audio_url?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          interview_id?: string;
          question_id?: string;
          response_text?: string;
          response_duration?: number;
          audio_url?: string;
          created_at?: string;
        };
      };
      performance_metrics: {
        Row: {
          id: string;
          interview_id: string;
          overall_score: number;
          communication_score: number;
          technical_score: number;
          problem_solving_score: number;
          confidence_score: number;
          strengths: string[];
          improvements: string[];
          recommendations: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          interview_id: string;
          overall_score: number;
          communication_score: number;
          technical_score: number;
          problem_solving_score: number;
          confidence_score: number;
          strengths: string[];
          improvements: string[];
          recommendations: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          interview_id?: string;
          overall_score?: number;
          communication_score?: number;
          technical_score?: number;
          problem_solving_score?: number;
          confidence_score?: number;
          strengths?: string[];
          improvements?: string[];
          recommendations?: string[];
          created_at?: string;
        };
      };
    };
  };
};