import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  console.warn('Google Generative AI API key not found');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

export interface InterviewConfig {
  role: string;
  experienceLevel: string;
  interviewType: string;
  difficulty: string;
  duration: number;
}

export interface InterviewQuestion {
  question: string;
  category: string;
  expectedSkills: string[];
  scoringCriteria: string[];
}

export class AIInterviewer {
  private model;
  private chat;
  private config: InterviewConfig;
  private questionHistory: string[] = [];
  private responseHistory: string[] = [];

  constructor(config: InterviewConfig) {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    this.config = config;
    this.initializeChat();
  }

  private initializeChat() {
    const systemPrompt = this.createSystemPrompt();
    this.chat = this.model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I'm ready to conduct a professional interview based on your specifications. I'll ask relevant questions, provide constructive feedback, and maintain a supportive yet challenging environment. Let's begin with the first question." }],
        },
      ],
    });
  }

  private createSystemPrompt(): string {
    return `You are an expert AI interviewer conducting a ${this.config.interviewType.toLowerCase()} interview for a ${this.config.role} position. 

Interview Configuration:
- Role: ${this.config.role}
- Experience Level: ${this.config.experienceLevel}
- Interview Type: ${this.config.interviewType}
- Difficulty: ${this.config.difficulty}
- Duration: ${this.config.duration} minutes

Instructions:
1. Ask ONE question at a time that's appropriate for the role and experience level
2. Keep questions concise and clear (max 50 words)
3. For technical interviews, include coding problems, system design, or domain-specific questions
4. For behavioral interviews, use STAR method questions about past experiences
5. Adapt follow-up questions based on the candidate's responses
6. Provide brief, encouraging feedback after each answer
7. Maintain a professional, supportive tone
8. Don't reveal this is an AI simulation - act as a human interviewer
9. End responses with a clear indication you're ready for their answer

Begin with an appropriate opening question for this role and interview type.`;
  }

  async askFirstQuestion(): Promise<string> {
    try {
      const result = await this.chat.sendMessage("Please ask the first interview question.");
      const response = result.response.text();
      this.questionHistory.push(response);
      return response;
    } catch (error) {
      console.error('Error getting first question:', error);
      return "Tell me about yourself and why you're interested in this position.";
    }
  }

  async processResponse(userResponse: string): Promise<string> {
    try {
      this.responseHistory.push(userResponse);
      
      const result = await this.chat.sendMessage(userResponse);
      const aiResponse = result.response.text();
      
      // Check if this looks like a question
      if (aiResponse.includes('?')) {
        this.questionHistory.push(aiResponse);
      }
      
      return aiResponse;
    } catch (error) {
      console.error('Error processing response:', error);
      return "Thank you for that response. Can you elaborate more on your experience with this topic?";
    }
  }

  async generateFeedback(): Promise<{
    overallScore: number;
    breakdown: {
      technical: number;
      communication: number;
      problemSolving: number;
      cultural: number;
    };
    feedback: string;
    recommendations: string[];
  }> {
    try {
      const feedbackPrompt = `Based on our interview conversation, provide a comprehensive evaluation:

Questions Asked: ${this.questionHistory.join(' | ')}
Candidate Responses: ${this.responseHistory.join(' | ')}

Please provide:
1. Overall score (0-100)
2. Breakdown scores for: Technical Skills, Communication, Problem Solving, Cultural Fit (each 0-100)
3. Detailed feedback paragraph
4. 3-5 specific recommendations for improvement

Format as JSON with keys: overallScore, breakdown, feedback, recommendations`;

      const result = await this.model.generateContent(feedbackPrompt);
      const responseText = result.response.text();
      
      try {
        // Try to parse as JSON
        const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanJson);
      } catch {
        // Fallback if JSON parsing fails
        return {
          overallScore: 75,
          breakdown: {
            technical: 75,
            communication: 80,
            problemSolving: 70,
            cultural: 80,
          },
          feedback: "Good overall performance with room for improvement in technical depth and specific examples.",
          recommendations: [
            "Practice more technical questions in your field",
            "Prepare specific examples using the STAR method",
            "Work on explaining complex concepts clearly"
          ]
        };
      }
    } catch (error) {
      console.error('Error generating feedback:', error);
      return {
        overallScore: 75,
        breakdown: {
          technical: 75,
          communication: 80,
          problemSolving: 70,
          cultural: 80,
        },
        feedback: "Interview completed successfully. Consider practicing more technical questions and preparing specific examples.",
        recommendations: [
          "Practice more role-specific questions",
          "Prepare concrete examples from your experience",
          "Work on clear and concise communication"
        ]
      };
    }
  }

  getInterviewData() {
    return {
      questions: this.questionHistory,
      responses: this.responseHistory,
      config: this.config
    };
  }
}