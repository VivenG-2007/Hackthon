"use client"
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { Trophy, TrendingUp, Zap, Sparkles, Brain, Briefcase } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import Image from "next/image";

// ============================================================================
// PERFORMANCE OPTIMIZATIONS
// ============================================================================

// Memoized SVG component to prevent re-renders
const ArrowRight = memo(({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
));
ArrowRight.displayName = 'ArrowRight';

// Memoized stat card component
const StatCard = memo(({ stat, index }: { stat: any; index: number }) => (
  <div 
    className="rounded-2xl p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 transform transition-transform duration-300 hover:scale-105"
    role="article"
    aria-label={`${stat.label}: ${stat.value}`}
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
            className={`h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
            style={{ width: `${stat.progress}%` }}
            role="progressbar"
            aria-valuenow={stat.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    )}
  </div>
));
StatCard.displayName = 'StatCard';

// Memoized quick action button
const QuickActionButton = memo(({ action, onClick }: { action: any; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="group relative p-5 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-105 overflow-hidden"
    aria-label={`Go to ${action.label}`}
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
));
QuickActionButton.displayName = 'QuickActionButton';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Page() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Memoized user data
  const username = useMemo(() => user?.username || user?.firstName || "User", [user]);
  const email = useMemo(() => user?.primaryEmailAddress?.emailAddress || "", [user]);
  const avatarUrl = useMemo(() => user?.imageUrl || "", [user]);
  const userInitials = useMemo(() => username.substring(0, 2).toUpperCase(), [username]);

  // Fetch dashboard data with error handling and AbortController
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const controller = new AbortController();
    
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const statsResponse = await fetch('http://localhost:8000/dashboard-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email }),
          signal: controller.signal,
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
      } catch (error: any) {
        if (error.name === 'AbortError') return;
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

    return () => controller.abort();
  }, [isLoaded, isSignedIn, user, username, email]);

  // Authentication redirects
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

  // Stats memoization with proper typing
  const stats = useMemo(() => {
    const defaultStats = [
      { icon: <Brain className="w-6 h-6" />, value: "0", label: "Quiz Completed", color: "from-purple-500 to-indigo-500", bgColor: 'bg-purple-500/20' },
      { icon: <Trophy className="w-6 h-6" />, value: "0", label: "Achievements", color: "from-cyan-500 to-teal-500", bgColor: 'bg-cyan-500/20' },
      { icon: <TrendingUp className="w-6 h-6" />, value: "0%", label: "Profile Score", color: "from-orange-500 to-pink-500", bgColor: 'bg-orange-500/20', progress: 0 },
      { icon: <Zap className="w-6 h-6" />, value: "0", label: "Streak Days", color: "from-yellow-500 to-orange-500", bgColor: 'bg-yellow-500/20' }
    ];

    if (!userData) return defaultStats;
    
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

  // Quick actions with useCallback for stable references
  const quickActions = useMemo(() => [
    { icon: <Brain className="w-6 h-6" />, label: "Quiz", color: "from-purple-500 to-indigo-500", link: "/assess" },
    { icon: <TrendingUp className="w-6 h-6" />, label: "Job Opportunities", color: "from-cyan-500 to-teal-500", link: "/plan" },
    { icon: <Briefcase className="w-6 h-6" />, label: "Mock Interview", color: "from-yellow-500 to-orange-500", link: "/interview" },
    { icon: <Sparkles className="w-6 h-6" />, label: "Resume Analyser", color: "from-pink-500 to-rose-500", link: "/resume-analyser" }
  ], []);

  // Memoized navigation handlers
  const handleQuickActionClick = useCallback((link: string) => {
    router.push(link);
  }, [router]);

  const handleResumeAnalyserClick = useCallback(() => {
    router.push("/resume-analyser");
  }, [router]);

  const handleJobOpportunitiesClick = useCallback(() => {
    window.location.href = 'https://www.naukri.com/nlogin/login?utm_source=google&utm_medium=cpc&utm_campaign=Brand&gclsrc=aw.ds&gad_source=1&gad_campaignid=19863995494&gbraid=0AAAAADLp3cHQfND7JICwSWl7ABrZEFpKS&gclid=CjwKCAiA1obMBhAbEiwAsUBbImgMOIAkykiuV2OkABrwfUqdzb4yUI8Jkj-ZBPA3kZs2MsUFmEgKiRoCHtEQAvD_BwE';
  }, []);

  // Loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" role="status" aria-label="Loading"></div>
          <h1 className="text-2xl font-bold text-white">Loading your dashboard...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-8">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <header className="rounded-3xl p-6 sm:p-8 mb-8 bg-gradient-to-r from-purple-900/80 to-pink-900/80 backdrop-blur-sm border border-purple-500/20 shadow-2xl shadow-purple-500/10">
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
                <Image 
                  src={avatarUrl} 
                  alt={`${username}'s profile picture`}
                  width={48}
                  height={48}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/20"
                  priority
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl" aria-label={`${username}'s initials`}>
                  {userInitials}
                </div>
              )}
              <div>
                <div className="text-white font-semibold text-sm sm:text-base">{username}</div>
                <div className="text-purple-100 text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px]">{email}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8" aria-label="Dashboard statistics">
          {stats.map((stat, index) => (
            <StatCard key={`${stat.label}-${index}`} stat={stat} index={index} />
          ))}
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions & Resume Analyser */}
          <div className="lg:col-span-2">
            {/* Quick Actions */}
            <section className="rounded-2xl p-6 mb-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50" aria-labelledby="quick-actions-heading">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500" aria-hidden="true">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h2 id="quick-actions-heading" className="text-2xl font-bold text-white">Quick Actions</h2>
              </div>
              <nav className="grid grid-cols-2 md:grid-cols-4 gap-4" aria-label="Quick actions navigation">
                {quickActions.map((action, index) => (
                  <QuickActionButton 
                    key={`${action.label}-${index}`} 
                    action={action} 
                    onClick={() => handleQuickActionClick(action.link)} 
                  />
                ))}
              </nav>
            </section>

            {/* Resume Analyser Section */}
            <section className="rounded-2xl p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50" aria-labelledby="resume-analyser-heading">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500" aria-hidden="true">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 id="resume-analyser-heading" className="text-2xl font-bold text-white">Resume Analyser</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 mb-4">
                  Upload your resume to get AI-powered feedback on how to improve it and increase your chances of landing interviews.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <article className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-green-500/20" aria-hidden="true">
                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="font-semibold text-white">ATS Score</span>
                    </div>
                    <p className="text-sm text-gray-300">Check how well your resume passes through automated systems</p>
                  </article>
                  <article className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-blue-500/20" aria-hidden="true">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="font-semibold text-white">Keyword Analysis</span>
                    </div>
                    <p className="text-sm text-gray-300">Identify missing keywords for specific job roles</p>
                  </article>
                  <article className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-purple-500/20" aria-hidden="true">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="font-semibold text-white">Improvement Tips</span>
                    </div>
                    <p className="text-sm text-gray-300">Get personalized suggestions to enhance your resume</p>
                  </article>
                </div>
                <button
                  onClick={handleResumeAnalyserClick}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3"
                  aria-label="Analyse your resume now"
                >
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  Analyse Your Resume Now
                </button>
              </div>
            </section>
          </div>

          {/* Job Recommendations Box */}
          <aside className="rounded-2xl p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50" aria-labelledby="job-opportunities-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500" aria-hidden="true">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h2 id="job-opportunities-heading" className="text-2xl font-bold text-white">Job Opportunities</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-300 mb-6">
                Discover personalized job recommendations based on your skills and career goals. Get matched with opportunities that fit your profile.
              </p>
              
              <div className="space-y-4">
                {/* Feature 1 */}
                <article className="flex items-start gap-3 p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="p-2 rounded-lg bg-green-500/20" aria-hidden="true">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Smart Matching</h3>
                    <p className="text-sm text-gray-300">Get job recommendations based on your skills and experience</p>
                  </div>
                </article>

                {/* Feature 2 */}
                <article className="flex items-start gap-3 p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="p-2 rounded-lg bg-blue-500/20" aria-hidden="true">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Fast Apply</h3>
                    <p className="text-sm text-gray-300">Apply to multiple jobs quickly with your optimized resume</p>
                  </div>
                </article>

                {/* Feature 3 */}
                <article className="flex items-start gap-3 p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="p-2 rounded-lg bg-purple-500/20" aria-hidden="true">
                    <TrendingUp className="w-5 h-5 text-purple-400" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Growth Opportunities</h3>
                    <p className="text-sm text-gray-300">Find roles that match your career growth trajectory</p>
                  </div>
                </article>
              </div>

              <button
                onClick={handleJobOpportunitiesClick}
                className="w-full mt-6 py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3"
                aria-label="Explore more job opportunities"
              >
                <Briefcase className="w-5 h-5" aria-hidden="true" />
                Explore More Job Opportunities
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}