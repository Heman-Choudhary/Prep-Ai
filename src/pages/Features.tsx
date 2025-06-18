import React from 'react';
import { 
  Mic, 
  Brain, 
  BarChart3, 
  Target, 
  Clock, 
  Users,
  Headphones,
  MessageSquare,
  TrendingUp,
  Shield,
  Zap,
  Award
} from 'lucide-react';
import { Card } from '../components/ui/Card';

export function Features() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
            <Zap className="h-4 w-4 mr-2" />
            Advanced AI Technology
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Interview Success
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all the advanced features that make PrepAI the most comprehensive 
            AI-powered interview preparation platform available today.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Core Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to prepare for and ace your next interview
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Mic className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Voice Agent</h3>
              <p className="text-gray-600 mb-4">
                Engage in natural conversations with our advanced AI interviewer that adapts 
                to your responses and maintains realistic interview flow.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Natural speech patterns</li>
                <li>• Real-time response adaptation</li>
                <li>• Multiple voice options</li>
              </ul>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Question Generation</h3>
              <p className="text-gray-600 mb-4">
                Get intelligently generated questions based on your target role, experience level, 
                and industry using advanced AI algorithms.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Role-specific questions</li>
                <li>• Dynamic difficulty adjustment</li>
                <li>• Industry context awareness</li>
              </ul>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Comprehensive Analytics</h3>
              <p className="text-gray-600 mb-4">
                Receive detailed performance insights with 100-point scoring system 
                and personalized improvement recommendations.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Multi-dimensional scoring</li>
                <li>• Progress tracking</li>
                <li>• Detailed feedback reports</li>
              </ul>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Customizable Practice</h3>
              <p className="text-gray-600 mb-4">
                Tailor your interview practice to match your specific needs with extensive 
                customization options for optimal preparation.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Multiple interview types</li>
                <li>• Adjustable session duration</li>
                <li>• Difficulty level control</li>
              </ul>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Headphones className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Voice & Text Interface</h3>
              <p className="text-gray-600 mb-4">
                Choose between voice and text-based interactions, or combine both 
                for a flexible and comfortable practice experience.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Speech recognition</li>
                <li>• Text-to-speech synthesis</li>
                <li>• Hybrid interaction modes</li>
              </ul>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Flexible Scheduling</h3>
              <p className="text-gray-600 mb-4">
                Practice anytime with sessions ranging from quick 15-minute refreshers 
                to comprehensive 45-minute mock interviews.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 15, 30, or 45-minute sessions</li>
                <li>• 24/7 availability</li>
                <li>• Instant start capability</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Advanced Capabilities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional-grade features designed for serious interview preparation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Feedback</h3>
                  <p className="text-gray-600">
                    Get immediate feedback during your interview practice, helping you adjust 
                    your responses and improve on the spot.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                  <p className="text-gray-600">
                    Monitor your improvement over time with detailed analytics showing your 
                    growth in different competency areas.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Industry Support</h3>
                  <p className="text-gray-600">
                    Practice for roles across technology, healthcare, finance, consulting, 
                    and many other industries with specialized question banks.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex">
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
                  <p className="text-gray-600">
                    Your practice sessions and personal data are protected with enterprise-grade 
                    security and privacy measures.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Award className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Certification Ready</h3>
                  <p className="text-gray-600">
                    Prepare for professional certifications and technical interviews with 
                    industry-standard questions and evaluation criteria.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
                  <p className="text-gray-600">
                    Get your performance analysis and feedback immediately after completing 
                    your practice session - no waiting required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interview Types */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Interview Types Supported</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Practice for any type of interview with our comprehensive question database
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Technical</h3>
              <p className="text-gray-600 text-sm">
                Coding challenges, system design, and technical problem-solving questions.
              </p>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Behavioral</h3>
              <p className="text-gray-600 text-sm">
                STAR method questions about past experiences and soft skills assessment.
              </p>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Case Study</h3>
              <p className="text-gray-600 text-sm">
                Business scenarios, analytical thinking, and strategic problem-solving.
              </p>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mixed</h3>
              <p className="text-gray-600 text-sm">
                Combination of technical, behavioral, and case study questions.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}