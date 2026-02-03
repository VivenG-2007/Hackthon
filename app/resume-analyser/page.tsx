"use client"
import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';

function ResumeAnalyser() {
  const { isLoaded, isSignedIn, user } = useUser();
  
  // Add loading state for Clerk authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading authentication...</div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('analyze');
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  
  // Get user ID from Clerk - prioritize username
  const getUserId = () => {
    if (!user) return null;
    return user.username || user.primaryEmailAddress?.emailAddress || user.id;
  };
  
  const userId = getUserId();
  
  // Complete structured data state matching API schema
  const [structuredData, setStructuredData] = useState({
    personal_info: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: ''
    },
    summary: '',
    experience: [
      {
        title: '',
        company: '',
        duration: '',
        highlights: ['']
      }
    ],
    education: [
      {
        degree: '',
        institution: '',
        year: ''
      }
    ],
    skills: [''],
    certifications: [''],
    target_role: ''
  });

  const API_BASE_URL = 'http://localhost:8000/api/webhook/resume';

  const handleAnalyze = async () => {
    if (!isSignedIn) {
      setError("Please sign in to use this feature");
      return;
    }

    if (!resumeText.trim() || !targetRole.trim()) {
      setError("Please fill in both resume text and target role");
      return;
    }

    if (!userId) {
      setError("Unable to identify user");
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const payload = {
      user_id: userId, // Dynamic from Clerk
      data: {
        resume_text: resumeText, // Dynamic from textarea
        target_role: targetRole  // Dynamic from input
      }
    };

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setResult(data);
      
    } catch (err) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleEnhance = async () => {
    if (!isSignedIn) {
      setError("Please sign in to use this feature");
      return;
    }

    if (!resumeText.trim() || !targetRole.trim()) {
      setError("Please fill in both resume text and target role");
      return;
    }

    if (!userId) {
      setError("Unable to identify user");
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const payload = {
      user_id: userId, // Dynamic from Clerk
      data: {
        resume_text: resumeText, // Dynamic from textarea
        target_role: targetRole  // Dynamic from input
      }
    };

    try {
      const response = await fetch(`${API_BASE_URL}/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setResult(data);
      
    } catch (err) {
      setError(err.message || 'An error occurred during enhancement');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!isSignedIn) {
      setError("Please sign in to use this feature");
      return;
    }

    if (!structuredData.target_role.trim()) {
      setError("Please specify a target role");
      return;
    }

    if (!userId) {
      setError("Unable to identify user");
      return;
    }

    // Validate required fields
    if (!structuredData.personal_info.name.trim() || 
        !structuredData.personal_info.email.trim()) {
      setError("Please fill in at least name and email");
      return;
    }

    // Clean empty values from arrays before sending
    const cleanedData = {
      ...structuredData,
      experience: structuredData.experience
        .filter(exp => exp.title.trim() || exp.company.trim())
        .map(exp => ({
          ...exp,
          highlights: exp.highlights.filter(h => h.trim())
        })),
      education: structuredData.education
        .filter(edu => edu.degree.trim() || edu.institution.trim()),
      skills: structuredData.skills.filter(skill => skill.trim()),
      certifications: structuredData.certifications.filter(cert => cert.trim())
    };

    setLoading(true);
    setError('');
    setResult(null);

    const payload = {
      user_id: userId, // Dynamic from Clerk
      data: cleanedData // Fully dynamic structured data
    };

    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setResult(data);
      
    } catch (err) {
      setError(err.message || 'An error occurred during generation');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to update structured data
  const updatePersonalInfo = (field, value) => {
    setStructuredData({
      ...structuredData,
      personal_info: {
        ...structuredData.personal_info,
        [field]: value
      }
    });
  };

  const updateExperience = (index, field, value) => {
    const newExperience = [...structuredData.experience];
    newExperience[index] = {
      ...newExperience[index],
      [field]: value
    };
    setStructuredData({
      ...structuredData,
      experience: newExperience
    });
  };

  const updateExperienceHighlight = (expIndex, highlightIndex, value) => {
    const newExperience = [...structuredData.experience];
    const newHighlights = [...newExperience[expIndex].highlights];
    newHighlights[highlightIndex] = value;
    newExperience[expIndex].highlights = newHighlights;
    
    setStructuredData({
      ...structuredData,
      experience: newExperience
    });
  };

  const addExperience = () => {
    setStructuredData({
      ...structuredData,
      experience: [
        ...structuredData.experience,
        { title: '', company: '', duration: '', highlights: [''] }
      ]
    });
  };

  const removeExperience = (index) => {
    const newExperience = [...structuredData.experience];
    newExperience.splice(index, 1);
    setStructuredData({
      ...structuredData,
      experience: newExperience
    });
  };

  const addExperienceHighlight = (expIndex) => {
    const newExperience = [...structuredData.experience];
    newExperience[expIndex].highlights.push('');
    setStructuredData({
      ...structuredData,
      experience: newExperience
    });
  };

  const removeExperienceHighlight = (expIndex, highlightIndex) => {
    const newExperience = [...structuredData.experience];
    const newHighlights = [...newExperience[expIndex].highlights];
    newHighlights.splice(highlightIndex, 1);
    newExperience[expIndex].highlights = newHighlights;
    setStructuredData({
      ...structuredData,
      experience: newExperience
    });
  };

  const updateEducation = (index, field, value) => {
    const newEducation = [...structuredData.education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value
    };
    setStructuredData({
      ...structuredData,
      education: newEducation
    });
  };

  const addEducation = () => {
    setStructuredData({
      ...structuredData,
      education: [
        ...structuredData.education,
        { degree: '', institution: '', year: '' }
      ]
    });
  };

  const removeEducation = (index) => {
    const newEducation = [...structuredData.education];
    newEducation.splice(index, 1);
    setStructuredData({
      ...structuredData,
      education: newEducation
    });
  };

  const addSkill = () => {
    setStructuredData({
      ...structuredData,
      skills: [...structuredData.skills, '']
    });
  };

  const updateSkill = (index, value) => {
    const newSkills = [...structuredData.skills];
    newSkills[index] = value;
    setStructuredData({
      ...structuredData,
      skills: newSkills
    });
  };

  const removeSkill = (index) => {
    const newSkills = [...structuredData.skills];
    newSkills.splice(index, 1);
    setStructuredData({
      ...structuredData,
      skills: newSkills
    });
  };

  const addCertification = () => {
    setStructuredData({
      ...structuredData,
      certifications: [...structuredData.certifications, '']
    });
  };

  const updateCertification = (index, value) => {
    const newCertifications = [...structuredData.certifications];
    newCertifications[index] = value;
    setStructuredData({
      ...structuredData,
      certifications: newCertifications
    });
  };

  const removeCertification = (index) => {
    const newCertifications = [...structuredData.certifications];
    newCertifications.splice(index, 1);
    setStructuredData({
      ...structuredData,
      certifications: newCertifications
    });
  };

  const renderResult = () => {
    if (!result) return null;

    if (activeTab === 'analyze' && result.analysis) {
      return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Resume Analysis</h3>
          
          {/* Overall Score */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">Overall Score</h4>
              <div className="text-3xl font-bold text-white">
                {result.analysis.score}/100
                <span className="ml-3 text-lg text-gray-300">({result.analysis.grade})</span>
              </div>
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                style={{ width: `${result.analysis.score}%` }}
              />
            </div>
          </div>

          {/* Category Scores */}
          {result.analysis.categories && (
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4">Category Breakdown</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(result.analysis.categories).map(([category, score]) => (
                  <div key={category} className="bg-gray-700/30 p-4 rounded-xl">
                    <div className="text-gray-300 capitalize mb-2">{category}</div>
                    <div className="text-2xl font-bold text-white">{score}/25</div>
                    <div className="h-2 bg-gray-600 mt-2 rounded-full">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        style={{ width: `${(score / 25) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {result.analysis.strengths && result.analysis.strengths.length > 0 && (
              <div>
                <h4 className="text-xl font-bold text-white mb-4">✅ Strengths</h4>
                <div className="space-y-2">
                  {result.analysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-gray-300">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.analysis.improvements && result.analysis.improvements.length > 0 && (
              <div>
                <h4 className="text-xl font-bold text-white mb-4">📝 Suggested Improvements</h4>
                <div className="space-y-2">
                  {result.analysis.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-gray-300">{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Missing Keywords */}
          {result.analysis.keywords_missing && result.analysis.keywords_missing.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4">🔍 Missing Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {result.analysis.keywords_missing.map((keyword, index) => (
                  <span key={index} className="px-4 py-2 bg-red-500/10 text-red-300 rounded-full border border-red-500/30">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {result.analysis.summary && (
            <div>
              <h4 className="text-xl font-bold text-white mb-4">📋 Summary</h4>
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
                <p className="text-gray-300">{result.analysis.summary}</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'enhance' && result.enhanced) {
      return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Resume Enhancement Results</h3>
          
          {/* ATS Score Comparison */}
          <div className="mb-8">
            <h4 className="text-xl font-bold text-white mb-4">ATS Score Improvement</h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-700/30 p-6 rounded-xl">
                <div className="text-lg text-gray-300 mb-2">Before Enhancement</div>
                <div className="text-4xl font-bold text-red-400">{result.enhanced.ats_score_before}%</div>
                <div className="h-2 bg-gray-600 mt-3 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                    style={{ width: `${result.enhanced.ats_score_before}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-gray-700/30 p-6 rounded-xl">
                <div className="text-lg text-gray-300 mb-2">After Enhancement</div>
                <div className="text-4xl font-bold text-green-400">{result.enhanced.ats_score_after}%</div>
                <div className="h-2 bg-gray-600 mt-3 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    style={{ width: `${result.enhanced.ats_score_after}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Changes Made */}
          {result.enhanced.changes && result.enhanced.changes.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4">Improvements Made</h4>
              <div className="space-y-3">
                {result.enhanced.changes.map((change, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-300">{change}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Resume Text */}
          {result.enhanced.enhanced_resume && (
            <div>
              <h4 className="text-xl font-bold text-white mb-4">Enhanced Resume</h4>
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
                <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                  {result.enhanced.enhanced_resume}
                </pre>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'generate' && result.resume) {
      return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Generated Resume</h3>
          <div className="bg-white p-8 rounded-xl border border-gray-300">
            <pre className="text-gray-800 whitespace-pre-wrap font-sans">
              {result.resume}
            </pre>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                navigator.clipboard.writeText(result.resume);
                alert('Resume copied to clipboard!');
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderGenerateForm = () => {
    return (
      <div>
        <h3 className="text-xl font-bold text-white mb-6">Resume Generator</h3>
        <p className="text-gray-400 mb-6">Fill in all details to generate a professional resume</p>
        
        <div className="space-y-8">
          {/* Personal Information */}
          <div className="bg-gray-900/30 p-6 rounded-xl">
            <h4 className="text-lg font-bold text-white mb-4">👤 Personal Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Full Name *</label>
                <input
                  type="text"
                  value={structuredData.personal_info.name}
                  onChange={(e) => updatePersonalInfo('name', e.target.value)}
                  placeholder="John Doe"
                  className="w-full p-3 bg-gray-700/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Email *</label>
                <input
                  type="email"
                  value={structuredData.personal_info.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="john@example.com"
                  className="w-full p-3 bg-gray-700/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Phone</label>
                <input
                  type="text"
                  value={structuredData.personal_info.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full p-3 bg-gray-700/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Location</label>
                <input
                  type="text"
                  value={structuredData.personal_info.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full p-3 bg-gray-700/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={structuredData.personal_info.linkedin}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                  className="w-full p-3 bg-gray-700/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>
          </div>

          {/* Target Role */}
          <div>
            <label className="block text-white mb-2">🎯 Target Role *</label>
            <input
              type="text"
              value={structuredData.target_role}
              onChange={(e) => setStructuredData({
                ...structuredData,
                target_role: e.target.value
              })}
              placeholder="e.g., Full Stack Developer, Data Scientist"
              className="w-full p-4 bg-gray-700/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Professional Summary */}
          <div>
            <label className="block text-white mb-2">📝 Professional Summary</label>
            <textarea
              value={structuredData.summary}
              onChange={(e) => setStructuredData({
                ...structuredData,
                summary: e.target.value
              })}
              placeholder="Briefly describe your professional background, skills, and career goals..."
              rows="4"
              className="w-full p-4 bg-gray-700/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Experience */}
          <div className="bg-gray-900/30 p-6 rounded-xl">
            <h4 className="text-lg font-bold text-white mb-4">💼 Work Experience</h4>
            {structuredData.experience.map((exp, expIndex) => (
              <div key={expIndex} className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-white font-medium">Experience #{expIndex + 1}</h5>
                  {expIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(expIndex)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Job Title</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(expIndex, 'title', e.target.value)}
                      placeholder="Senior Developer"
                      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                      placeholder="TechCorp Inc."
                      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 mb-2 text-sm">Duration</label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => updateExperience(expIndex, 'duration', e.target.value)}
                      placeholder="Jan 2020 - Present"
                      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 text-sm">Achievements/Highlights</label>
                  {exp.highlights.map((highlight, highlightIndex) => (
                    <div key={highlightIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => updateExperienceHighlight(expIndex, highlightIndex, e.target.value)}
                        placeholder="Led a team of 5 developers on a major project"
                        className="flex-1 p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                      />
                      {highlightIndex > 0 && (
                        <button
                          type="button"
                          onClick={() => removeExperienceHighlight(expIndex, highlightIndex)}
                          className="px-3 text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addExperienceHighlight(expIndex)}
                    className="mt-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    + Add Highlight
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addExperience}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              + Add Experience
            </button>
          </div>

          {/* Education */}
          <div className="bg-gray-900/30 p-6 rounded-xl">
            <h4 className="text-lg font-bold text-white mb-4">🎓 Education</h4>
            {structuredData.education.map((edu, eduIndex) => (
              <div key={eduIndex} className="mb-4 p-4 bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-white font-medium">Education #{eduIndex + 1}</h5>
                  {eduIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(eduIndex)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(eduIndex, 'degree', e.target.value)}
                      placeholder="Bachelor of Science in Computer Science"
                      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(eduIndex, 'institution', e.target.value)}
                      placeholder="University of California, Berkeley"
                      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Year</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateEducation(eduIndex, 'year', e.target.value)}
                      placeholder="2020"
                      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addEducation}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              + Add Education
            </button>
          </div>

          {/* Skills */}
          <div className="bg-gray-900/30 p-6 rounded-xl">
            <h4 className="text-lg font-bold text-white mb-4">💻 Skills</h4>
            {structuredData.skills.map((skill, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                  placeholder="e.g., Python, React, AWS, PostgreSQL"
                  className="flex-1 p-3 bg-gray-700/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="px-4 text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              + Add Skill
            </button>
          </div>

          {/* Certifications */}
          <div className="bg-gray-900/30 p-6 rounded-xl">
            <h4 className="text-lg font-bold text-white mb-4">📜 Certifications</h4>
            {structuredData.certifications.map((cert, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={cert}
                  onChange={(e) => updateCertification(index, e.target.value)}
                  placeholder="e.g., AWS Solutions Architect, Google Cloud Professional"
                  className="flex-1 p-3 bg-gray-700/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="px-4 text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addCertification}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              + Add Certification
            </button>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !structuredData.target_role.trim() || 
                     !structuredData.personal_info.name.trim() || 
                     !structuredData.personal_info.email.trim() || 
                     !isSignedIn}
            className={`px-8 py-4 rounded-xl font-semibold transition-all w-full ${
              loading || !structuredData.target_role.trim() || 
              !structuredData.personal_info.name.trim() || 
              !structuredData.personal_info.email.trim() || 
              !isSignedIn
                ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white hover:scale-105'
            }`}
          >
            {loading ? 'Generating...' : 'Generate Resume'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* User Info Display */}
        {isSignedIn && user && (
          <div className="mb-6 p-4 bg-gray-800/30 rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">
                  Signed in as: <span className="text-white font-semibold">
                    {user.username || user.primaryEmailAddress?.emailAddress || user.id}
                  </span>
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  User ID for API: <code className="bg-gray-700 px-2 py-1 rounded">{userId}</code>
                </p>
              </div>
              {!user.username && (
                <div className="text-yellow-400 text-sm">
                  ⚠️ Set a username in Clerk for better identification
                </div>
              )}
            </div>
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          Resume Analyzer Pro
          {!isSignedIn && (
            <span className="block text-sm text-yellow-400 mt-2">
              (Sign in to save your analysis history)
            </span>
          )}
        </h1>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          {['analyze', 'enhance', 'generate'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all capitalize ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab === 'analyze' ? '📊 Analyze' : 
               tab === 'enhance' ? '✨ Enhance' : '📝 Generate'}
            </button>
          ))}
        </div>

        {/* Input Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 md:p-8 mb-8">
          {activeTab === 'analyze' || activeTab === 'enhance' ? (
            <>
              <div className="mb-6">
                <label className="block text-white mb-3">Resume Text:</label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here..."
                  className="w-full h-64 p-6 bg-gray-700/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>

              <div className="mb-8">
                <label className="block text-white mb-3">Target Role:</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Backend Engineer, Frontend Developer"
                  className="w-full p-6 bg-gray-700/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>

              <button
                onClick={activeTab === 'analyze' ? handleAnalyze : handleEnhance}
                disabled={loading || !resumeText.trim() || !targetRole.trim() || !isSignedIn}
                className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                  loading || !resumeText.trim() || !targetRole.trim() || !isSignedIn
                    ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-105'
                }`}
              >
                {loading ? 'Processing...' : activeTab === 'analyze' ? 'Analyze Resume' : 'Enhance Resume'}
              </button>
              
              {!isSignedIn && (
                <p className="mt-4 text-yellow-400 text-sm">
                  Please sign in to use this feature
                </p>
              )}
            </>
          ) : (
            renderGenerateForm()
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8">
            <p className="text-red-300">Error: {error}</p>
          </div>
        )}

        {/* Result Display */}
        {renderResult()}

        {/* Raw JSON Debugging */}
        {result && (
          <details className="bg-gray-900/30 border border-gray-700/50 rounded-2xl p-6">
            <summary className="text-gray-300 cursor-pointer">View Raw API Response</summary>
            <pre className="mt-4 text-gray-400 bg-gray-900/50 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

export default ResumeAnalyser;