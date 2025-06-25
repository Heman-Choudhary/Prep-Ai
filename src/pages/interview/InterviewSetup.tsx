import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Clock, 
  Target, 
  Settings,
  ArrowRight,
  Mic,
  MessageSquare
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DifficultySlider } from '../../components/ui/DifficultySlider';

export function InterviewSetup() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    role: '',
    experienceLevel: '',
    interviewType: '',
    difficulty: 50, // Changed to number for slider
    duration: 30,
    interactionMode: 'voice'
  });

  const roles = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'UX/UI Designer',
    'Marketing Manager',
    'Sales Representative',
    'Business Analyst',
    'DevOps Engineer',
    'Project Manager',
    'Consultant'
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6-10 years)' },
    { value: 'lead', label: 'Lead/Principal (10+ years)' }
  ];

  const interviewTypes = [
    { value: 'technical', label: 'Technical Interview', description: 'Coding, system design, technical questions' },
    { value: 'behavioral', label: 'Behavioral Interview', description: 'STAR method, soft skills, past experiences' },
    { value: 'case', label: 'Case Study', description: 'Business scenarios, analytical thinking' },
    { value: 'mixed', label: 'Mixed Interview', description: 'Combination of technical and behavioral' }
  ];

  const durations = [15, 30, 45];

  // Convert slider value to difficulty string for backend
  const getDifficultyString = (value: number) => {
    if (value <= 34) return 'easy';
    if (value <= 64) return 'medium';
    return 'hard';
  };

  const handleStartInterview = () => {
    // Store config in sessionStorage for the interview session
    const configWithStringDifficulty = {
      ...config,
      difficulty: getDifficultyString(config.difficulty)
    };
    sessionStorage.setItem('interviewConfig', JSON.stringify(configWithStringDifficulty));
    navigate('/interview/session');
  };

  const isConfigComplete = config.role && config.experienceLevel && config.interviewType;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Configure Your Interview
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Customize your practice session to match your target role and experience level
          </p>
        </header>

        <main className="space-y-8">
          {/* Role Selection */}
          <Card>
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Target Role</h3>
                <p className="text-gray-600">Select the position you're preparing for</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setConfig({ ...config, role })}
                  className={`p-4 text-left border rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    config.role === role
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-pressed={config.role === role}
                >
                  {role}
                </button>
              ))}
            </div>
          </Card>

          {/* Experience Level */}
          <Card>
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Experience Level</h3>
                <p className="text-gray-600">Choose your current experience level</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experienceLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setConfig({ ...config, experienceLevel: level.value })}
                  className={`p-4 text-left border rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    config.experienceLevel === level.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-pressed={config.experienceLevel === level.value}
                >
                  <div className="font-medium">{level.label}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Interview Type */}
          <Card>
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-3 rounded-lg mr-4">
                <MessageSquare className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Interview Type</h3>
                <p className="text-gray-600">Select the type of interview you want to practice</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interviewTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setConfig({ ...config, interviewType: type.value })}
                  className={`p-4 text-left border rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    config.interviewType === type.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-pressed={config.interviewType === type.value}
                >
                  <div className="font-medium mb-1">{type.label}</div>
                  <div className="text-sm text-gray-600">{type.description}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 p-3 rounded-lg mr-4">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Advanced Settings</h3>
                <p className="text-gray-600">Fine-tune your interview experience</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Enhanced Difficulty Slider */}
              <DifficultySlider
                value={config.difficulty}
                onChange={(value) => setConfig({ ...config, difficulty: value })}
              />

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Session Duration
                </label>
                <div className="flex space-x-3">
                  {durations.map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setConfig({ ...config, duration })}
                      className={`flex items-center px-4 py-3 border rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        config.duration === duration
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      aria-pressed={config.duration === duration}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {duration} min
                    </button>
                  ))}
                </div>
              </div>

              {/* Interaction Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Interaction Mode
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => setConfig({ ...config, interactionMode: 'voice' })}
                    className={`flex items-center p-4 border rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      config.interactionMode === 'voice'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-pressed={config.interactionMode === 'voice'}
                  >
                    <Mic className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Voice Mode</div>
                      <div className="text-sm text-gray-600">Speak your answers naturally</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setConfig({ ...config, interactionMode: 'text' })}
                    className={`flex items-center p-4 border rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      config.interactionMode === 'text'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-pressed={config.interactionMode === 'text'}
                  >
                    <MessageSquare className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Text Mode</div>
                      <div className="text-sm text-gray-600">Type your responses</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Start Button */}
          <div className="text-center">
            <Button
              onClick={handleStartInterview}
              disabled={!isConfigComplete}
              size="lg"
              className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Interview Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            {!isConfigComplete && (
              <p className="text-sm text-gray-500 mt-2">
                Please complete all required fields to start your interview
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}