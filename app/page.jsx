import React from 'react';
import Link from 'next/link';
import { Layout,ArrowRight, Presentation, Zap, Clock, Sparkles, Award, Home, Settings, HelpCircle, Users } from 'lucide-react';

const Page = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      title: "AI-Powered Creation",
      description: "Generate professional presentations in seconds using advanced AI technology"
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Save Time",
      description: "Create presentations 10x faster than traditional methods"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-blue-500" />,
      title: "Smart Templates",
      description: "Access hundreds of customizable, industry-specific templates"
    },
    {
      icon: <Award className="w-6 h-6 text-blue-500" />,
      title: "Professional Quality",
      description: "Get stunning, presentation-ready slides every time"
    }
  ];

  return (
    <div className="flex">
      {/* Vertical Navigation */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-8">
          <Presentation className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">SlideMaster AI</span>
        </div>
        <nav className="space-y-2">
          <Link href="/">
            <div className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </div>
          </Link>
          <Link href="/create">
            <div className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
              <Presentation className="w-5 h-5" />
              <span>Create</span>
            </div>
          </Link>
          <Link href="/templates">
            <div className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
              <Layout className="w-5 h-5" />
              <span>Templates</span>
            </div>
          </Link>
          <div className="border-t border-gray-200 my-4"></div>
          <Link href="/settings">
            <div className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </div>
          </Link>
          <Link href="/help">
            <div className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </div>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 min-h-screen bg-gray-50"> {/* Changed from bg-gradient-to-b from-white to-blue-50 */}
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex justify-end items-center">
            <div className="flex space-x-4">
              <button className="text-gray-600 hover:text-gray-900">Sign In</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Get Started
              </button>
            </div>
          </nav>
        </header>

        {/* Main content remains the same */}
        <main className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Create Amazing Presentations with AI
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your ideas into professional presentations in minutes. No design skills needed.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/create">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 flex items-center">
                  Try Now Free <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;