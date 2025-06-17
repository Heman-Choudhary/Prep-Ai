import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX,
  Pause,
  Play,
  SkipForward,
  MessageCircle,
  Clock,
  User,
  Brain
} from 'lucide-react';
import { useInterview } from '../contexts/InterviewContext';

const Interview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentSession, getSession, addResponse, endInterview } = useInterview();
  
  const [session, setSession] = useState(currentSession || getSession(id!));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [response, setResponse] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    if (!session) {
      navigate('/dashboard');
      return;
    }

    const timer = setInterval(() => {
      if (!isPaused) {
        setTimeElapsed(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session, isPaused, navigate]);

  if (!session) {
    return null;
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === session.questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = () => {
    if (response.trim()) {
      const duration = Math.floor((Date.now() - questionStartTime) / 1000);
      addResponse(session.id, currentQuestion.id, response, duration);
    }

    if (isLastQuestion) {
      endInterview(session.id);
      navigate(`/results/${session.id}`);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setResponse('');
      setQuestionStartTime(Date.now());
    }
  };

  const handleSkipQuestion = () => {
    const duration = Math.floor((Date.now() - questionStartTime) / 1000);
    addResponse(session.id, currentQuestion.id, 'Skipped', duration);

    if (isLastQuestion) {
      endInterview(session.id);
      navigate(`/results/${session.id}`);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setResponse('');
      setQuestionStartTime(Date.now());
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-blue-400" />
              <span className="font-semibold">AI Interviewer</span>
            </div>
            <div className="text-sm text-gray-400">
              Question {currentQuestionIndex + 1} of {session.questions.length}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
            
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 h-[calc(100vh-80px)]">
        {/* Video Section */}
        <div className="lg:col-span-2 bg-gray-800 relative">
          {/* AI Interviewer Video */}
          <div className="h-1/2 bg-gradient-to-br from-blue-900 to-purple-900 relative flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Interviewer</h3>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Speaking...</span>
              </div>
            </div>
            
            {/* Question Display */}
            <div className="absolute bottom-6 left-6 right-6 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-gray-300 mb-1">Current Question:</div>
              <div className="text-lg font-medium">{currentQuestion.question}</div>
            </div>
          </div>

          {/* User Video */}
          <div className="h-1/2 bg-gray-700 relative flex items-center justify-center">
            {isVideoOn ? (
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-12 h-12 text-white" />
                </div>
                <p className="text-gray-300">You</p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <VideoOff className="w-12 h-12 mx-auto mb-2" />
                <p>Video is off</p>
              </div>
            )}
            
            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Recording</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-full px-6 py-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full transition-colors ${
                isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-full transition-colors ${
                !isVideoOn ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            
            <button
              onClick={togglePause}
              className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-full transition-colors ${
                isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              <div className={`w-5 h-5 rounded ${isRecording ? 'bg-white' : 'bg-red-500'}`}></div>
            </button>
            
            <div className="h-6 w-px bg-gray-600"></div>
            
            <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors">
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Response Panel */}
        <div className="bg-gray-50 text-gray-900 flex flex-col">
          {/* Question Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Your Response</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className={`w-2 h-2 rounded-full ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-400' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
                <span className="capitalize">{currentQuestion.difficulty}</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              Category: {currentQuestion.category}
            </div>
            
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
              <p className="text-blue-900">{currentQuestion.question}</p>
            </div>
          </div>

          {/* Response Area */}
          <div className="flex-1 p-6">
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response here or use voice recording..."
              className="w-full h-full resize-none border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-200 space-y-3">
            <button
              onClick={handleNextQuestion}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>{isLastQuestion ? 'Finish Interview' : 'Next Question'}</span>
              <SkipForward className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleSkipQuestion}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Skip Question
            </button>
            
            <div className="text-center text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {session.questions.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;