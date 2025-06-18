import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Clock, 
  TrendingUp, 
  Award, 
  BarChart3,
  Calendar,
  Target,
  Mic
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Interview {
  id: string;
  role: string;
  experience_level: string;
  interview_type: string;
  score: number | null;
  created_at: string;
  completed_at: string | null;
}

export function Dashboard() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    recentScore: 0,
    improvementTrend: 0
  });

  useEffect(() => {
    if (user) {
      fetchInterviews();
    }
  }, [user]);

  const fetchInterviews = async () => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching interviews:', error);
      } else {
        setInterviews(data || []);
        calculateStats(data || []);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (interviewData: Interview[]) => {
    const completedInterviews = interviewData.filter(i => i.completed_at && i.score !== null);
    
    if (completedInterviews.length === 0) {
      setStats({
        totalInterviews: interviewData.length,
        averageScore: 0,
        recentScore: 0,
        improvementTrend: 0
      });
      return;
    }

    const totalScore = completedInterviews.reduce((sum, i) => sum + (i.score || 0), 0);
    const averageScore = Math.round(totalScore / completedInterviews.length);
    const recentScore = completedInterviews[0]?.score || 0;
    
    // Calculate improvement trend (last 3 vs previous 3)
    const recent3 = completedInterviews.slice(0, 3);
    const previous3 = completedInterviews.slice(3, 6);
    
    let improvementTrend = 0;
    if (recent3.length > 0 && previous3.length > 0) {
      const recentAvg = recent3.reduce((sum, i) => sum + (i.score || 0), 0) / recent3.length;
      const previousAvg = previous3.reduce((sum, i) => sum + (i.score || 0), 0) / previous3.length;
      improvementTrend = Math.round(recentAvg - previousAvg);
    }

    setStats({
      totalInterviews: interviewData.length,
      averageScore,
      recentScore,
      improvementTrend
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number | null) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.user_metadata?.full_name || 'Candidate'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Ready to practice and improve your interview skills?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInterviews}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-emerald-100 p-3 rounded-lg mr-4">
                <BarChart3 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recent Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(stats.recentScore)}`}>
                  {stats.recentScore || 'N/A'}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg mr-4">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Improvement</p>
                <p className={`text-2xl font-bold ${stats.improvementTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.improvementTrend > 0 ? '+' : ''}{stats.improvementTrend}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Start New Interview */}
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Start New Interview
                </h3>
                <p className="text-gray-600 mb-6">
                  Practice with our AI interviewer and improve your skills
                </p>
                <Link to="/interview/setup">
                  <Button className="w-full" size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Start Practice
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Recent Interviews */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Recent Interviews</h3>
                <Link to="/interviews" className="text-blue-600 hover:text-blue-700 text-sm">
                  View all
                </Link>
              </div>

              {interviews.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No interviews yet</p>
                  <Link to="/interview/setup">
                    <Button variant="outline">
                      Start your first interview
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {interviews.slice(0, 5).map((interview) => (
                    <div key={interview.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Target className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {interview.role} - {interview.interview_type}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(interview.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {interview.completed_at ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreBadgeColor(interview.score)}`}>
                            {interview.score}/100
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            In Progress
                          </span>
                        )}
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8">
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Interview Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mic className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Practice Regularly</h4>
                <p className="text-sm text-gray-600">
                  Consistent practice helps build confidence and improves your performance over time.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Focus on Weak Areas</h4>
                <p className="text-sm text-gray-600">
                  Use your performance analytics to identify and work on areas that need improvement.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-emerald-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Stay Confident</h4>
                <p className="text-sm text-gray-600">
                  Remember that practice makes perfect. Each session brings you closer to success.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}