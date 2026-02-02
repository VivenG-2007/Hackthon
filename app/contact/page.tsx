"use client"

import React, { useState, useMemo } from 'react';
import { Mail, Phone, MapPin, Send, User, Code, Database } from 'lucide-react';

export default function ContactPage() {
  const [theme, setTheme] = useState('dark');
  const isDark = theme === 'dark';

  const themeClasses = useMemo(() => ({
    bg: isDark ? 'bg-gray-900' : 'bg-gray-50',
    text: isDark ? 'text-white' : 'text-gray-900',
    subtext: isDark ? 'text-gray-300' : 'text-gray-600',
    card: isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-lg',
    accent: isDark ? 'text-cyan-400' : 'text-purple-600',
    input: isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
  }), [isDark]);

  const developers = useMemo(() => [
    { name: "Viven Grantla", role: "Frontend Developer", icon: <Code className="w-6 h-6" />, color: "from-purple-500 to-pink-500" },
    { name: "Aarav Singh", role: "Frontend Developer", icon: <Code className="w-6 h-6" />, color: "from-blue-500 to-cyan-500" },
    { name: "Dheer", role: "Backend Developer", icon: <Database className="w-6 h-6" />, color: "from-green-500 to-emerald-500" },
    { name: "Emmanuel", role: "Backend Developer", icon: <Database className="w-6 h-6" />, color: "from-orange-500 to-red-500" },
    { name: "Tharun", role: "Backend Developer", icon: <Database className="w-6 h-6" />, color: "from-pink-500 to-purple-500" }
  ], []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${themeClasses.bg}`}>
      {/* Neon Background - Dark Mode Only */}
      {isDark && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      )}

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Mail className={`w-6 h-6 ${themeClasses.accent}`} />
            <span className={`text-sm font-semibold ${themeClasses.accent}`}>
              Get In Touch
            </span>
          </div>
          
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${themeClasses.text}`}>
            Contact Us
          </h1>
          
          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${themeClasses.subtext}`}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Info & Form */}
      <div className="relative max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className={`p-6 rounded-xl border text-center ${themeClasses.card}`}>
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mb-4`}>
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${themeClasses.text}`}>Email</h3>
            <p className={`text-sm ${themeClasses.subtext}`}>contact@careeragent.com</p>
          </div>

          <div className={`p-6 rounded-xl border text-center ${themeClasses.card}`}>
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 mb-4`}>
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${themeClasses.text}`}>Phone</h3>
            <p className={`text-sm ${themeClasses.subtext}`}>+1 (555) 123-4567</p>
          </div>

          <div className={`p-6 rounded-xl border text-center ${themeClasses.card}`}>
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 mb-4`}>
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${themeClasses.text}`}>Location</h3>
            <p className={`text-sm ${themeClasses.subtext}`}>Remote Team</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className={`rounded-2xl border p-8 max-w-2xl mx-auto ${themeClasses.card}`}>
          <h2 className={`text-2xl font-bold mb-6 ${themeClasses.text}`}>Send Us a Message</h2>
          <form className="space-y-6">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${themeClasses.text}`}>
                Your Name
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${themeClasses.input}`}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${themeClasses.text}`}>
                Email Address
              </label>
              <input
                type="email"
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${themeClasses.input}`}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${themeClasses.text}`}>
                Message
              </label>
              <textarea
                rows={5}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${themeClasses.input}`}
                placeholder="Tell us how we can help you..."
              />
            </div>

            <button
              type="submit"
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl'
              }`}
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Development Team */}
      <div className="relative max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-4 ${themeClasses.text}`}>
            Our Development Team
          </h2>
          <p className={`text-lg ${themeClasses.subtext}`}>
            Meet the people behind the platform
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {developers.map((dev, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border text-center ${themeClasses.card}`}
            >
              <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${dev.color} mb-4`}>
                {dev.icon}
                <div className="text-white" />
              </div>
              <h3 className={`text-lg font-bold mb-1 ${themeClasses.text}`}>
                {dev.name}
              </h3>
              <p className={`text-sm ${themeClasses.subtext}`}>
                {dev.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}