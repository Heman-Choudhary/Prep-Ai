import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Award, 
  TrendingUp, 
  MessageCircle, 
  Brain,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Download,
  Share2,
  RotateCcw
} from 'lucide-react';
import { useInterview } from '../contexts/InterviewContext';

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getSession } = useInterview();
  
  const session = getSession(id!);

  if (!session || !session.score) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Results Not Found</h2>
          <p className="text-gray-600 mb-4">We couldn't find the results for this interview session.</p>
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const duration = session.endTime && session.startTime
    ? Math.floor((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60))
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const strengths = [
    'Clear and articulate communication',
    'Good use of specific examples',
    'Professional demeanor maintained',
    'Confident body language',
  ];

  const improvements = [
    'Provide more specific metrics in examples',
    'Practice the STAR method for behavioral questions',
    'Expand on technical explanations',
    'Reduce use of filler words',
  ];

  const recommendations = [
    {
      title: 'Practice Technical Deep Dives',
      description: 'Spend more time explaining your technical decision-making process',
      priority: 'high',
    },
    {
      title: 'Quantify Your Impact',
      description: 'Include specific numbers and metrics in your examples',
      priority: 'medium',
    },
    {
      title: 'Behavioral Question Structure',
      description: 'Use the STAR method consistently for all behavioral questions',
      priority: 'high',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${getScoreColor(session.score.overall)}`}>
              <span className="text-2xl font-bold">{getScoreGrade(session.score.overall)}</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interview Results
          </h1>
          <p className="text-gray-600">
            {session.config.role} • {session.config.interviewType} Interview • {duration} minutes
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Completed on {new Date(session.endTime!).toLocaleDateString()} at{' '}
            {new Date(session.endTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="text-center">
            <div className="text-6xl font-bold text-gray-900 mb-2">{session.score.overall}%</div>
            <div className="text-xl text-gray-600 mb-4">Overall Performance Score</div>
            <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium border ${getScoreColor(session.score.overall)}`}>
              {session.score.overall >= 90 ? 'Excellent Performance' :
               session.score.overall >= 80 ? 'Good Performance' :
               session.score.overall >= 70 ? 'Average Performance' : 'Needs Improvement'}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Score Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Score Breakdown</h2>
              
              <div className="space-y-6">
                {[
                  { label: 'Communication', score: session.score.communication, icon: <MessageCircle className="w-5 h-5" /> },
                  { label: 'Technical Skills', score: session.score.technical, icon: <Brain className="w-5 h-5" /> },
                  { label: 'Problem Solving', score: session.score.problemSolving, icon: <Target className="w-5 h-5" /> },
                  { label: 'Confidence', score: session.score.confidence, icon: <Award className="w-5 h-5" /> },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                        {item.icon}
                      </div>
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-4 flex-1 max-w-xs">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-gray-900 w-12 text-right">{item.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Feedback</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div>
                  <h3 className="font-semibold text-green-700 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h3 className="font-semibold text-yellow-700 mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {improvements.map((improvement, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Question-by-Question Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Question Analysis</h2>
              
              <div className="space-y-4">
                {session.questions.map((question, index) => {
                  const response = session.responses.find(r => r.questionId === question.id);
                  const mockScore = Math.floor(Math.random() * 20) + 75; // Mock individual question scores
                  
                  return (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            Question {index + 1}: {question.question}
                          </h4>
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <span className="capitalize">{question.type}</span>
                            <span>•</span>
                            <span className="capitalize">{question.difficulty}</span>
                            {response && (
                              <>
                                <span>•</span>
                                <span>{Math.floor(response.duration / 60)}:{(response.duration % 60).toString().padStart(2, '0')}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(mockScore)}`}>
                          {mockScore}%
                        </div>
                      </div>
                      
                      {response && response.response !== 'Skipped' && (
                        <div className="bg-gray-50 rounded p-3 text-sm text-gray-700">
                          <strong>Your Response:</strong> {response.response.substring(0, 150)}
                          {response.response.length > 150 && '...'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              
              <div className="space-y-3">
                <Link
                  to="/interview/setup"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center justify-center"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Practice Again
                </Link>
                
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </button>
                
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Results
                </button>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Recommendations</h3>
              
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="border-l-4 border-blue-400 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{rec.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Session Details</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium text-gray-900">{session.config.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience Level:</span>
                  <span className="font-medium text-gray-900 capitalize">{session.config.experienceLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interview Type:</span>
                  <span className="font-medium text-gray-900 capitalize">{session.config.interviewType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium text-gray-900 capitalize">{session.config.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">{duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions Answered:</span>
                  <span className="font-medium text-gray-900">{session.responses.length}/{session.questions.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;