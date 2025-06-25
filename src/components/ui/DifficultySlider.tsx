import React from 'react';

interface DifficultySliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function DifficultySlider({ value, onChange, className = '' }: DifficultySliderProps) {
  const getDifficultyLabel = (val: number) => {
    if (val <= 34) return 'Easy';
    if (val <= 64) return 'Medium';
    return 'Hard';
  };

  const getDifficultyColor = (val: number) => {
    if (val <= 34) return 'text-green-600';
    if (val <= 64) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getThumbColor = (val: number) => {
    if (val <= 34) return 'bg-green-500';
    if (val <= 64) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Difficulty Level
        </label>
        <span className={`text-lg font-semibold ${getDifficultyColor(value)}`}>
          {getDifficultyLabel(value)}
        </span>
      </div>
      
      <div className="relative h-6 flex items-center">
        {/* Track background with gradient */}
        <div 
          className="absolute w-full h-3 rounded-lg"
          style={{
            background: `linear-gradient(to right, 
              #10b981 0%, #10b981 34%, 
              #f59e0b 34%, #f59e0b 64%, 
              #ef4444 64%, #ef4444 100%)`
          }}
        />
        
        {/* Invisible native slider for functionality */}
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute w-full h-6 opacity-0 cursor-pointer z-10"
        />
        
        {/* Custom thumb */}
        <div 
          className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-200 ${getThumbColor(value)} z-20 pointer-events-none`}
          style={{ 
            left: `calc(${value}% - 12px)`,
            transform: 'translateY(0)'
          }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>0</span>
        <span className="text-green-600">Easy</span>
        <span className="text-yellow-600">Medium</span>
        <span className="text-red-600">Hard</span>
        <span>100</span>
      </div>
      
      <div className="text-sm text-gray-600">
        {value <= 34 && "Basic questions with gentle pacing and helpful hints"}
        {value > 34 && value <= 64 && "Standard difficulty with realistic interview pace"}
        {value > 64 && "Challenging questions with fast pace and complex scenarios"}
      </div>
    </div>
  );
}

// Demo component to test the slider
export default function DifficultySliderDemo() {
  const [difficulty, setDifficulty] = React.useState(50);

  return (
    <div className="max-w-md mx-auto p-8 bg-white">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <span className="text-orange-600">⚙️</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Advanced Settings</h2>
            <p className="text-gray-600 text-sm">Fine-tune your interview experience</p>
          </div>
        </div>
      </div>
      
      <DifficultySlider 
        value={difficulty} 
        onChange={setDifficulty}
      />
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Current value: <span className="font-mono font-semibold">{difficulty}</span>
        </p>
      </div>
    </div>
  );
}