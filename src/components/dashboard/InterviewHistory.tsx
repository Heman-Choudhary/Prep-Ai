import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Award, 
  Filter,
  Search,
  Download,
  Eye,
  BarChart3,
  Target
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { feedbackService, InterviewFeedback, InterviewSession } from '../../services/feedbackService';
import { useAuth } from '../../contexts/AuthContext';

interface InterviewHistoryItem extends InterviewFeedback {
  session: InterviewSession;
}

export function InterviewHistory() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<InterviewHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (user) {
      loadInterviewHistory();
    }
  }, [user]);

  const loadInterviewHistory = async () => {
    try {
      setLoading(true);
      const [feedback, sessions] = await Promise.all([
        feedbackService.getUserFeedback(user!.id),
        feedbackService.getUserSessions(user!.id)
      ]);

      // Combine feedback with session data
      const combined = feedback.map(f => {
        const session = sessions.find(s => s.id === f.sessionId);
        return { ...f, session: session! };
      }).filter(item => item.session); // Only include items with valid sessions

      setInterviews(combined);
    } catch (error) {
      console.error('Error loading interview history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedInterviews = interviews
    .filter(interview => {
      const matchesSearch = interview.session.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           interview.session.sessionType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || interview.session.sessionType === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        comparison = a.overallScore - b.overallScore;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleExport = async () => {
    try {
      const csvData = await feedbackService.exportFeedback(user!.id, 'csv');
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-history-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Interview History</h2>
          <p className="text-gray-600">Review your past interviews and track your progress</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export Data</span>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by role or interview type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter by Type */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="technical">Technical</option>
              <option value="behavioral">Behavioral</option>
              <option value="mixed">Mixed</option>
              <option value="case">Case Study</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by as 'date' | 'score');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="score-desc">Highest Score</option>
              <option value="score-asc">Lowest Score</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Interview List */}
      {filteredAndSortedInterviews.length === 0 ? (
        <Card className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No interviews found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start your first interview to see your history here'
            }
          </p>
          <Link to="/interview/setup">
            <Button>Start New Interview</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedInterviews.map((interview) => (
            <Card key={interview.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Target className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {interview.session.role}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="capitalize">{interview.session.sessionType} Interview</span>
                        <span>•</span>
                        <span className="capitalize">{interview.session.difficulty}</span>
                        <span>•</span>
                        <span>{interview.session.durationMinutes} minutes</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(interview.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>Industry: {interview.session.industry}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Score Display */}
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(interview.overallScore).split(' ')[0]}`}>
                      {interview.overallScore}%
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getScoreBadge(interview.overallScore)}`}>
                      Overall Score
                    </div>
                  </div>

                  {/* Skill Breakdown */}
                  <div className="hidden lg:block">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{interview.communicationScore}%</div>
                        <div className="text-gray-600">Communication</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{interview.technicalScore}%</div>
                        <div className="text-gray-600">Technical</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{interview.problemSolvingScore}%</div>
                        <div className="text-gray-600">Problem Solving</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{interview.confidenceScore}%</div>
                        <div className="text-gray-600">Confidence</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <Link to={`/interview/feedback/${interview.sessionId}`}>
                      <Button variant="outline" size="sm" className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </Button>
                    </Link>
                    <Link to={`/interview/analytics/${interview.sessionId}`}>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                        <BarChart3 className="h-4 w-4" />
                        <span>Analytics</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Insights */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>Strengths: {interview.strengths.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {interview.improvements.length} improvement areas identified
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination could be added here for large datasets */}
      {filteredAndSortedInterviews.length > 10 && (
        <div className="text-center py-4">
          <Button variant="outline">Load More Interviews</Button>
        </div>
      )}
    </div>
  );
}