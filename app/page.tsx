"use client"
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { Target, Trophy, TrendingUp, Zap, Clock, CheckCircle, FileText, GraduationCap, Briefcase, BarChart, Building, MapPin, DollarSign, BriefcaseIcon, Sparkles, Brain, TrendingUp as TrendingUpIcon, AlertTriangle, Shield, Database, Cpu } from 'lucide-react';
import { useEffect, useState, useMemo } from "react";

export default function Page() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [industryTrends, setIndustryTrends] = useState(null);
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isLoaded && isSignedIn && pathname === "/sign-in") {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, pathname, router]);

  // Fetch dashboard data from FastAPI
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const username = user.username || user.firstName || "user";
        const email = user.primaryEmailAddress?.emailAddress || "";
        
        // Fetch user stats
        const statsResponse = await fetch('http://localhost:8000/dashboard-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            email: email
          }),
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setUserData(statsData);
        } else {
          // Fallback if API fails
          setUserData({
            stats: {
              skillsAssessed: 0,
              achievements: 0,
              profileScore: 0,
              streakDays: 0,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setUserData({
          stats: {
            skillsAssessed: 0,
            achievements: 0,
            profileScore: 0,
            streakDays: 0,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isLoaded, isSignedIn, user]);

  // Fetch job recommendations from FastAPI
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const fetchJobRecommendations = async () => {
      setLoadingJobs(true);
      try {
        const username = user.username || user.firstName || "user";
        
        const response = await fetch('http://localhost:8000/job-recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            user_id: user.id
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setJobRecommendations(data.jobs || data.recommendations || []);
        } else {
          // Fallback mock data
          setJobRecommendations([]);
        }
      } catch (error) {
        console.error("Error fetching job recommendations:", error);
        setJobRecommendations([]);
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobRecommendations();
  }, [isLoaded, isSignedIn, user]);

  // Fetch industry trends from FastAPI
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const fetchIndustryTrends = async () => {
      setLoadingTrends(true);
      try {
        const response = await fetch('http://localhost:8000/jobs/market/summary');
        
        if (response.ok) {
          const data = await response.json();
          setIndustryTrends(data);
        } else {
          // Fallback mock trends
          setIndustryTrends({
            fastest_growing: [
              {"role": "AI/ML Engineer", "growth": "55%+", "demand": "very_high"},
              {"role": "DevOps Engineer", "growth": "45%+", "demand": "high"},
              {"role": "Cloud Architect", "growth": "40%+", "demand": "high"}
            ],
            declining: [
              {"role": "Data Entry Clerk", "decline": "-30%", "automation_risk": "very_high"},
              {"role": "Manual Tester", "decline": "-25%", "automation_risk": "high"}
            ],
            hot_skills: ["AI/ML", "Cloud Computing", "Cybersecurity", "DevOps"],
            outdated_skills: ["Flash", "COBOL", "Perl"]
          });
        }
      } catch (error) {
        console.error("Error fetching industry trends:", error);
        setIndustryTrends({
          fastest_growing: [
            {"role": "AI/ML Engineer", "growth": "55%+", "demand": "very_high"},
            {"role": "DevOps Engineer", "growth": "45%+", "demand": "high"}
          ],
          declining: [
            {"role": "Data Entry Clerk", "decline": "-30%", "automation_risk": "very_high"}
          ],
          hot_skills: ["AI/ML", "Cloud Computing", "Cybersecurity"],
          outdated_skills: ["Flash", "COBOL"]
        });
      } finally {
        setLoadingTrends(false);
      }
    };

    fetchIndustryTrends();
  }, [isLoaded, isSignedIn]);

  // Stats memoized properly
  const stats = useMemo(() => {
    if (!userData) return [];
    
    return [
      {
        icon: <Brain className="w-6 h-6" />,
        value: userData.stats?.skillsAssessed?.toString() || "0",
        label: "Quiz Completed",
        color: "from-purple-500 to-indigo-500",
        bgColor: 'bg-purple-500/20'
      },
      {
        icon: <Trophy className="w-6 h-6" />,
        value: userData.stats?.achievements?.toString() || "0",
        label: "Achievements",
        subtext: userData.stats?.newBadge ? "New badge earned!" : "Keep going!",
        color: "from-cyan-500 to-teal-500",
        bgColor: 'bg-cyan-500/20'
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        value: `${userData.stats?.profileScore || 0}%`,
        label: "Profile Score",
        color: "from-orange-500 to-pink-500",
        bgColor: 'bg-orange-500/20',
        progress: userData.stats?.profileScore || 0
      },
      {
        icon: <Zap className="w-6 h-6" />,
        value: userData.stats?.streakDays?.toString() || "0",
        label: "Streak Days",
        subtext: "Keep it up!",
        color: "from-yellow-500 to-orange-500",
        bgColor: 'bg-yellow-500/20'
      }
    ];
  }, [userData]);

  // REMOVED: Resume Builder from quick actions
  const quickActions = useMemo(() => [
    { icon: <Brain className="w-6 h-6" />, label: "Quiz", color: "from-purple-500 to-indigo-500", link: "/assess" },
    { icon: <TrendingUp className="w-6 h-6" />, label: "Career Plan", color: "from-cyan-500 to-teal-500", link: "/plan" },
    { icon: <Briefcase className="w-6 h-6" />, label: "Mock Interview", color: "from-yellow-500 to-orange-500", link: "/interview" },
    { icon: <Sparkles className="w-6 h-6" />, label: "Resume Analyser", color: "from-pink-500 to-rose-500", link: "/resume-analyser" }
  ], []);

  const getTrendIcon = (role) => {
    if (role.toLowerCase().includes('ai') || role.toLowerCase().includes('ml')) {
      return <Cpu className="w-4 h-4 text-purple-400" />;
    } else if (role.toLowerCase().includes('cloud')) {
      return <Database className="w-4 h-4 text-blue-400" />;
    } else if (role.toLowerCase().includes('security') || role.toLowerCase().includes('cyber')) {
      return <Shield className="w-4 h-4 text-green-400" />;
    } else if (role.toLowerCase().includes('devops')) {
      return <TrendingUpIcon className="w-4 h-4 text-orange-400" />;
    }
    return <BriefcaseIcon className="w-4 h-4 text-gray-400" />;
  };

  // Loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-2xl font-bold text-white">Loading your dashboard...</div>
          <p className="text-gray-400 mt-2">Preparing your career insights</p>
        </div>
      </div>
    );
  }

  // Get user info from Clerk
  const username = user?.username || user?.firstName || "User";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const avatarUrl = user?.imageUrl || "";
  const userInitials = username.substring(0, 2).toUpperCase();

  // ArrowRight component for the quick actions
  const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="rounded-3xl p-6 sm:p-8 mb-8 bg-gradient-to-r from-purple-900/80 to-pink-900/80 backdrop-blur-sm border border-purple-500/20 shadow-2xl shadow-purple-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Welcome back, {username}! 👋
              </h1>
              <p className="text-purple-100 text-lg">
                Your personalized career journey starts here
              </p>
            </div>
            <div className="flex items-center gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={username}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                  {userInitials}
                </div>
              )}
              <div>
                <div className="text-white font-semibold text-sm sm:text-base">{username}</div>
                <div className="text-purple-100 text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px]">{email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="rounded-2xl p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className={`inline-flex p-3 rounded-xl mb-4 bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">{stat.icon}</div>
              </div>
              <div className="text-3xl sm:text-4xl font-bold mb-2 text-white">
                {stat.value}
              </div>
              <div className="text-sm font-semibold mb-1 text-white">
                {stat.label}
              </div>
              {stat.subtext && (
                <div className="text-xs text-gray-300">
                  {stat.subtext}
                </div>
              )}
              {stat.progress !== undefined && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{stat.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-700">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-500 group-hover:shadow-lg group-hover:shadow-purple-500/20`}
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions & Resume Analyser */}
          <div className="lg:col-span-2">
            {/* Quick Actions - Updated to 4 items */}
            <div className="rounded-2xl p-6 mb-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(action.link)}
                    className="group relative p-5 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 from-purple-500 to-pink-500" />
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${action.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">{action.icon}</div>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {action.label}
                    </div>
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Resume Analyser Section */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Resume Analyser</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 mb-4">
                  Upload your resume to get AI-powered feedback on how to improve it and increase your chances of landing interviews.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-green-500/20">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="font-semibold text-white">ATS Score</span>
                    </div>
                    <p className="text-sm text-gray-300">Check how well your resume passes through automated systems</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="font-semibold text-white">Keyword Analysis</span>
                    </div>
                    <p className="text-sm text-gray-300">Identify missing keywords for specific job roles</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="font-semibold text-white">Improvement Tips</span>
                    </div>
                    <p className="text-sm text-gray-300">Get personalized suggestions to enhance your resume</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/resume-analyser")}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  Analyse Your Resume Now
                </button>
              </div>
            </div>
          </div>

          {/* Job Recommendations & Industry Trends */}
          <div className="space-y-8">
            {/* Job Recommendations */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                    <BriefcaseIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Job Recommendations</h2>
                </div>
                <button 
                  onClick={() => window.location.href = 'https://www.naukri.com/nlogin/login?utm_source=google&utm_medium=cpc&utm_campaign=Brand&gclsrc=aw.ds&gad_source=1&gad_campaignid=19863995494&gbraid=0AAAAADLp3cElkHpBjGSFx5581b-gJasJ3&gclid=CjwKCAiA1obMBhAbEiwAsUBbIk4p8XYVz6SySynViA-HwUOFfB7HOe472ktY9zN27miMHYJvhnAZPhoCx-4QAvD_BwE'}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View all →
                </button>
              </div>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {loadingJobs ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-400">Loading job recommendations...</p>
                  </div>
                ) : jobRecommendations.length > 0 ? (
                  jobRecommendations.map((job, index) => (
                    <div 
                      key={job.id || index}
                      className="p-4 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-[1.02] group cursor-pointer"
                      onClick={() => router.push(`/job/${job.id || index}`)}
                    >
                      <div className="mb-3">
                        <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors">
                          {job.title || `Job ${index + 1}`}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                          <Building className="w-4 h-4" />
                          <span>{job.company || "Company"}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{job.location || "Location not specified"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{job.salary || "Salary not specified"}</span>
                        </div>
                      </div>
                      
                      {job.skills && job.skills.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs text-gray-400 mb-2">Required Skills:</div>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.slice(0, 3).map((skill, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 text-xs rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 3 && (
                              <span className="px-2 py-1 text-xs rounded-lg bg-gray-700/50 text-gray-400 border border-gray-600/50">
                                +{job.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span className="px-2 py-1 rounded bg-gray-700/50">{job.type || "Full-time"}</span>
                        <span>Posted {job.posted || "Recently"}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BriefcaseIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">No job recommendations yet</p>
                    <p className="text-sm text-gray-500">Complete your profile to get personalized job matches</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => router.push("/jobs")}
                className="w-full mt-6 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <BriefcaseIcon className="w-5 h-5" />
                Browse All Jobs
              </button>
            </div>

            {/* Industry Trends */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
                    <TrendingUpIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Industry Trends</h2>
                </div>
                <span className="text-xs text-purple-300">Live Data</span>
              </div>
              
              {loadingTrends ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-400">Loading industry trends...</p>
                </div>
              ) : industryTrends ? (
                <div className="space-y-6">
                  {/* Fastest Growing Roles */}
                  <div>
                    <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                      <TrendingUpIcon className="w-5 h-5 text-green-400" />
                      Fastest Growing Roles
                    </h3>
                    <div className="space-y-3">
                      {industryTrends.fastest_growing?.slice(0, 3).map((role, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
                          <div className="flex items-center gap-3">
                            {getTrendIcon(role.role)}
                            <div>
                              <div className="text-sm font-medium text-white">{role.role}</div>
                              <div className="text-xs text-gray-400">{role.demand}</div>
                            </div>
                          </div>
                          <div className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-lg font-bold">
                            {role.growth}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Declining Roles */}
                  {industryTrends.declining && industryTrends.declining.length > 0 && (
                    <div>
                      <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Declining Roles
                      </h3>
                      <div className="space-y-3">
                        {industryTrends.declining.slice(0, 2).map((role, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
                            <div>
                              <div className="text-sm font-medium text-white">{role.role}</div>
                              <div className="text-xs text-gray-400">Automation risk: {role.automation_risk}</div>
                            </div>
                            <div className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-lg font-bold">
                              {role.decline}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hot Skills */}
                  {industryTrends.hot_skills && (
                    <div>
                      <h3 className="font-bold text-white mb-3">🔥 Hot Skills in Demand</h3>
                      <div className="flex flex-wrap gap-2">
                        {industryTrends.hot_skills.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUpIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No trend data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}