import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Clock, Sparkles, Award } from 'lucide-react';

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
    <>
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

      {/* Main content */}
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
    </>
  );
};

export default Page;