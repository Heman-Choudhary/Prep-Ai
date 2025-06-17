interface AIQuestion {
  question: string;
  type: 'behavioral' | 'technical' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface InterviewConfig {
  role: string;
  experienceLevel: string;
  interviewType: string;
  difficulty: string;
  industry: string;
  duration: number;
}

class AIService {
  private geminiApiKey: string;
  private openaiApiKey: string;

  constructor() {
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  async generateQuestions(config: InterviewConfig, questionCount: number = 5): Promise<AIQuestion[]> {
    try {
      // Try Gemini first
      if (this.geminiApiKey) {
        return await this.generateQuestionsWithGemini(config, questionCount);
      }
      
      // Fallback to OpenAI
      if (this.openaiApiKey) {
        return await this.generateQuestionsWithOpenAI(config, questionCount);
      }

      // Fallback to mock questions if no API keys
      return this.generateMockQuestions(config, questionCount);
    } catch (error) {
      console.error('Error generating questions:', error);
      return this.generateMockQuestions(config, questionCount);
    }
  }

  private async generateQuestionsWithGemini(config: InterviewConfig, questionCount: number): Promise<AIQuestion[]> {
    const prompt = this.buildQuestionPrompt(config, questionCount);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text;
    
    return this.parseQuestionsFromResponse(generatedText, config);
  }

  private async generateQuestionsWithOpenAI(config: InterviewConfig, questionCount: number): Promise<AIQuestion[]> {
    const prompt = this.buildQuestionPrompt(config, questionCount);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interview coach who generates realistic interview questions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content;
    
    return this.parseQuestionsFromResponse(generatedText, config);
  }

  private buildQuestionPrompt(config: InterviewConfig, questionCount: number): string {
    return `Generate ${questionCount} interview questions for a ${config.role} position with the following specifications:
    
    - Experience Level: ${config.experienceLevel}
    - Interview Type: ${config.interviewType}
    - Difficulty: ${config.difficulty}
    - Industry: ${config.industry}
    
    Please format each question as JSON with the following structure:
    {
      "question": "The actual question text",
      "type": "behavioral|technical|situational",
      "difficulty": "easy|medium|hard",
      "category": "Category name"
    }
    
    Return only a JSON array of questions. Make sure questions are relevant, professional, and appropriate for the specified role and experience level.`;
  }

  private parseQuestionsFromResponse(response: string, config: InterviewConfig): AIQuestion[] {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        return questions.map((q: any) => ({
          question: q.question,
          type: q.type || 'behavioral',
          difficulty: q.difficulty || config.difficulty,
          category: q.category || 'General'
        }));
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
    }
    
    // Fallback to mock questions
    return this.generateMockQuestions(config, 5);
  }

  private generateMockQuestions(config: InterviewConfig, questionCount: number): AIQuestion[] {
    const mockQuestions: AIQuestion[] = [
      {
        question: "Tell me about yourself and your background.",
        type: "behavioral",
        difficulty: "easy",
        category: "Introduction"
      },
      {
        question: "Describe a challenging project you worked on and how you overcame obstacles.",
        type: "behavioral",
        difficulty: "medium",
        category: "Problem Solving"
      },
      {
        question: "How do you handle working under pressure and tight deadlines?",
        type: "behavioral",
        difficulty: "medium",
        category: "Stress Management"
      },
      {
        question: "Where do you see yourself in 5 years?",
        type: "behavioral",
        difficulty: "easy",
        category: "Career Goals"
      },
      {
        question: "What interests you most about this role and our company?",
        type: "behavioral",
        difficulty: "easy",
        category: "Motivation"
      }
    ];

    if (config.interviewType === 'technical' || config.interviewType === 'mixed') {
      mockQuestions.push({
        question: "Explain the difference between synchronous and asynchronous programming.",
        type: "technical",
        difficulty: config.difficulty as 'easy' | 'medium' | 'hard',
        category: "Technical Knowledge"
      });
    }

    return mockQuestions.slice(0, questionCount);
  }

  async analyzeResponse(question: string, response: string, config: InterviewConfig): Promise<{
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  }> {
    try {
      if (this.geminiApiKey) {
        return await this.analyzeWithGemini(question, response, config);
      }
      
      if (this.openaiApiKey) {
        return await this.analyzeWithOpenAI(question, response, config);
      }

      return this.generateMockAnalysis();
    } catch (error) {
      console.error('Error analyzing response:', error);
      return this.generateMockAnalysis();
    }
  }

  private async analyzeWithGemini(question: string, response: string, config: InterviewConfig): Promise<any> {
    const prompt = `Analyze this interview response and provide feedback:
    
    Question: ${question}
    Response: ${response}
    Role: ${config.role}
    Experience Level: ${config.experienceLevel}
    
    Please provide:
    1. A score out of 100
    2. Brief feedback
    3. 2-3 strengths
    4. 2-3 areas for improvement
    
    Format as JSON: {"score": number, "feedback": "string", "strengths": ["string"], "improvements": ["string"]}`;

    const response_api = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response_api.ok) {
      throw new Error('Gemini API request failed');
    }

    const data = await response_api.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text;
    
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing analysis response:', error);
    }
    
    return this.generateMockAnalysis();
  }

  private async analyzeWithOpenAI(question: string, response: string, config: InterviewConfig): Promise<any> {
    const prompt = `Analyze this interview response and provide feedback:
    
    Question: ${question}
    Response: ${response}
    Role: ${config.role}
    Experience Level: ${config.experienceLevel}
    
    Please provide:
    1. A score out of 100
    2. Brief feedback
    3. 2-3 strengths
    4. 2-3 areas for improvement
    
    Format as JSON: {"score": number, "feedback": "string", "strengths": ["string"], "improvements": ["string"]}`;

    const response_api = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interview coach who provides detailed feedback on interview responses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response_api.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response_api.json();
    const generatedText = data.choices[0]?.message?.content;
    
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing analysis response:', error);
    }
    
    return this.generateMockAnalysis();
  }

  private generateMockAnalysis(): any {
    return {
      score: Math.floor(Math.random() * 20) + 75,
      feedback: "Good response with clear structure. Consider adding more specific examples and quantifiable results.",
      strengths: [
        "Clear communication",
        "Good use of examples",
        "Professional demeanor"
      ],
      improvements: [
        "Add more specific metrics",
        "Expand on technical details",
        "Reduce filler words"
      ]
    };
  }
}

export const aiService = new AIService();