import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mic, 
  Brain, 
  Target, 
  BarChart3, 
  Users, 
  Clock, 
  Star,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Zap className="h-4 w-4 mr-2" />
              AI-Powered Interview Preparation
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Ace Your Next
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Interview
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Practice with our intelligent AI voice agent. Get personalized feedback, 
              improve your skills, and land your dream job with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                  Start Practicing Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-600">Interviews Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">24/7</div>
                <div className="text-gray-600">AI Availability</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PrepAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of interview preparation with cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mic className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Voice Agent</h3>
              <p className="text-gray-600">
                Practice with our intelligent voice agent that conducts realistic interviews 
                and adapts to your responses in real-time.
              </p>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Questions</h3>
              <p className="text-gray-600">
                Get role-specific questions tailored to your experience level, industry, 
                and the position you're targeting.
              </p>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Analytics</h3>
              <p className="text-gray-600">
                Receive comprehensive feedback with scores, improvement suggestions, 
                and progress tracking over time.
              </p>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalized Practice</h3>
              <p className="text-gray-600">
                Customize your practice sessions by role, experience level, 
                and interview type for maximum effectiveness.
              </p>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Flexible Timing</h3>
              <p className="text-gray-600">
                Practice anytime, anywhere with sessions ranging from quick 
                15-minute practices to comprehensive 45-minute interviews.
              </p>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Multi-Industry Support</h3>
              <p className="text-gray-600">
                Practice for various roles across tech, business, healthcare, 
                and many other industries with specialized question sets.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How PrepAI Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and see immediate improvements in your interview skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Configure Your Interview</h3>
              <p className="text-gray-600">
                Select your target role, experience level, interview type, and preferred duration 
                to create a personalized practice session.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-600 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Practice with AI</h3>
              <p className="text-gray-600">
                Engage in natural conversation with our AI interviewer. Use voice or text 
                to answer questions and receive real-time feedback.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-emerald-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Review & Improve</h3>
              <p className="text-gray-600">
                Get detailed performance analytics, personalized feedback, and actionable 
                recommendations to improve for your next practice or real interview.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how PrepAI has helped professionals land their dream jobs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "PrepAI helped me practice for my software engineering interview. The AI questions 
                were spot-on and the feedback was incredibly valuable. I got the job!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Chen</div>
                  <div className="text-gray-600 text-sm">Software Engineer at Google</div>
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "The voice interface made practice feel like a real interview. I felt much more 
                confident going into my actual interview and landed my dream PM role."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Michael Rodriguez</div>
                  <div className="text-gray-600 text-sm">Product Manager at Meta</div>
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "PrepAI's analytics showed me exactly where I needed to improve. The personalized 
                feedback was game-changing for my interview preparation."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Emily Johnson</div>
                  <div className="text-gray-600 text-sm">Data Scientist at Amazon</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who have improved their interview skills with PrepAI. 
            Start practicing today and land your dream job tomorrow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                Contact Us
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Start Practicing in Minutes</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}