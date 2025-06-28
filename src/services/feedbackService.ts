import { supabase } from '../lib/supabase';

export interface InterviewFeedback {
  id: string;
  sessionId: string;
  userId: string;
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  detailedFeedback: string;
  responseQualityScore?: number;
  clarityScore?: number;
  relevanceScore?: number;
  aiInsights?: any;
  improvementAreas?: any;
  skillBreakdown?: any;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  sessionType: string;
  role: string;
  experienceLevel: string;
  difficulty: string;
  industry: string;
  durationMinutes: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  skillArea: string;
  currentScore: number;
  previousScore?: number;
  improvementRate: number;
  sessionsCount: number;
  lastSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackAnalytics {
  id: string;
  userId: string;
  sessionId: string;
  performanceTrend: any;
  skillProgression: any;
  comparativeAnalysis: any;
  responsePatterns: any;
  improvementVelocity: number;
  consistencyScore: number;
  predictedNextScore?: number;
  recommendedFocusAreas: string[];
  estimatedImprovementTimeDays?: number;
  createdAt: string;
}

class FeedbackService {
  // Save interview feedback to database
  async saveFeedback(feedbackData: Omit<InterviewFeedback, 'id' | 'createdAt' | 'updatedAt'>): Promise<InterviewFeedback> {
    try {
      const { data, error } = await supabase
        .from('interview_feedback')
        .insert({
          session_id: feedbackData.sessionId,
          user_id: feedbackData.userId,
          overall_score: feedbackData.overallScore,
          communication_score: feedbackData.communicationScore,
          technical_score: feedbackData.technicalScore,
          problem_solving_score: feedbackData.problemSolvingScore,
          confidence_score: feedbackData.confidenceScore,
          strengths: feedbackData.strengths,
          improvements: feedbackData.improvements,
          recommendations: feedbackData.recommendations,
          detailed_feedback: feedbackData.detailedFeedback,
          response_quality_score: feedbackData.responseQualityScore,
          clarity_score: feedbackData.clarityScore,
          relevance_score: feedbackData.relevanceScore,
          ai_insights: feedbackData.aiInsights || {},
          improvement_areas: feedbackData.improvementAreas || {},
          skill_breakdown: feedbackData.skillBreakdown || {}
        })
        .select()
        .single();

      if (error) throw error;

      return this.mapFeedbackFromDB(data);
    } catch (error) {
      console.error('Error saving feedback:', error);
      throw new Error('Failed to save interview feedback');
    }
  }

  // Get feedback by session ID
  async getFeedbackBySessionId(sessionId: string): Promise<InterviewFeedback | null> {
    try {
      const { data, error } = await supabase
        .from('interview_feedback')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw error;
      }

      return this.mapFeedbackFromDB(data);
    } catch (error) {
      console.error('Error getting feedback:', error);
      return null;
    }
  }

