"use client"
import React, { useState } from 'react';

function SkillQuiz() {
  const [skill, setSkill] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const FAST_API_URL = 'http://localhost:8000/generate-quiz';

  const postToFastAPI = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setUserAnswers({});
    setSubmitted(false);

    const payload = {
      skill: skill,
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

  const handleAnswerSelect = (questionIndex, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
  };

  const calculateScore = () => {
    if (!result || !result.questions) return 0;
    
    let correct = 0;
    result.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct) {
        correct++;
      }
    });
    
    return Math.round((correct / result.questions.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Skill Assessment Quiz</h1>
        
        {/* Quiz Configuration Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-white mb-3">Skill:</label>
              <input
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="e.g., Python, JavaScript, React"
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
                <option value={15}>15 Questions</option>
              </select>
            </div>
          </div>

          <button
            onClick={postToFastAPI}
            disabled={loading || !skill.trim()}
            className={`px-8 py-4 rounded-xl font-semibold transition-all ${
              loading || !skill.trim()
                ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-105'
            }`}
          >
            {loading ? 'Generating Quiz...' : 'Generate Quiz'}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8">
            <p className="text-red-300">Error: {error}</p>
          </div>
        )}

        {/* Quiz Questions Display - Dynamic from API */}
        {result && result.status === "ok" && result.questions && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white">Quiz: {result.skill}</h3>
                <p className="text-gray-300 mt-2">{result.questions.length} Questions</p>
              </div>
              
              {submitted && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 rounded-xl">
                  <div className="text-2xl font-bold text-white">Score: {calculateScore()}%</div>
                </div>
              )}
            </div>

            <div className="space-y-8">
              {result.questions.map((question, index) => {
                // Handle dynamic question structure from API
                const questionText = question.question || question.text || `Question ${index + 1}`;
                const options = question.options || question.choices || [];
                const correctAnswer = question.correct || question.answer || '';
                const explanation = question.explanation || question.reason || '';
                
                return (
                  <div key={index} className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="text-lg font-semibold text-white flex-1">{questionText}</div>
                    </div>

                    <div className="space-y-3">
                      {options.map((option, optIndex) => {
                        // Extract option letter/number from the beginning of the string
                        const optionMatch = option.match(/^([A-D1-4][).]?)\s*(.*)/);
                        let optionLetter = '';
                        let optionText = option;
                        
                        if (optionMatch) {
                          optionLetter = optionMatch[1].replace(/[).]/g, ''); // Clean up: "A)", "B.", "1)" -> "A", "B", "1"
                          optionText = optionMatch[2];
                        } else {
                          // If no letter/number prefix, use index
                          optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D
                        }
                        
                        const isSelected = userAnswers[index] === optionLetter;
                        const isCorrect = optionLetter === correctAnswer;
                        const isWrong = submitted && isSelected && !isCorrect;
                        
                        return (
                          <div
                            key={optIndex}
                            onClick={() => !submitted && handleAnswerSelect(index, optionLetter)}
                            className={`p-4 rounded-xl cursor-pointer transition-all ${
                              !submitted
                                ? isSelected
                                  ? 'bg-purple-500/30 border border-purple-500/50'
                                  : 'bg-gray-700/50 border border-gray-600/50 hover:bg-gray-600/50'
                                : isCorrect
                                  ? 'bg-green-500/20 border border-green-500/30'
                                  : isWrong
                                    ? 'bg-red-500/20 border border-red-500/30'
                                    : 'bg-gray-700/50 border border-gray-600/50'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                !submitted
                                  ? isSelected
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-gray-600 text-gray-300'
                                  : isCorrect
                                    ? 'bg-green-500 text-white'
                                    : isWrong
                                      ? 'bg-red-500 text-white'
                                      : 'bg-gray-600 text-gray-300'
                              }`}>
                                {optionLetter}
                              </div>
                              <span className={`font-medium ${
                                !submitted
                                  ? isSelected ? 'text-purple-200' : 'text-gray-300'
                                  : isCorrect ? 'text-green-300' : isWrong ? 'text-red-300' : 'text-gray-400'
                              }`}>
                                {option}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {submitted && explanation && (
                      <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="font-semibold text-blue-300">Explanation:</span>
                        </div>
                        <p className="text-gray-300">{explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!submitted && result.questions.length > 0 && (
              <div className="mt-8">
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length !== result.questions.length}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                    Object.keys(userAnswers).length !== result.questions.length
                      ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:scale-105'
                  }`}
                >
                  Submit Quiz
                </button>
                <p className="text-gray-400 mt-4">
                  Answered: {Object.keys(userAnswers).length} of {result.questions.length} questions
                </p>
              </div>
            )}

            {submitted && (
              <div className="mt-8">
                <button
                  onClick={() => {
                    setResult(null);
                    setUserAnswers({});
                    setSubmitted(false);
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all hover:scale-105"
                >
                  Take Another Quiz
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillQuiz;