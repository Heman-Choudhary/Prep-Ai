import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Settings, Clock, Target, Brain } from 'lucide-react';
import { useInterview, InterviewConfig } from '../contexts/InterviewContext';

const InterviewSetup: React.FC = () => {
  const navigate = useNavigate();
  const { setConfig, startInterview } = useInterview();
  
  const [config, setConfigState] = useState<InterviewConfig>({
    role: '',
    experienceLevel: '',
    interviewType: '',
    difficulty: '',
    industry: '',
    duration: 30,
  });

  const roles = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'UX Designer',
    'Marketing Manager',
    'Sales Representative',
    'Business Analyst',
    'DevOps Engineer',
    'Full Stack Developer',
    'Project Manager',
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (2-5 years)' },
    { value: 'senior', label: 'Senior Level (5-10 years)' },
    { value: 'lead', label: 'Lead/Principal (10+ years)' },
  ];

  const interviewTypes = [
    { value: 'behavioral', label: 'Behavioral', description: 'Questions about your past experiences and soft skills' },
    { value: 'technical', label: 'Technical', description: 'Role-specific technical questions and problem-solving' },
    { value: 'mixed', label: 'Mixed', description: 'Combination of behavioral and technical questions' },
  ];

  const difficultyLevels = [
    { value: 'easy', label: 'Easy', description: 'Basic questions suitable for beginners' },
    { value: 'medium', label: 'Medium', description: 'Intermediate difficulty with some challenging aspects' },
    { value: 'hard', label: 'Hard', description: 'Advanced questions for experienced professionals' },
  ];

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'E-commerce',
    'Consulting',
    'Education',
    'Manufacturing',
    'Media & Entertainment',
    'Non-profit',
    'Government',
  ];

  const durations = [15, 30, 45, 60];

  const handleConfigChange = (field: keyof InterviewConfig, value: any) => {
    setConfigState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isConfigValid = () => {
    return config.role && config.experienceLevel && config.interviewType && 
           config.difficulty && config.industry && config.duration;
  };

  const handleStartInterview = () => {
    if (!isConfigValid()) return;
    
    setConfig(config);
    const sessionId = startInterview(config);
    navigate(`/interview/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Customize Your Interview Experience
          </h1>
          <p className="text-gray-600">
            Configure your practice session to match your target role and interview style
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Role Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                What role are you interviewing for?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleConfigChange('role', role)}
                    className={`p-3 text-left border rounded-lg transition-all ${
                      config.role === role
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{role}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                What's your experience level?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {experienceLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => handleConfigChange('experienceLevel', level.value)}
                    className={`p-4 text-left border rounded-lg transition-all ${
                      config.experienceLevel === level.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{level.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interview Type */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                What type of interview do you want to practice?
              </label>
              <div className="space-y-3">
                {interviewTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleConfigChange('interviewType', type.value)}
                    className={`w-full p-4 text-left border rounded-lg transition-all ${
                      config.interviewType === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                      </div>
                      <div className="flex items-center">
                        {type.value === 'behavioral' && <Target className="w-5 h-5" />}
                        {type.value === 'technical' && <Brain className="w-5 h-5" />}
                        {type.value === 'mixed' && <Settings className="w-5 h-5" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Choose difficulty level
              </label>
              <div className="space-y-3">
                {difficultyLevels.map((difficulty) => (
                  <button
                    key={difficulty.value}
                    onClick={() => handleConfigChange('difficulty', difficulty.value)}
                    className={`w-full p-4 text-left border rounded-lg transition-all ${
                      config.difficulty === difficulty.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{difficulty.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{difficulty.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                What industry are you targeting?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => handleConfigChange('industry', industry)}
                    className={`p-3 text-center border rounded-lg transition-all ${
                      config.industry === industry
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{industry}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                How long would you like the interview to be?
              </label>
              <div className="grid grid-cols-4 gap-3">
                {durations.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => handleConfigChange('duration', duration)}
                    className={`p-4 text-center border rounded-lg transition-all ${
                      config.duration === duration
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Clock className="w-5 h-5 mx-auto mb-1" />
                    <div className="font-medium">{duration} min</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {isConfigValid() ? (
                  <span className="text-green-600">✓ Configuration complete</span>
                ) : (
                  'Please complete all sections to continue'
                )}
              </div>
              <button
                onClick={handleStartInterview}
                disabled={!isConfigValid()}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isConfigValid()
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Start Interview</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;