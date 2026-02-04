"use client"
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { Trophy, TrendingUp, Zap, Sparkles, Brain, Briefcase, BriefcaseIcon } from 'lucide-react';
import { useEffect, useState, useMemo } from "react";

export default function Page() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Only fetch dashboard stats
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const username = user.username || user.firstName || "user";
        const email = user.primaryEmailAddress?.emailAddress || "";
        
        const statsResponse = await fetch('http://localhost:8000/dashboard-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email }),
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setUserData(statsData);
        } else {
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

  // Stats memoization
  const stats = useMemo(() => {
    if (!userData) return [
      { icon: <Brain className="w-6 h-6" />, value: "0", label: "Quiz Completed", color: "from-purple-500 to-indigo-500", bgColor: 'bg-purple-500/20' },
      { icon: <Trophy className="w-6 h-6" />, value: "0", label: "Achievements", color: "from-cyan-500 to-teal-500", bgColor: 'bg-cyan-500/20' },
      { icon: <TrendingUp className="w-6 h-6" />, value: "0%", label: "Profile Score", color: "from-orange-500 to-pink-500", bgColor: 'bg-orange-500/20', progress: 0 },
      { icon: <Zap className="w-6 h-6" />, value: "0", label: "Streak Days", color: "from-yellow-500 to-orange-500", bgColor: 'bg-yellow-500/20' }
    ];
    
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
        color: "from-yellow-500 to-orange-500",
        bgColor: 'bg-yellow-500/20'
      }
    ];
  }, [userData]);

  // Quick actions
  const quickActions = useMemo(() => [
    { icon: <Brain className="w-6 h-6" />, label: "Quiz", color: "from-purple-500 to-indigo-500", link: "/assess" },
    { icon: <TrendingUp className="w-6 h-6" />, label: "Job Opportunities", color: "from-cyan-500 to-teal-500", link: "/plan" },
    { icon: <Briefcase className="w-6 h-6" />, label: "Mock Interview", color: "from-yellow-500 to-orange-500", link: "/interview" },
    { icon: <Sparkles className="w-6 h-6" />, label: "Resume Analyser", color: "from-pink-500 to-rose-500", link: "/resume-analyser" }
  ], []);

  // Loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-2xl font-bold text-white">Loading your dashboard...</div>
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
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="rounded-3xl p-6 sm:p-8 mb-8 bg-gradient-to-r from-purple-900/80 to-pink-900/80 backdrop-blur-sm border border-purple-500/20 shadow-2xl shadow-purple-500/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
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
              className="rounded-2xl p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50"
            >
              <div className={`inline-flex p-3 rounded-xl mb-4 bg-gradient-to-br ${stat.color}`}>
                <div className="text-white">{stat.icon}</div>
              </div>
              <div className="text-3xl sm:text-4xl font-bold mb-2 text-white">
                {stat.value}
              </div>
              <div className="text-sm font-semibold mb-1 text-white">
                {stat.label}
              </div>
              {stat.progress !== undefined && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{stat.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-700">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
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
            {/* Quick Actions */}
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
                    className="group p-5 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-105 overflow-hidden"
                  >
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
                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="font-semibold text-white">ATS Score</span>
                    </div>
                    <p className="text-sm text-gray-300">Check how well your resume passes through automated systems</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
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

          {/* Job Recommendations Box */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <BriefcaseIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Job Opportunities</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-300 mb-6">
                Discover personalized job recommendations based on your skills and career goals. Get matched with opportunities that fit your profile.
              </p>
              
              <div className="space-y-4">
                {/* Feature 1 */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Smart Matching</div>
                    <p className="text-sm text-gray-300">Get job recommendations based on your skills and experience</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Fast Apply</div>
                    <p className="text-sm text-gray-300">Apply to multiple jobs quickly with your optimized resume</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Growth Opportunities</div>
                    <p className="text-sm text-gray-300">Find roles that match your career growth trajectory</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>  window.location.href = 'https://www.naukri.com/nlogin/login?utm_source=google&utm_medium=cpc&utm_campaign=Brand&gclsrc=aw.ds&gad_source=1&gad_campaignid=19863995494&gbraid=0AAAAADLp3cHQfND7JICwSWl7ABrZEFpKS&gclid=CjwKCAiA1obMBhAbEiwAsUBbImgMOIAkykiuV2OkABrwfUqdzb4yUI8Jkj-ZBPA3kZs2MsUFmEgKiRoCHtEQAvD_BwE'}
                className="w-full mt-6 py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <BriefcaseIcon className="w-5 h-5" />
                Explore More Job Opportunities
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}