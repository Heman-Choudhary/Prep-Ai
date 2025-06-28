import { GoogleGenerativeAI } from '@google/generative-ai';
import { feedbackService, InterviewFeedback, UserProgress } from './feedbackService';

const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface AnalyticsInsight {
  type: 'improvement' | 'strength' | 'trend' | 'recommendation';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  metrics?: {
    current: number;
    target: number;
    improvement: number;
  };
}

export interface PerformanceTrend {
  skillArea: string;
  trend: 'improving' | 'declining' | 'stable';
  changeRate: number;
  sessions: Array<{
    date: string;
    score: number;
  }>;
}

export interface PredictiveAnalysis {
  predictedNextScore: number;
  confidenceLevel: number;
  estimatedImprovementDays: number;
  recommendedFocusAreas: string[];
  riskFactors: string[];
}

class AnalyticsService {
  // Generate AI-powered insights from user's interview history
  async generateInsights(userId: string): Promise<AnalyticsInsight[]> {
    try {
      const [feedback, progress] = await Promise.all([
        feedbackService.getUserFeedback(userId),
        feedbackService.getUserProgress(userId)
      ]);

      if (feedback.length === 0) {
        return this.getDefaultInsights();
      }

      // Use AI to analyze patterns if available
      if (genAI) {
        return await this.generateAIInsights(feedback, progress);
      }

      // Fallback to rule-based insights
      return this.generateRuleBasedInsights(feedback, progress);
    } catch (error) {
      console.error('Error generating insights:', error);
      return this.getDefaultInsights();
    }
  }

