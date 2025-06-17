import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  Calendar,
  PlayCircle,
  BarChart3,
  BookOpen,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useInterview } from '../contexts/InterviewContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { sessions } = useInterview();

  const recentSessions = sessions.slice(-3).reverse();
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const averageScore = completedSessions.length > 0 
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.score?.overall || 0), 0) / completedSessions.length)
    : 0;

  const stats = [
    {
      label: 'Total Interviews',
      value: sessions.length,
      icon: <PlayCircle className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Average Score',
      value: `${averageScore}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Hours Practiced',
      value: Math.round(sessions.reduce((acc, s) => {
        if (s.startTime && s.endTime) {
          return acc + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / (1000 * 60 * 60);
        }
        return acc;
      }, 0)),
      icon: <Clock className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Success Rate',
      value: `${completedSessions.length > 0 ? Math.round((completedSessions.filter(s => (s.score?.overall || 0) >= 80).length / completedSessions.length) * 100) : 0}%`,
      icon: <Award className="w-6 h-6" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  const upcomingTasks = [
    {
      title: 'Practice Technical Questions',
      description: 'Focus on data structures and algorithms',
      priority: 'high',
      dueDate: 'Today',
    },
    {
      title: 'Review Behavioral Responses',
      description: 'Prepare STAR method examples',
      priority: 'medium',
      dueDate: 'Tomorrow',
    },
    {
      title: 'Mock Interview Session',
      description: 'Full-length practice interview',
      priority: 'high',
      dueDate: 'This Week',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Track your progress and continue improving your interview skills
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  to="/interview/setup"
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <PlayCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Start New Interview</h3>
                      <p className="text-sm text-gray-600">Practice with AI interviewer</p>
                    </div>
                  </div>
                </Link>
                
                <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">View Analytics</h3>
                      <p className="text-sm text-gray-600">Detailed performance insights</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Study Resources</h3>
                      <p className="text-sm text-gray-600">Interview preparation materials</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
                      <Calendar className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Schedule Session</h3>
                      <p className="text-sm text-gray-600">Book practice time</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Sessions</h2>
                <Link
                  to="/interview/setup"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Session
                </Link>
              </div>
              
              {recentSessions.length > 0 ? (
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">
                                {session.config.role} - {session.config.interviewType}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {session.config.experienceLevel} level • {session.config.difficulty} difficulty
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(session.startTime).toLocaleDateString()} at{' '}
                                {new Date(session.startTime).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {session.status === 'completed' && session.score && (
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                {session.score.overall}%
                              </div>
                              <div className="text-xs text-gray-500">Overall Score</div>
                            </div>
                          )}
                          {session.status === 'completed' ? (
                            <Link
                              to={`/results/${session.id}`}
                              className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                            >
                              View Results
                            </Link>
                          ) : (
                            <span className="bg-yellow-50 text-yellow-600 px-3 py-1 rounded-md text-sm font-medium">
                              In Progress
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PlayCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
                  <p className="text-gray-600 mb-4">Start your first AI interview practice session</p>
                  <Link
                    to="/interview/setup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Start Interview
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Overview</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Interview Skills</span>
                    <span className="text-sm text-gray-600">{averageScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${averageScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Confidence Level</span>
                    <span className="text-sm text-gray-600">
                      {completedSessions.length > 0
                        ? Math.round(completedSessions.reduce((acc, s) => acc + (s.score?.confidence || 0), 0) / completedSessions.length)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${completedSessions.length > 0
                          ? Math.round(completedSessions.reduce((acc, s) => acc + (s.score?.confidence || 0), 0) / completedSessions.length)
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Tasks</h2>
              
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{task.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{task.dueDate}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">💡 Today's Tip</h2>
              <p className="text-sm text-gray-700">
                Practice the STAR method (Situation, Task, Action, Result) for behavioral questions. 
                This structure helps you give comprehensive and organized responses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;