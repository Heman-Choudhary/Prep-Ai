/*
  # Comprehensive Interview System Enhancement

  1. New Tables
    - `interview_sessions` - Core interview session data
    - `interview_feedback` - Detailed feedback and analytics
    - `user_progress` - User progress tracking
    - `feedback_analytics` - Advanced analytics data
    
  2. Enhanced Tables
    - Update existing tables with better structure
    - Add proper relationships and constraints
    
  3. Security
    - Enable RLS on all tables
    - Add comprehensive policies for data access
*/

-- Create interview_sessions table
CREATE TABLE IF NOT EXISTS interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_type text NOT NULL CHECK (session_type IN ('technical', 'behavioral', 'mixed', 'case')),
  role text NOT NULL,
  experience_level text NOT NULL CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead')),
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  industry text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create interview_questions table
CREATE TABLE IF NOT EXISTS interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES interview_sessions(id) ON DELETE CASCADE NOT NULL,
  question_text text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('behavioral', 'technical', 'situational')),
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category text NOT NULL,
  order_index integer NOT NULL,
  expected_duration_seconds integer DEFAULT 120,
  created_at timestamptz DEFAULT now()
);

-- Create interview_responses table
CREATE TABLE IF NOT EXISTS interview_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES interview_sessions(id) ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES interview_questions(id) ON DELETE CASCADE NOT NULL,
  response_text text NOT NULL,
  response_duration_seconds integer NOT NULL DEFAULT 0,
  audio_url text,
  confidence_score integer CHECK (confidence_score >= 0 AND confidence_score <= 100),
  created_at timestamptz DEFAULT now()
);

-- Create comprehensive interview_feedback table
CREATE TABLE IF NOT EXISTS interview_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES interview_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Overall scores
  overall_score integer NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  communication_score integer NOT NULL CHECK (communication_score >= 0 AND communication_score <= 100),
  technical_score integer NOT NULL CHECK (technical_score >= 0 AND technical_score <= 100),
  problem_solving_score integer NOT NULL CHECK (problem_solving_score >= 0 AND problem_solving_score <= 100),
  confidence_score integer NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  
  -- Detailed feedback
  strengths text[] NOT NULL DEFAULT '{}',
  improvements text[] NOT NULL DEFAULT '{}',
  recommendations text[] NOT NULL DEFAULT '{}',
  detailed_feedback text NOT NULL,
  
  -- Performance metrics
  response_quality_score integer CHECK (response_quality_score >= 0 AND response_quality_score <= 100),
  clarity_score integer CHECK (clarity_score >= 0 AND clarity_score <= 100),
  relevance_score integer CHECK (relevance_score >= 0 AND relevance_score <= 100),
  
  -- AI insights
  ai_insights jsonb DEFAULT '{}',
  improvement_areas jsonb DEFAULT '{}',
  skill_breakdown jsonb DEFAULT '{}',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_progress table for tracking improvement over time
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_area text NOT NULL,
  current_score integer NOT NULL CHECK (current_score >= 0 AND current_score <= 100),
  previous_score integer CHECK (previous_score >= 0 AND previous_score <= 100),
  improvement_rate decimal(5,2) DEFAULT 0,
  sessions_count integer DEFAULT 1,
  last_session_id uuid REFERENCES interview_sessions(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_area)
);

-- Create feedback_analytics table for advanced analytics
CREATE TABLE IF NOT EXISTS feedback_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id uuid REFERENCES interview_sessions(id) ON DELETE CASCADE NOT NULL,
  
  -- Performance trends
  performance_trend jsonb DEFAULT '{}',
  skill_progression jsonb DEFAULT '{}',
  comparative_analysis jsonb DEFAULT '{}',
  
  -- Behavioral patterns
  response_patterns jsonb DEFAULT '{}',
  improvement_velocity decimal(5,2) DEFAULT 0,
  consistency_score integer CHECK (consistency_score >= 0 AND consistency_score <= 100),
  
  -- Predictive insights
  predicted_next_score integer CHECK (predicted_next_score >= 0 AND predicted_next_score <= 100),
  recommended_focus_areas text[] DEFAULT '{}',
  estimated_improvement_time_days integer,
  
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_status ON interview_sessions(status);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_created_at ON interview_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interview_feedback_user_id ON interview_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_feedback_session_id ON interview_feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_analytics_user_id ON feedback_analytics(user_id);

-- Enable Row Level Security
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for interview_sessions
CREATE POLICY "Users can view own interview sessions"
  ON interview_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own interview sessions"
  ON interview_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interview sessions"
  ON interview_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for interview_questions
CREATE POLICY "Users can view questions for own sessions"
  ON interview_questions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE interview_sessions.id = interview_questions.session_id 
      AND interview_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create questions for own sessions"
  ON interview_questions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE interview_sessions.id = interview_questions.session_id 
      AND interview_sessions.user_id = auth.uid()
    )
  );

