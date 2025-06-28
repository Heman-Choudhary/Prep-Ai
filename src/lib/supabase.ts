import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  throw new Error('Supabase credentials not configured. Please check your environment variables.');
}

// Validate that the URLs are not placeholder values
if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
  throw new Error('Supabase credentials contain placeholder values. Please set up your Supabase project.');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

export type Database = {
  public: {
    Tables: {
      users: {
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
      interview_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_type: string;
          role: string;
          experience_level: string;
          difficulty: string;
          industry: string;
          duration_minutes: number;
          status: string;
          started_at: string | null;
          completed_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_type: string;
          role: string;
          experience_level: string;
          difficulty: string;
          industry: string;
          duration_minutes?: number;
          status?: string;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_type?: string;
          role?: string;
          experience_level?: string;
          difficulty?: string;
          industry?: string;
          duration_minutes?: number;
          status?: string;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      interview_questions: {
        Row: {
          id: string;
          session_id: string;
          question_text: string;
          question_type: string;
          difficulty: string;
          category: string;
          order_index: number;
          expected_duration_seconds: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          question_text: string;
          question_type: string;
          difficulty: string;
          category: string;
          order_index: number;
          expected_duration_seconds?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          question_text?: string;
          question_type?: string;
          difficulty?: string;
          category?: string;
          order_index?: number;
          expected_duration_seconds?: number | null;
          created_at?: string | null;
        };
      };
      interview_responses: {
        Row: {
          id: string;
          session_id: string;
          question_id: string;
          response_text: string;
          response_duration_seconds: number;
          audio_url: string | null;
          confidence_score: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          question_id: string;
          response_text: string;
          response_duration_seconds?: number;
          audio_url?: string | null;
          confidence_score?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          question_id?: string;
          response_text?: string;
          response_duration_seconds?: number;
          audio_url?: string | null;
          confidence_score?: number | null;
          created_at?: string | null;
        };
      };
      interview_feedback: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          overall_score: number;
          communication_score: number;
          technical_score: number;
          problem_solving_score: number;
          confidence_score: number;
          strengths: string[];
          improvements: string[];
          recommendations: string[];
          detailed_feedback: string;
          response_quality_score: number | null;
          clarity_score: number | null;
          relevance_score: number | null;
          ai_insights: any | null;
          improvement_areas: any | null;
          skill_breakdown: any | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          overall_score: number;
          communication_score: number;
          technical_score: number;
          problem_solving_score: number;
          confidence_score: number;
          strengths?: string[];
          improvements?: string[];
          recommendations?: string[];
          detailed_feedback: string;
          response_quality_score?: number | null;
          clarity_score?: number | null;
          relevance_score?: number | null;
          ai_insights?: any | null;
          improvement_areas?: any | null;
          skill_breakdown?: any | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string;
          overall_score?: number;
          communication_score?: number;
          technical_score?: number;
          problem_solving_score?: number;
          confidence_score?: number;
          strengths?: string[];
          improvements?: string[];
          recommendations?: string[];
          detailed_feedback?: string;
          response_quality_score?: number | null;
          clarity_score?: number | null;
          relevance_score?: number | null;
          ai_insights?: any | null;
          improvement_areas?: any | null;
          skill_breakdown?: any | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          skill_area: string;
          current_score: number;
          previous_score: number | null;
          improvement_rate: number | null;
          sessions_count: number | null;
          last_session_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_area: string;
          current_score: number;
          previous_score?: number | null;
          improvement_rate?: number | null;
          sessions_count?: number | null;
          last_session_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill_area?: string;
          current_score?: number;
          previous_score?: number | null;
          improvement_rate?: number | null;
          sessions_count?: number | null;
          last_session_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      feedback_analytics: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          performance_trend: any | null;
          skill_progression: any | null;
          comparative_analysis: any | null;
          response_patterns: any | null;
          improvement_velocity: number | null;
          consistency_score: number | null;
          predicted_next_score: number | null;
          recommended_focus_areas: string[] | null;
          estimated_improvement_time_days: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          performance_trend?: any | null;
          skill_progression?: any | null;
          comparative_analysis?: any | null;
          response_patterns?: any | null;
          improvement_velocity?: number | null;
          consistency_score?: number | null;
          predicted_next_score?: number | null;
          recommended_focus_areas?: string[] | null;
          estimated_improvement_time_days?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string;
          performance_trend?: any | null;
          skill_progression?: any | null;
          comparative_analysis?: any | null;
          response_patterns?: any | null;
          improvement_velocity?: number | null;
          consistency_score?: number | null;
          predicted_next_score?: number | null;
          recommended_focus_areas?: string[] | null;
          estimated_improvement_time_days?: number | null;
          created_at?: string | null;
        };
      };
    };
  };
};