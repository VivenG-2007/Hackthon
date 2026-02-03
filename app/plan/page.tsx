"use client"
import React, { useState } from 'react';

function JobRecommendation() {
  const [skills, setSkills] = useState('');
  const [experienceYears, setExperienceYears] = useState(3);
  const [targetRole, setTargetRole] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const FAST_API_URL = 'http://localhost:8000/job-recommendations';

  const postToFastAPI = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    // Convert skills string to array
    const skillsArray = skills.split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

    const payload = {
      skills: skillsArray,
      experience_years: experienceYears,
      target_role: targetRole,
      location: location
    };

    try {
      const response = await fetch(FAST_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percent) => {
    if (percent >= 80) return 'from-green-500 to-emerald-500';
    if (percent >= 60) return 'from-yellow-500 to-orange-500';
    if (percent >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-rose-500';
  };

  const getGrowthIcon = (outlook) => {
    switch (outlook?.toLowerCase()) {
      case 'strong':
        return '📈';
      case 'high':
        return '🚀';
      case 'moderate':
        return '↗️';
      case 'low':
        return '↘️';
      default:
        return '📊';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Job Recommendations</h1>
        
        {/* Input Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-white mb-3">Skills (comma separated):</label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Python, FastAPI, PostgreSQL, Docker, React, etc."
                className="w-full h-32 p-4 bg-gray-700/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              <p className="text-gray-400 text-sm mt-2">Separate skills with commas</p>
            </div>

            <div>
              <label className="block text-white mb-3">Target Role:</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Backend Developer, Full Stack Engineer"
                className="w-full p-4 bg-gray-700/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-white mb-3">Years of Experience:</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                min="0"
                max="50"
                className="w-full p-4 bg-gray-700/50 border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-white mb-3">Preferred Location:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Remote, San Francisco, New York"
                className="w-full p-4 bg-gray-700/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>

          <button
            onClick={postToFastAPI}
            disabled={loading || !skills.trim() || !targetRole.trim()}
            className={`px-8 py-4 rounded-xl font-semibold transition-all ${
              loading || !skills.trim() || !targetRole.trim()
                ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-105'
            }`}
          >
            {loading ? 'Finding Jobs...' : 'Get Job Recommendations'}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8">
            <p className="text-red-300">Error: {error}</p>
          </div>
        )}

        {/* Results Display */}
        {result && result.status === "ok" && result.jobs && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white">Job Recommendations</h3>
              <div className="text-gray-300">
                Found {result.jobs.length} jobs matching your profile
              </div>
            </div>

            <div className="space-y-6">
              {result.jobs.map((job, index) => {
                // Handle dynamic job data from API
                const title = job.title || job.position || `Job ${index + 1}`;
                const matchPercent = job.match_percent || job.match_score || job.score || 0;
                const skillsMatched = job.skills_matched || job.matched_skills || [];
                const skillsToLearn = job.skills_to_learn || job.required_skills || [];
                const salaryRange = job.salary_range_usd || job.salary || job.compensation || 'Not specified';
                const growthOutlook = job.growth_outlook || job.outlook || 'moderate';

                return (
                  <div key={index} className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                            {title.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white">{title}</h4>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-300">Growth Outlook:</span>
                                <span className="font-semibold text-white">
                                  {getGrowthIcon(growthOutlook)} {growthOutlook}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getMatchColor(matchPercent)}`}>
                          <div className="text-2xl font-bold text-white">{matchPercent}%</div>
                          <div className="text-xs text-white/80">Match Score</div>
                        </div>
                      </div>
                    </div>

                    {/* Salary */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span className="font-semibold text-white">Salary Range:</span>
                        <span className="text-yellow-300 font-bold">{salaryRange}</span>
                      </div>
                    </div>

                    {/* Skills Matched */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="font-semibold text-white">Your Skills Matched:</span>
                        <span className="text-green-400 text-sm">
                          {skillsMatched.length} of {skillsMatched.length + skillsToLearn.length} skills
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skillsMatched.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-3 py-2 bg-green-500/20 text-green-300 border border-green-500/30 rounded-xl text-sm"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Skills to Learn */}
                    {skillsToLearn.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="font-semibold text-white">Skills to Learn:</span>
                          <span className="text-blue-400 text-sm">
                            {skillsToLearn.length} recommended skills
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skillsToLearn.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-3 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl text-sm"
                            >
                              + {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Apply Button */}
                    <div className="mt-6 pt-6 border-t border-gray-600/50">
                      <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all hover:scale-105">
                        View Job Details & Apply
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Statistics */}
            <div className="mt-8 pt-8 border-t border-gray-600/50">
              <h4 className="text-xl font-bold text-white mb-6">Recommendation Summary</h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-700/30 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-white mb-2">
                    {result.jobs.length}
                  </div>
                  <div className="text-gray-300">Total Jobs Found</div>
                </div>
                
                <div className="bg-gray-700/30 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-white mb-2">
                    {Math.round(result.jobs.reduce((sum, job) => {
                      const match = job.match_percent || job.match_score || job.score || 0;
                      return sum + match;
                    }, 0) / result.jobs.length)}%
                  </div>
                  <div className="text-gray-300">Average Match Score</div>
                </div>
                
                <div className="bg-gray-700/30 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-white mb-2">
                    {Math.round(result.jobs.reduce((sum, job) => {
                      const salaryStr = job.salary_range_usd || job.salary || '0-0';
                      const nums = salaryStr.match(/\d+/g) || [0, 0];
                      const avg = (parseInt(nums[0] || 0) + parseInt(nums[1] || 0)) / 2;
                      return sum + avg;
                    }, 0) / result.jobs.length).toLocaleString()}
                  </div>
                  <div className="text-gray-300">Avg Salary (USD)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobRecommendation;