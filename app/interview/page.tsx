"use client"
import React, { useState } from 'react';

function MockInterview() {
  const [domain, setDomain] = useState('');
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  const FAST_API_URL = 'http://localhost:8000/generate-interview';

  const postToFastAPI = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setUserAnswers({});
    setInterviewStarted(false);
    setInterviewCompleted(false);
    setCurrentQuestionIndex(0);

    const payload = {
      domain: domain,
      role: role,
      difficulty: difficulty,
      num_questions: numQuestions
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

  const startInterview = () => {
    setInterviewStarted(true);
    setCurrentQuestionIndex(0);
  };

  const handleAnswerChange = (answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < result.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setInterviewCompleted(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'technical': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'behavioral': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'system design': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Mock Interview Practice</h1>
        
        {/* Interview Configuration Form */}
        {!result && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-white mb-3">Domain:</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g., backend, frontend, data science, devops"
                  className="w-full p-4 bg-gray-700/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white mb-3">Target Role:</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Python Developer, React Developer, Data Engineer"
                  className="w-full p-4 bg-gray-700/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white mb-3">Difficulty:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-4 bg-gray-700/50 border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-3">Number of Questions:</label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  className="w-full p-4 bg-gray-700/50 border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
              </div>
            </div>

            <button
              onClick={postToFastAPI}
              disabled={loading || !domain.trim() || !role.trim()}
              className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                loading || !domain.trim() || !role.trim()
                  ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-105'
              }`}
            >
              {loading ? 'Generating Interview...' : 'Generate Interview Questions'}
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8">
            <p className="text-red-300">Error: {error}</p>
          </div>
        )}

        {/* Interview Questions Display */}
        {result && result.status === "ok" && result.questions && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-8">
            {/* Interview Header */}
            {!interviewStarted && !interviewCompleted && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">Interview Setup Complete</h3>
                  <div className="text-gray-300">
                    Interview ID: <span className="font-mono">{result.interview_id || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="bg-gray-700/30 p-6 rounded-xl mb-6">
                  <h4 className="text-xl font-bold text-white mb-4">Interview Details</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-300">Domain:</span>
                      <span className="text-white font-semibold ml-2">{domain}</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Role:</span>
                      <span className="text-white font-semibold ml-2">{role}</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Difficulty:</span>
                      <span className={`font-semibold ml-2 ${getDifficultyColor(difficulty)}`}>
                        {difficulty}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-300">Total Questions:</span>
                      <span className="text-white font-semibold ml-2">{result.questions.length}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={startInterview}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all hover:scale-105"
                >
                  Start Mock Interview
                </button>
              </div>
            )}

            {/* Interview in Progress */}
            {interviewStarted && !interviewCompleted && result.questions.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Mock Interview</h3>
                    <p className="text-gray-300 mt-2">
                      Question {currentQuestionIndex + 1} of {result.questions.length}
                    </p>
                  </div>
                  <div className="text-gray-300">
                    <div className="h-2 w-32 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / result.questions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Current Question */}
                {(() => {
                  const question = result.questions[currentQuestionIndex];
                  const questionText = question.text || question.question || `Question ${currentQuestionIndex + 1}`;
                  const questionType = question.type || 'technical';
                  const questionDifficulty = question.difficulty || difficulty;
                  const expectedPoints = question.expected_points || question.key_points || [];
                  
                  return (
                    <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                            {currentQuestionIndex + 1}
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getTypeColor(questionType)}`}>
                              {questionType}
                            </span>
                            <span className={`ml-3 font-semibold ${getDifficultyColor(questionDifficulty)}`}>
                              {questionDifficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-xl font-bold text-white mb-4">{questionText}</h4>
                        
                        {expectedPoints.length > 0 && (
                          <div className="mb-6">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="font-semibold text-white">Expected Points to Cover:</span>
                            </div>
                            <div className="space-y-2">
                              {expectedPoints.map((point, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-300">{point}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Answer Input */}
                      <div className="mb-8">
                        <label className="block text-white mb-3">Your Answer:</label>
                        <textarea
                          value={userAnswers[currentQuestionIndex] || ''}
                          onChange={(e) => handleAnswerChange(e.target.value)}
                          placeholder="Type your answer here... (This is practice, be detailed!)"
                          className="w-full h-48 p-4 bg-gray-700/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors"
                        />
                        <p className="text-gray-400 text-sm mt-2">
                          Character count: {(userAnswers[currentQuestionIndex] || '').length}
                        </p>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex justify-between">
                        <button
                          onClick={prevQuestion}
                          disabled={currentQuestionIndex === 0}
                          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                            currentQuestionIndex === 0
                              ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                              : 'bg-gray-700/50 hover:bg-gray-700 text-white'
                          }`}
                        >
                          Previous Question
                        </button>

                        <button
                          onClick={nextQuestion}
                          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all hover:scale-105"
                        >
                          {currentQuestionIndex === result.questions.length - 1 
                            ? 'Complete Interview' 
                            : 'Next Question'}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Interview Completed */}
            {interviewCompleted && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🎉</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Interview Completed!</h3>
                  <p className="text-gray-300 mb-6">
                    Great job completing the mock interview. Review your answers below.
                  </p>
                </div>

                <div className="space-y-6">
                  {result.questions.map((question, index) => {
                    const questionText = question.text || question.question || `Question ${index + 1}`;
                    const questionType = question.type || 'technical';
                    const expectedPoints = question.expected_points || question.key_points || [];
                    
                    return (
                      <div key={index} className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getTypeColor(questionType)}`}>
                              {questionType}
                            </span>
                          </div>
                        </div>

                        <h4 className="text-lg font-bold text-white mb-3">{questionText}</h4>

                        {expectedPoints.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="font-semibold text-white">Key Points:</span>
                            </div>
                            <div className="space-y-1">
                              {expectedPoints.map((point, pointIndex) => (
                                <div key={pointIndex} className="flex items-start gap-3">
                                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-300">{point}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span className="font-semibold text-white">Your Answer:</span>
                          </div>
                          <div className="bg-gray-800/50 p-4 rounded-xl">
                            <p className="text-gray-300 whitespace-pre-wrap">
                              {userAnswers[index] || 'No answer provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => {
                      setResult(null);
                      setUserAnswers({});
                      setInterviewStarted(false);
                      setInterviewCompleted(false);
                      setCurrentQuestionIndex(0);
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all hover:scale-105"
                  >
                    Practice Another Interview
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MockInterview;