  // Generate performance trends analysis
  async generatePerformanceTrends(userId: string): Promise<PerformanceTrend[]> {
    try {
      const progress = await feedbackService.getUserProgress(userId);
      const feedback = await feedbackService.getUserFeedback(userId);

      const trends: PerformanceTrend[] = [];

      // Analyze each skill area
      const skillAreas = ['communication', 'technical', 'problem_solving', 'confidence'];
      
      for (const skill of skillAreas) {
        const skillProgress = progress.find(p => p.skillArea === skill);
        const skillScores = feedback.map(f => ({
          date: f.createdAt,
          score: this.getSkillScore(f, skill)
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        if (skillScores.length >= 2) {
          const trend = this.calculateTrend(skillScores);
          trends.push({
            skillArea: skill,
            trend: trend.direction,
            changeRate: trend.rate,
            sessions: skillScores
          });
        }
      }

      return trends;
    } catch (error) {
      console.error('Error generating performance trends:', error);
      return [];
    }
  }

  // Generate predictive analysis
  async generatePredictiveAnalysis(userId: string): Promise<PredictiveAnalysis | null> {
    try {
      const [feedback, progress] = await Promise.all([
        feedbackService.getUserFeedback(userId),
        feedbackService.getUserProgress(userId)
      ]);

      if (feedback.length < 3) {
        return null; // Need at least 3 sessions for prediction
      }

      // Use AI for advanced prediction if available
      if (genAI) {
        return await this.generateAIPrediction(feedback, progress);
      }

      // Fallback to statistical prediction
      return this.generateStatisticalPrediction(feedback, progress);
    } catch (error) {
      console.error('Error generating predictive analysis:', error);
      return null;
    }
  }

  // Generate comprehensive performance report
  async generatePerformanceReport(userId: string): Promise<{
    insights: AnalyticsInsight[];
    trends: PerformanceTrend[];
    prediction: PredictiveAnalysis | null;
    summary: {
      totalSessions: number;
      averageScore: number;
      improvementRate: number;
      strongestSkill: string;
      weakestSkill: string;
    };
  }> {
    try {
      const [insights, trends, prediction, stats] = await Promise.all([
        this.generateInsights(userId),
        this.generatePerformanceTrends(userId),
        this.generatePredictiveAnalysis(userId),
        feedbackService.getPerformanceStats(userId)
      ]);

      // Calculate strongest and weakest skills
      const skillScores = Object.entries(stats.skillBreakdown);
      const strongestSkill = skillScores.reduce((max, current) => 
        current[1] > max[1] ? current : max, ['', 0])[0];
      const weakestSkill = skillScores.reduce((min, current) => 
        current[1] < min[1] ? current : min, ['', 100])[0];

      return {
        insights,
        trends,
        prediction,
        summary: {
          totalSessions: stats.totalSessions,
          averageScore: stats.averageScore,
          improvementRate: stats.improvementTrend,
          strongestSkill: this.formatSkillName(strongestSkill),
          weakestSkill: this.formatSkillName(weakestSkill)
        }
      };
    } catch (error) {
      console.error('Error generating performance report:', error);
      throw new Error('Failed to generate performance report');
    }
  }

  // Private helper methods
  private async generateAIInsights(feedback: InterviewFeedback[], progress: UserProgress[]): Promise<AnalyticsInsight[]> {
    try {
      const model = genAI!.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Analyze this interview performance data and provide actionable insights:

Feedback History (${feedback.length} sessions):
${feedback.map(f => `
- Date: ${f.createdAt}
- Overall Score: ${f.overallScore}%
- Communication: ${f.communicationScore}%
- Technical: ${f.technicalScore}%
- Problem Solving: ${f.problemSolvingScore}%
- Confidence: ${f.confidenceScore}%
- Strengths: ${f.strengths.join(', ')}
- Improvements: ${f.improvements.join(', ')}
`).join('\n')}

Progress Data:
${progress.map(p => `
- Skill: ${p.skillArea}
- Current Score: ${p.currentScore}%
- Previous Score: ${p.previousScore || 'N/A'}%
- Improvement Rate: ${p.improvementRate}%
- Sessions: ${p.sessionsCount}
`).join('\n')}

Please provide 5-7 insights in JSON format with this structure:
{
  "insights": [
    {
      "type": "improvement|strength|trend|recommendation",
      "title": "Brief title",
      "description": "Detailed description with specific advice",
      "priority": "high|medium|low",
      "actionable": true|false,
      "metrics": {
        "current": number,
        "target": number,
        "improvement": number
      }
    }
  ]
}

Focus on:
1. Specific patterns in performance
2. Areas showing consistent improvement or decline
3. Actionable recommendations for skill development
4. Strengths to leverage
5. Weaknesses to address`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      try {
        const parsed = JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
        return parsed.insights || [];
      } catch (parseError) {
        console.error('Error parsing AI insights:', parseError);
        return this.generateRuleBasedInsights(feedback, progress);
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return this.generateRuleBasedInsights(feedback, progress);
    }
  }

  private generateRuleBasedInsights(feedback: InterviewFeedback[], progress: UserProgress[]): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = [];
    
    if (feedback.length === 0) return this.getDefaultInsights();

    const latest = feedback[0];
    const averageScore = feedback.reduce((sum, f) => sum + f.overallScore, 0) / feedback.length;

    // Performance trend insight
    if (feedback.length >= 3) {
      const recent3 = feedback.slice(0, 3);
      const recentAvg = recent3.reduce((sum, f) => sum + f.overallScore, 0) / 3;
      
      if (recentAvg > averageScore + 5) {
        insights.push({
          type: 'trend',
          title: 'Improving Performance Trend',
          description: `Your recent interviews show a ${Math.round(recentAvg - averageScore)}% improvement over your average. Keep up the excellent work!`,
          priority: 'high',
          actionable: true,
          metrics: {
            current: recentAvg,
            target: recentAvg + 10,
            improvement: recentAvg - averageScore
          }
        });
      } else if (recentAvg < averageScore - 5) {
        insights.push({
          type: 'improvement',
          title: 'Performance Needs Attention',
          description: `Your recent scores are ${Math.round(averageScore - recentAvg)}% below your average. Consider reviewing your preparation strategy.`,
          priority: 'high',
          actionable: true,
          metrics: {
            current: recentAvg,
            target: averageScore,
            improvement: averageScore - recentAvg
          }
        });
      }
    }

    // Skill-specific insights
    const skillScores = {
      communication: latest.communicationScore,
      technical: latest.technicalScore,
      problemSolving: latest.problemSolvingScore,
      confidence: latest.confidenceScore
    };

    const lowestSkill = Object.entries(skillScores).reduce((min, current) => 
      current[1] < min[1] ? current : min);
    const highestSkill = Object.entries(skillScores).reduce((max, current) => 
      current[1] > max[1] ? current : max);

    if (lowestSkill[1] < 70) {
      insights.push({
        type: 'improvement',
        title: `Focus on ${this.formatSkillName(lowestSkill[0])}`,
        description: `Your ${this.formatSkillName(lowestSkill[0]).toLowerCase()} score of ${lowestSkill[1]}% is below the recommended threshold. Consider targeted practice in this area.`,
        priority: 'high',
        actionable: true,
        metrics: {
          current: lowestSkill[1],
          target: 80,
          improvement: 80 - lowestSkill[1]
        }
      });
    }

    if (highestSkill[1] >= 85) {
      insights.push({
        type: 'strength',
        title: `Strong ${this.formatSkillName(highestSkill[0])}`,
        description: `Your ${this.formatSkillName(highestSkill[0]).toLowerCase()} skills are excellent at ${highestSkill[1]}%. Leverage this strength in your interviews.`,
        priority: 'medium',
        actionable: true
      });
    }

    // Consistency insight
    const scoreVariance = this.calculateVariance(feedback.map(f => f.overallScore));
    if (scoreVariance > 200) {
      insights.push({
        type: 'improvement',
        title: 'Improve Consistency',
        description: 'Your performance varies significantly between sessions. Focus on consistent preparation and practice routines.',
        priority: 'medium',
        actionable: true
      });
    }

    return insights;
  }

  private async generateAIPrediction(feedback: InterviewFeedback[], progress: UserProgress[]): Promise<PredictiveAnalysis> {
    try {
      const model = genAI!.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Based on this interview performance data, predict future performance:

Recent Performance:
${feedback.slice(0, 5).map(f => `Score: ${f.overallScore}%, Date: ${f.createdAt}`).join('\n')}

Progress Trends:
${progress.map(p => `${p.skillArea}: ${p.currentScore}% (${p.improvementRate}% change)`).join('\n')}

Provide prediction in JSON format:
{
  "predictedNextScore": number (0-100),
  "confidenceLevel": number (0-100),
  "estimatedImprovementDays": number,
  "recommendedFocusAreas": ["area1", "area2"],
  "riskFactors": ["factor1", "factor2"]
}`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      try {
        return JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
      } catch (parseError) {
        return this.generateStatisticalPrediction(feedback, progress);
      }
    } catch (error) {
      console.error('Error generating AI prediction:', error);
      return this.generateStatisticalPrediction(feedback, progress);
    }
  }

  private generateStatisticalPrediction(feedback: InterviewFeedback[], progress: UserProgress[]): PredictiveAnalysis {
    const recentScores = feedback.slice(0, 5).map(f => f.overallScore);
    const trend = this.calculateLinearTrend(recentScores);
    
    const currentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
    const predictedScore = Math.max(0, Math.min(100, currentAvg + trend * 2));
    
    // Find areas needing improvement
    const latest = feedback[0];
    const skillScores = [
      { name: 'communication', score: latest.communicationScore },
      { name: 'technical', score: latest.technicalScore },
      { name: 'problem_solving', score: latest.problemSolvingScore },
      { name: 'confidence', score: latest.confidenceScore }
    ];
    
    const focusAreas = skillScores
      .filter(skill => skill.score < 75)
      .sort((a, b) => a.score - b.score)
      .slice(0, 2)
      .map(skill => this.formatSkillName(skill.name));

    return {
      predictedNextScore: Math.round(predictedScore),
      confidenceLevel: Math.max(60, 100 - Math.abs(trend) * 10),
      estimatedImprovementDays: Math.max(7, Math.round(30 - trend * 5)),
      recommendedFocusAreas: focusAreas,
      riskFactors: trend < -2 ? ['Declining performance trend', 'Inconsistent practice'] : []
    };
  }

  private getDefaultInsights(): AnalyticsInsight[] {
    return [
      {
        type: 'recommendation',
        title: 'Start Your Interview Journey',
        description: 'Complete your first interview to begin receiving personalized insights and recommendations.',
        priority: 'high',
        actionable: true
      },
      {
        type: 'recommendation',
        title: 'Practice Regularly',
        description: 'Consistent practice is key to improvement. Aim for at least one interview session per week.',
        priority: 'medium',
        actionable: true
      }
    ];
  }

  private getSkillScore(feedback: InterviewFeedback, skill: string): number {
    switch (skill) {
      case 'communication': return feedback.communicationScore;
      case 'technical': return feedback.technicalScore;
      case 'problem_solving': return feedback.problemSolvingScore;
      case 'confidence': return feedback.confidenceScore;
      default: return feedback.overallScore;
    }
  }

  private calculateTrend(scores: Array<{ date: string; score: number }>): { direction: 'improving' | 'declining' | 'stable'; rate: number } {
    if (scores.length < 2) return { direction: 'stable', rate: 0 };
    
    const trend = this.calculateLinearTrend(scores.map(s => s.score));
    
    if (trend > 2) return { direction: 'improving', rate: trend };
    if (trend < -2) return { direction: 'declining', rate: Math.abs(trend) };
    return { direction: 'stable', rate: Math.abs(trend) };
  }

  private calculateLinearTrend(values: number[]): number {
    const n = values.length;
    if (n < 2) return 0;
    
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + i * val, 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private formatSkillName(skill: string): string {
    switch (skill) {
      case 'communication': return 'Communication';
      case 'technical': return 'Technical Skills';
      case 'problem_solving': return 'Problem Solving';
      case 'confidence': return 'Confidence';
      default: return skill.charAt(0).toUpperCase() + skill.slice(1);
    }
  }
}

export const analyticsService = new AnalyticsService();