  // Get all feedback for a user
  async getUserFeedback(userId: string, limit?: number): Promise<InterviewFeedback[]> {
    try {
      let query = supabase
        .from('interview_feedback')
        .select(`
          *,
          interview_sessions!inner(
            session_type,
            role,
            experience_level,
            difficulty,
            industry,
            duration_minutes,
            started_at,
            completed_at
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(item => this.mapFeedbackFromDB(item));
    } catch (error) {
      console.error('Error getting user feedback:', error);
      throw new Error('Failed to retrieve user feedback');
    }
  }

  // Get user progress data
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data.map(item => this.mapProgressFromDB(item));
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw new Error('Failed to retrieve user progress');
    }
  }

  // Get analytics data for a user
  async getUserAnalytics(userId: string): Promise<FeedbackAnalytics[]> {
    try {
      const { data, error } = await supabase
        .from('feedback_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => this.mapAnalyticsFromDB(item));
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw new Error('Failed to retrieve user analytics');
    }
  }

  // Generate comprehensive analytics insights
  async generateAnalyticsInsights(userId: string, sessionId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .rpc('generate_analytics_insights', {
          p_user_id: userId,
          p_session_id: sessionId
        });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error generating analytics insights:', error);
      throw new Error('Failed to generate analytics insights');
    }
  }

  // Save analytics data
  async saveAnalytics(analyticsData: Omit<FeedbackAnalytics, 'id' | 'createdAt'>): Promise<FeedbackAnalytics> {
    try {
      const { data, error } = await supabase
        .from('feedback_analytics')
        .insert({
          user_id: analyticsData.userId,
          session_id: analyticsData.sessionId,
          performance_trend: analyticsData.performanceTrend,
          skill_progression: analyticsData.skillProgression,
          comparative_analysis: analyticsData.comparativeAnalysis,
          response_patterns: analyticsData.responsePatterns,
          improvement_velocity: analyticsData.improvementVelocity,
          consistency_score: analyticsData.consistencyScore,
          predicted_next_score: analyticsData.predictedNextScore,
          recommended_focus_areas: analyticsData.recommendedFocusAreas,
          estimated_improvement_time_days: analyticsData.estimatedImprovementTimeDays
        })
        .select()
        .single();

      if (error) throw error;

      return this.mapAnalyticsFromDB(data);
    } catch (error) {
      console.error('Error saving analytics:', error);
      throw new Error('Failed to save analytics data');
    }
  }

  // Get interview sessions for a user
  async getUserSessions(userId: string): Promise<InterviewSession[]> {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => this.mapSessionFromDB(item));
    } catch (error) {
      console.error('Error getting user sessions:', error);
      throw new Error('Failed to retrieve user sessions');
    }
  }

  // Create a new interview session
  async createSession(sessionData: Omit<InterviewSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<InterviewSession> {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .insert({
          user_id: sessionData.userId,
          session_type: sessionData.sessionType,
          role: sessionData.role,
          experience_level: sessionData.experienceLevel,
          difficulty: sessionData.difficulty,
          industry: sessionData.industry,
          duration_minutes: sessionData.durationMinutes,
          status: sessionData.status,
          started_at: sessionData.startedAt,
          completed_at: sessionData.completedAt
        })
        .select()
        .single();

      if (error) throw error;

      return this.mapSessionFromDB(data);
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create interview session');
    }
  }

  // Update session status
  async updateSessionStatus(sessionId: string, status: InterviewSession['status'], completedAt?: string): Promise<void> {
    try {
      const updateData: any = { status, updated_at: new Date().toISOString() };
      if (completedAt) {
        updateData.completed_at = completedAt;
      }

      const { error } = await supabase
        .from('interview_sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating session status:', error);
      throw new Error('Failed to update session status');
    }
  }

  // Get performance statistics for dashboard
  async getPerformanceStats(userId: string): Promise<{
    totalSessions: number;
    averageScore: number;
    recentScore: number;
    improvementTrend: number;
    skillBreakdown: Record<string, number>;
  }> {
    try {
      const feedback = await this.getUserFeedback(userId);
      const progress = await this.getUserProgress(userId);

      const totalSessions = feedback.length;
      const averageScore = totalSessions > 0 
        ? Math.round(feedback.reduce((sum, f) => sum + f.overallScore, 0) / totalSessions)
        : 0;
      const recentScore = feedback.length > 0 ? feedback[0].overallScore : 0;

      // Calculate improvement trend (last 3 vs previous 3)
      let improvementTrend = 0;
      if (feedback.length >= 6) {
        const recent3 = feedback.slice(0, 3);
        const previous3 = feedback.slice(3, 6);
        const recentAvg = recent3.reduce((sum, f) => sum + f.overallScore, 0) / 3;
        const previousAvg = previous3.reduce((sum, f) => sum + f.overallScore, 0) / 3;
        improvementTrend = Math.round(recentAvg - previousAvg);
      }

      // Get skill breakdown from progress
      const skillBreakdown: Record<string, number> = {};
      progress.forEach(p => {
        if (p.skillArea !== 'overall') {
          skillBreakdown[p.skillArea] = p.currentScore;
        }
      });

      return {
        totalSessions,
        averageScore,
        recentScore,
        improvementTrend,
        skillBreakdown
      };
    } catch (error) {
      console.error('Error getting performance stats:', error);
      throw new Error('Failed to retrieve performance statistics');
    }
  }

  // Export feedback as downloadable data
  async exportFeedback(userId: string, format: 'json' | 'csv' = 'json'): Promise<string> {
    try {
      const feedback = await this.getUserFeedback(userId);
      const sessions = await this.getUserSessions(userId);
      const progress = await this.getUserProgress(userId);

      const exportData = {
        feedback,
        sessions,
        progress,
        exportedAt: new Date().toISOString(),
        totalSessions: feedback.length,
        averageScore: feedback.length > 0 
          ? Math.round(feedback.reduce((sum, f) => sum + f.overallScore, 0) / feedback.length)
          : 0
      };

      if (format === 'json') {
        return JSON.stringify(exportData, null, 2);
      } else {
        // Convert to CSV format
        return this.convertToCSV(exportData);
      }
    } catch (error) {
      console.error('Error exporting feedback:', error);
      throw new Error('Failed to export feedback data');
    }
  }

  // Helper method to convert data to CSV
  private convertToCSV(data: any): string {
    const headers = [
      'Session Date',
      'Role',
      'Interview Type',
      'Overall Score',
      'Communication Score',
      'Technical Score',
      'Problem Solving Score',
      'Confidence Score',
      'Duration (minutes)',
      'Status'
    ];

    const rows = data.feedback.map((feedback: InterviewFeedback) => {
      const session = data.sessions.find((s: InterviewSession) => s.id === feedback.sessionId);
      return [
        new Date(feedback.createdAt).toLocaleDateString(),
        session?.role || 'N/A',
        session?.sessionType || 'N/A',
        feedback.overallScore,
        feedback.communicationScore,
        feedback.technicalScore,
        feedback.problemSolvingScore,
        feedback.confidenceScore,
        session?.durationMinutes || 'N/A',
        session?.status || 'N/A'
      ];
    });

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  // Helper methods to map database objects to TypeScript interfaces
  private mapFeedbackFromDB(data: any): InterviewFeedback {
    return {
      id: data.id,
      sessionId: data.session_id,
      userId: data.user_id,
      overallScore: data.overall_score,
      communicationScore: data.communication_score,
      technicalScore: data.technical_score,
      problemSolvingScore: data.problem_solving_score,
      confidenceScore: data.confidence_score,
      strengths: data.strengths || [],
      improvements: data.improvements || [],
      recommendations: data.recommendations || [],
      detailedFeedback: data.detailed_feedback,
      responseQualityScore: data.response_quality_score,
      clarityScore: data.clarity_score,
      relevanceScore: data.relevance_score,
      aiInsights: data.ai_insights || {},
      improvementAreas: data.improvement_areas || {},
      skillBreakdown: data.skill_breakdown || {},
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private mapSessionFromDB(data: any): InterviewSession {
    return {
      id: data.id,
      userId: data.user_id,
      sessionType: data.session_type,
      role: data.role,
      experienceLevel: data.experience_level,
      difficulty: data.difficulty,
      industry: data.industry,
      durationMinutes: data.duration_minutes,
      status: data.status,
      startedAt: data.started_at,
      completedAt: data.completed_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private mapProgressFromDB(data: any): UserProgress {
    return {
      id: data.id,
      userId: data.user_id,
      skillArea: data.skill_area,
      currentScore: data.current_score,
      previousScore: data.previous_score,
      improvementRate: data.improvement_rate,
      sessionsCount: data.sessions_count,
      lastSessionId: data.last_session_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private mapAnalyticsFromDB(data: any): FeedbackAnalytics {
    return {
      id: data.id,
      userId: data.user_id,
      sessionId: data.session_id,
      performanceTrend: data.performance_trend || {},
      skillProgression: data.skill_progression || {},
      comparativeAnalysis: data.comparative_analysis || {},
      responsePatterns: data.response_patterns || {},
      improvementVelocity: data.improvement_velocity,
      consistencyScore: data.consistency_score,
      predictedNextScore: data.predicted_next_score,
      recommendedFocusAreas: data.recommended_focus_areas || [],
      estimatedImprovementTimeDays: data.estimated_improvement_time_days,
      createdAt: data.created_at
    };
  }
}

export const feedbackService = new FeedbackService();