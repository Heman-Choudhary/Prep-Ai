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
  Mic,
  Eye,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { InterviewHistory } from '../components/dashboard/InterviewHistory';
import { PerformanceAnalytics } from '../components/dashboard/PerformanceAnalytics';
import { useAuth } from '../contexts/AuthContext';
import { feedbackService } from '../services/feedbackService';

export function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'analytics'>('overview');
  const [stats, setStats] = useState({
    totalSessions: 0,
    averageScore: 0,
    recentScore: 0,
    improvementTrend: 0,
    skillBreakdown: {} as Record<string, number>
  });
  const [recentInterviews, setRecentInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, feedbackData] = await Promise.all([
        feedbackService.getPerformanceStats(user!.id),
        feedbackService.getUserFeedback(user!.id, 5) // Get last 5 interviews
      ]);

      setStats(statsData);
      setRecentInterviews(feedbackData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Candidate'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Ready to practice and improve your interview skills?
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <Target className="h-4 w-4" /> },
              { id: 'history', label: 'Interview History', icon: <Calendar className="h-4 w-4" /> },
              { id: 'analytics', label: 'Performance Analytics', icon: <BarChart3 className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className={`border-2 ${getScoreBgColor(stats.averageScore)}`}>
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Interviews</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
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
                    <p className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
                      {stats.averageScore}%
                    </p>
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
                      {stats.recentScore || 'N/A'}%
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
                      {stats.improvementTrend > 0 ? '+' : ''}{stats.improvementTrend}%
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content Grid */}
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
                    <button
                      onClick={() => setActiveTab('history')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <span>View all</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  {recentInterviews.length === 0 ? (
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
                      {recentInterviews.slice(0, 3).map((interview) => (
                        <div key={interview.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Target className="h-5 w-5 text-blue-600" />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  Interview Session
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatDate(interview.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              interview.overallScore >= 80 ? 'bg-green-100 text-green-800' :
                              interview.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {interview.overallScore}%
                            </span>
                            <Link to={`/interview/feedback/${interview.sessionId}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {/* Skill Breakdown */}
            {Object.keys(stats.skillBreakdown).length > 0 && (
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Skill Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(stats.skillBreakdown).map(([skill, score]) => (
                    <div key={skill} className="text-center">
                      <div className={`text-2xl font-bold mb-2 ${getScoreColor(score)}`}>
                        {score}%
                      </div>
                      <div className="text-sm text-gray-600 capitalize mb-2">
                        {skill.replace('_', ' ')}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            score >= 80 ? 'bg-green-500' :
                            score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Tips Section */}
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
        )}

        {activeTab === 'history' && <InterviewHistory />}
        {activeTab === 'analytics' && <PerformanceAnalytics />}
      </div>
    </div>
  );
}