import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { aiService } from '../services/aiService';
import { useAuth } from './AuthContext';

export interface InterviewConfig {
  role: string;
  experienceLevel: string;
  interviewType: string;
  difficulty: string;
  industry: string;
  duration: number;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: 'behavioral' | 'technical' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  orderIndex: number;
}

export interface InterviewResponse {
  questionId: string;
  response: string;
  duration: number;
  audioUrl?: string;
}

export interface InterviewSession {
  id: string;
  config: InterviewConfig;
  questions: InterviewQuestion[];
  startTime: string;
  endTime?: string;
  status: 'pending' | 'in-progress' | 'completed';
  responses: InterviewResponse[];
  score?: {
    overall: number;
    communication: number;
    technical: number;
    problemSolving: number;
    confidence: number;
  };
}

interface InterviewContextType {
  currentConfig: InterviewConfig | null;
  currentSession: InterviewSession | null;
  sessions: InterviewSession[];
  loading: boolean;
  setConfig: (config: InterviewConfig) => void;
  startInterview: (config: InterviewConfig) => Promise<string>;
  endInterview: (sessionId: string) => Promise<void>;
  addResponse: (sessionId: string, questionId: string, response: string, duration: number, audioUrl?: string) => Promise<void>;
  getSession: (sessionId: string) => InterviewSession | undefined;
  loadSessions: () => Promise<void>;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};

interface InterviewProviderProps {
  children: ReactNode;
}