-- Create RLS policies for interview_responses
CREATE POLICY "Users can view own responses"
  ON interview_responses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE interview_sessions.id = interview_responses.session_id 
      AND interview_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own responses"
  ON interview_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE interview_sessions.id = interview_responses.session_id 
      AND interview_sessions.user_id = auth.uid()
    )
  );

-- Create RLS policies for interview_feedback
CREATE POLICY "Users can view own feedback"
  ON interview_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own feedback"
  ON interview_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feedback"
  ON interview_feedback
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for user_progress
CREATE POLICY "Users can view own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for feedback_analytics
CREATE POLICY "Users can view own analytics"
  ON feedback_analytics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own analytics"
  ON feedback_analytics
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to update user progress
CREATE OR REPLACE FUNCTION update_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_progress (user_id, skill_area, current_score, previous_score, sessions_count, last_session_id)
  VALUES (
    NEW.user_id,
    'overall',
    NEW.overall_score,
    (SELECT current_score FROM user_progress WHERE user_id = NEW.user_id AND skill_area = 'overall'),
    1,
    NEW.session_id
  )
  ON CONFLICT (user_id, skill_area)
  DO UPDATE SET
    previous_score = user_progress.current_score,
    current_score = NEW.overall_score,
    sessions_count = user_progress.sessions_count + 1,
    last_session_id = NEW.session_id,
    improvement_rate = CASE 
      WHEN user_progress.current_score > 0 THEN 
        ((NEW.overall_score - user_progress.current_score) * 100.0 / user_progress.current_score)
      ELSE 0
    END,
    updated_at = now();

  -- Update individual skill areas
  INSERT INTO user_progress (user_id, skill_area, current_score, sessions_count, last_session_id)
  VALUES 
    (NEW.user_id, 'communication', NEW.communication_score, 1, NEW.session_id),
    (NEW.user_id, 'technical', NEW.technical_score, 1, NEW.session_id),
    (NEW.user_id, 'problem_solving', NEW.problem_solving_score, 1, NEW.session_id),
    (NEW.user_id, 'confidence', NEW.confidence_score, 1, NEW.session_id)
  ON CONFLICT (user_id, skill_area)
  DO UPDATE SET
    previous_score = user_progress.current_score,
    current_score = CASE 
      WHEN user_progress.skill_area = 'communication' THEN NEW.communication_score
      WHEN user_progress.skill_area = 'technical' THEN NEW.technical_score
      WHEN user_progress.skill_area = 'problem_solving' THEN NEW.problem_solving_score
      WHEN user_progress.skill_area = 'confidence' THEN NEW.confidence_score
      ELSE user_progress.current_score
    END,
    sessions_count = user_progress.sessions_count + 1,
    last_session_id = NEW.session_id,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update user progress
CREATE TRIGGER update_user_progress_trigger
  AFTER INSERT ON interview_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_user_progress();

-- Create function to generate analytics insights
CREATE OR REPLACE FUNCTION generate_analytics_insights(p_user_id uuid, p_session_id uuid)
RETURNS jsonb AS $$
DECLARE
  insights jsonb := '{}';
  avg_scores jsonb;
  trend_data jsonb;
  recommendations text[];
BEGIN
  -- Calculate average scores across all sessions
  SELECT jsonb_build_object(
    'overall_avg', COALESCE(AVG(overall_score), 0),
    'communication_avg', COALESCE(AVG(communication_score), 0),
    'technical_avg', COALESCE(AVG(technical_score), 0),
    'problem_solving_avg', COALESCE(AVG(problem_solving_score), 0),
    'confidence_avg', COALESCE(AVG(confidence_score), 0)
  ) INTO avg_scores
  FROM interview_feedback
  WHERE user_id = p_user_id;

  -- Calculate trend data (last 5 sessions)
  SELECT jsonb_agg(
    jsonb_build_object(
      'session_date', created_at,
      'overall_score', overall_score,
      'communication_score', communication_score,
      'technical_score', technical_score
    ) ORDER BY created_at DESC
  ) INTO trend_data
  FROM interview_feedback
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 5;

  -- Generate recommendations based on performance
  SELECT ARRAY(
    SELECT CASE 
      WHEN communication_score < 70 THEN 'Focus on clear and structured communication'
      WHEN technical_score < 70 THEN 'Practice more technical concepts and explanations'
      WHEN problem_solving_score < 70 THEN 'Work on analytical thinking and problem-solving approaches'
      WHEN confidence_score < 70 THEN 'Build confidence through regular practice sessions'
      ELSE 'Continue maintaining excellent performance'
    END
    FROM interview_feedback
    WHERE user_id = p_user_id AND session_id = p_session_id
  ) INTO recommendations;

  -- Build final insights object
  insights := jsonb_build_object(
    'average_scores', avg_scores,
    'trend_data', trend_data,
    'recommendations', recommendations,
    'total_sessions', (SELECT COUNT(*) FROM interview_feedback WHERE user_id = p_user_id),
    'generated_at', now()
  );

  RETURN insights;
END;
$$ LANGUAGE plpgsql;