import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap,
  Calendar,
  Award
} from 'lucide-react';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { analyticsService, AnalyticsInsight, PerformanceTrend, PredictiveAnalysis } from '../../services/analyticsService';
import { useAuth } from '../../contexts/AuthContext';

export function AnalyticsInsights() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [trends, setTrends] = useState<PerformanceTrend[]>([]);
  const [prediction, setPrediction] = useState<PredictiveAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'insights' | 'trends' | 'prediction'>('insights');

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [insightsData, trendsData, predictionData] = await Promise.all([
        analyticsService.generateInsights(user!.id),
        analyticsService.generatePerformanceTrends(user!.id),
        analyticsService.generatePredictiveAnalysis(user!.id)
      ]);

      setInsights(insightsData);
      setTrends(trendsData);
      setPrediction(predictionData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'improvement': return <Target className="h-5 w-5" />;
      case 'strength': return <CheckCircle className="h-5 w-5" />;
      case 'trend': return <TrendingUp className="h-5 w-5" />;
      case 'recommendation': return <Lightbulb className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string, priority: string) => {
    if (priority === 'high') {
      return type === 'improvement' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700';
    }
    if (priority === 'medium') {
      return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
    return 'bg-gray-50 border-gray-200 text-gray-700';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatSkillName = (skill: string) => {
    return skill.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Analytics</h2>
        <p className="text-gray-600">Get personalized insights and predictions based on your interview performance</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'insights', label: 'Insights', icon: <Brain className="h-4 w-4" /> },
            { id: 'trends', label: 'Performance Trends', icon: <BarChart3 className="h-4 w-4" /> },
            { id: 'prediction', label: 'Predictions', icon: <Zap className="h-4 w-4" /> }
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
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {insights.length === 0 ? (
            <Card className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Insights Available</h3>
              <p className="text-gray-600">Complete more interviews to receive AI-powered insights</p>
            </Card>
          ) : (
            insights.map((insight, index) => (
              <Card key={index} className={`border-l-4 ${getInsightColor(insight.type, insight.priority)}`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${getInsightColor(insight.type, insight.priority).replace('text-', 'bg-').replace('-700', '-100')}`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                          insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {insight.priority} priority
                        </span>
                        {insight.actionable && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Actionable
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{insight.description}</p>
                    {insight.metrics && (
                      <div className="flex items-center space-x-4 text-sm">
                        <div>
                          <span className="text-gray-600">Current: </span>
                          <span className="font-semibold">{insight.metrics.current}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Target: </span>
                          <span className="font-semibold">{insight.metrics.target}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Gap: </span>
                          <span className="font-semibold">{insight.metrics.improvement}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="space-y-6">
          {trends.length === 0 ? (
            <Card className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Trends Available</h3>
              <p className="text-gray-600">Complete more interviews to see performance trends</p>
            </Card>
          ) : (
            trends.map((trend, index) => (
              <Card key={index}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {formatSkillName(trend.skillArea)}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(trend.trend)}
                      <span className={`text-sm font-medium ${
                        trend.trend === 'improving' ? 'text-green-600' :
                        trend.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {trend.trend}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Change Rate</div>
                    <div className={`text-lg font-bold ${
                      trend.changeRate > 0 ? 'text-green-600' : 
                      trend.changeRate < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {trend.changeRate > 0 ? '+' : ''}{trend.changeRate.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Simple trend visualization */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Recent Sessions</span>
                    <span>Score Range: {Math.min(...trend.sessions.map(s => s.score))}% - {Math.max(...trend.sessions.map(s => s.score))}%</span>
                  </div>
                  <div className="flex items-end space-x-1 h-20">
                    {trend.sessions.slice(-10).map((session, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div
                          className={`w-full rounded-t ${
                            session.score >= 80 ? 'bg-green-500' :
                            session.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ height: `${(session.score / 100) * 60}px` }}
                          title={`${session.score}% on ${new Date(session.date).toLocaleDateString()}`}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'prediction' && (
        <div className="space-y-6">
          {!prediction ? (
            <Card className="text-center py-12">
              <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Predictions Not Available</h3>
              <p className="text-gray-600">Complete at least 3 interviews to receive performance predictions</p>
            </Card>
          ) : (
            <>
              {/* Predicted Score */}
              <Card className="text-center">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {prediction.predictedNextScore}%
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    Predicted Next Score
                  </div>
                  <div className="text-gray-600">
                    Confidence Level: {prediction.confidenceLevel}%
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Estimated Timeline</span>
                    </div>
                    <div className="text-blue-700">
                      {prediction.estimatedImprovementDays} days to reach target
                    </div>
                  </div>
                  
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Award className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-emerald-900">Success Probability</span>
                    </div>
                    <div className="text-emerald-700">
                      {prediction.confidenceLevel}% likely to improve
                    </div>
                  </div>
                </div>
              </Card>

              {/* Focus Areas */}
              {prediction.recommendedFocusAreas.length > 0 && (
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Focus Areas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prediction.recommendedFocusAreas.map((area, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Target className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <div className="font-medium text-yellow-900">{area}</div>
                          <div className="text-sm text-yellow-700">High impact area for improvement</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Risk Factors */}
              {prediction.riskFactors.length > 0 && (
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors</h3>
                  <div className="space-y-3">
                    {prediction.riskFactors.map((risk, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium text-red-900">Attention Needed</div>
                          <div className="text-sm text-red-700">{risk}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}