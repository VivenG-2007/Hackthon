"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Briefcase, FileText, GraduationCap, TrendingUp, Sparkles } from 'lucide-react';

export default function IntelligentCareerAgent() {
  const [scrollY, setScrollY] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = useMemo(() => [
    {
      icon: <FileText className="w-12 h-12" />,
      title: "AI Resume Evaluator",
      description: "Get instant, intelligent feedback on your resume with our advanced AI analysis. Identify strengths, weaknesses, and optimization opportunities.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <GraduationCap className="w-12 h-12" />,
      title: "Personalized Training",
      description: "Access tailored learning paths based on your career goals. Master in-demand skills with our expert-curated courses and interactive exercises.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Career Path Planner",
      description: "Visualize your career trajectory with AI-powered insights. Get personalized roadmaps that align with market trends and your aspirations.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Briefcase className="w-12 h-12" />,
      title: "Interview Preparation",
      description: "Practice with AI-driven mock interviews. Receive real-time feedback on your responses, body language, and communication skills.",
      color: "from-orange-500 to-red-500"
    }
  ], []);

  const handleGetStarted = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Neon Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="text-center z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">AI-Powered Career Intelligence</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
            Intelligent Career Agent
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            Transform Your Career Journey with AI-Powered Resume Analysis, Personalized Training & Strategic Planning
          </p>
          
          <button 
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-full font-semibold text-lg hover:scale-105 transform transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70"
          >
            Get Started Now
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const offset = scrollY > 300 ? (scrollY - 300) * 0.05 * (index % 2 === 0 ? 1 : -1) : 0;
            
            return (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-gray-600 transition-all duration-300 group"
                style={{ transform: `translateX(${offset}px)` }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Ready to Transform Your Career?
          </h2>
          
          <p className="text-xl text-gray-300 mb-8">
            Join professionals who are accelerating their careers with AI
          </p>
          
          <button 
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-full font-semibold text-lg hover:scale-105 transform transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70"
          >
            Thanks for Choosing Us
          </button>
        </div>
      </div>
    </div>
  );
}