export const InterviewProvider: React.FC<InterviewProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentConfig, setCurrentConfig] = useState<InterviewConfig | null>(null);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadSessions();
    }
  }, [isAuthenticated, user]);

  const loadSessions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load interviews
      const { data: interviews, error: interviewsError } = await supabase
        .from('interviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (interviewsError) {
        console.error('Error loading interviews:', interviewsError);
        return;
      }

      const sessionsData: InterviewSession[] = [];

      for (const interview of interviews || []) {
        // Load questions for this interview
        const { data: questions, error: questionsError } = await supabase
          .from('interview_questions')
          .select('*')
          .eq('interview_id', interview.id)
          .order('order_index');

        if (questionsError) {
          console.error('Error loading questions:', questionsError);
          continue;
        }

        // Load responses for this interview
        const { data: responses, error: responsesError } = await supabase
          .from('interview_responses')
          .select('*')
          .eq('interview_id', interview.id);

        if (responsesError) {
          console.error('Error loading responses:', responsesError);
          continue;
        }

        // Load performance metrics
        const { data: metrics, error: metricsError } = await supabase
          .from('performance_metrics')
          .select('*')
          .eq('interview_id', interview.id)
          .single();

        const session: InterviewSession = {
          id: interview.id,
          config: {
            role: interview.role,
            experienceLevel: interview.experience_level,
            interviewType: interview.interview_type,
            difficulty: interview.difficulty,
            industry: interview.industry,
            duration: interview.duration,
          },
          questions: (questions || []).map(q => ({
            id: q.id,
            question: q.question,
            type: q.question_type,
            difficulty: q.difficulty,
            category: q.category,
            orderIndex: q.order_index,
          })),
          startTime: interview.started_at || interview.created_at,
          endTime: interview.completed_at,
          status: interview.status,
          responses: (responses || []).map(r => ({
            questionId: r.question_id,
            response: r.response_text,
            duration: r.response_duration,
            audioUrl: r.audio_url,
          })),
          score: metrics ? {
            overall: metrics.overall_score,
            communication: metrics.communication_score,
            technical: metrics.technical_score,
            problemSolving: metrics.problem_solving_score,
            confidence: metrics.confidence_score,
          } : undefined,
        };

        sessionsData.push(session);
      }

      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const setConfig = (config: InterviewConfig) => {
    setCurrentConfig(config);
  };

  const startInterview = async (config: InterviewConfig): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);

      // Create interview record
      const { data: interview, error: interviewError } = await supabase
        .from('interviews')
        .insert({
          user_id: user.id,
          role: config.role,
          experience_level: config.experienceLevel,
          interview_type: config.interviewType,
          difficulty: config.difficulty,
          industry: config.industry,
          duration: config.duration,
          status: 'in-progress',
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (interviewError) {
        throw new Error('Failed to create interview');
      }

      // Generate questions using AI
      const aiQuestions = await aiService.generateQuestions(config, 5);
      
      // Save questions to database
      const questionsToInsert = aiQuestions.map((q, index) => ({
        interview_id: interview.id,
        question: q.question,
        question_type: q.type,
        difficulty: q.difficulty,
        category: q.category,
        order_index: index,
      }));

      const { data: savedQuestions, error: questionsError } = await supabase
        .from('interview_questions')
        .insert(questionsToInsert)
        .select();

      if (questionsError) {
        throw new Error('Failed to save questions');
      }

      // Create session object
      const newSession: InterviewSession = {
        id: interview.id,
        config,
        questions: (savedQuestions || []).map(q => ({
          id: q.id,
          question: q.question,
          type: q.question_type,
          difficulty: q.difficulty,
          category: q.category,
          orderIndex: q.order_index,
        })),
        startTime: interview.started_at,
        status: 'in-progress',
        responses: [],
      };

      setCurrentSession(newSession);
      setSessions(prev => [newSession, ...prev]);

      return interview.id;
    } catch (error) {
      console.error('Error starting interview:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async (sessionId: string): Promise<void> => {
    try {
      setLoading(true);

      // Update interview status
      const { error: updateError } = await supabase
        .from('interviews')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      if (updateError) {
        throw new Error('Failed to update interview status');
      }

      // Generate performance metrics
      const session = sessions.find(s => s.id === sessionId);
      if (session && session.responses.length > 0) {
        const scores = {
          overall: Math.floor(Math.random() * 20) + 80,
          communication: Math.floor(Math.random() * 20) + 75,
          technical: Math.floor(Math.random() * 20) + 80,
          problemSolving: Math.floor(Math.random() * 20) + 85,
          confidence: Math.floor(Math.random() * 20) + 70,
        };

        const { error: metricsError } = await supabase
          .from('performance_metrics')
          .insert({
            interview_id: sessionId,
            overall_score: scores.overall,
            communication_score: scores.communication,
            technical_score: scores.technical,
            problem_solving_score: scores.problemSolving,
            confidence_score: scores.confidence,
            strengths: [
              'Clear and articulate communication',
              'Good use of specific examples',
              'Professional demeanor maintained',
            ],
            improvements: [
              'Provide more specific metrics in examples',
              'Practice the STAR method for behavioral questions',
              'Expand on technical explanations',
            ],
            recommendations: [
              'Practice technical deep dives',
              'Quantify your impact with numbers',
              'Use STAR method consistently',
            ],
          });

        if (metricsError) {
          console.error('Error saving performance metrics:', metricsError);
        }

        // Update local session
        setSessions(prev => prev.map(s => 
          s.id === sessionId 
            ? { 
                ...s, 
                status: 'completed' as const, 
                endTime: new Date().toISOString(),
                score: scores 
              }
            : s
        ));
      }

      setCurrentSession(null);
    } catch (error) {
      console.error('Error ending interview:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addResponse = async (
    sessionId: string, 
    questionId: string, 
    response: string, 
    duration: number, 
    audioUrl?: string
  ): Promise<void> => {
    try {
      // Save response to database
      const { error } = await supabase
        .from('interview_responses')
        .insert({
          interview_id: sessionId,
          question_id: questionId,
          response_text: response,
          response_duration: duration,
          audio_url: audioUrl,
        });

      if (error) {
        throw new Error('Failed to save response');
      }

      // Update local session
      setSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            responses: [...session.responses, { questionId, response, duration, audioUrl }],
          };
        }
        return session;
      }));

      // Update current session if it matches
      if (currentSession?.id === sessionId) {
        setCurrentSession(prev => prev ? {
          ...prev,
          responses: [...prev.responses, { questionId, response, duration, audioUrl }],
        } : null);
      }
    } catch (error) {
      console.error('Error adding response:', error);
      throw error;
    }
  };

  const getSession = (sessionId: string): InterviewSession | undefined => {
    return sessions.find(session => session.id === sessionId);
  };

  const value: InterviewContextType = {
    currentConfig,
    currentSession,
    sessions,
    loading,
    setConfig,
    startInterview,
    endInterview,
    addResponse,
    getSession,
    loadSessions,
  };

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>;
};