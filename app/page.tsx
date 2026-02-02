"use client"
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Target, Trophy, TrendingUp, Zap, Clock, CheckCircle, FileText, GraduationCap, Briefcase, BarChart } from 'lucide-react';
import { useEffect, useState, useMemo } from "react";

export default function Page() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  // Local state
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Extract and console log Clerk user data
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const clerkUserData = {
        username: user.username,
        email: user.primaryEmailAddress?.emailAddress,//will be given to the server
        avatarUrl: user.imageUrl,
      };
      
      console.log("=== CLERK USER DATA ===");
      console.log("Username:", clerkUserData.username);
      console.log("Email:", clerkUserData.email);
      console.log("Avatar URL:", clerkUserData.avatarUrl);
      console.log("Full Clerk User Object:", clerkUserData);
      console.log("======================");
    }
  }, [isLoaded, isSignedIn, user]);

  // Set stats to 0 to preview UI
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    // Mock data with all zeros to preview UI
    const mockData = {
      stats: {
        skillsAssessed: 0,
        achievements: 0,
        profileScore: 0,
        streakDays: 0,
      },
      recentActivity: [],
    };
    
    console.log("Using mock data with 0 values:", mockData);
    setUserData(mockData);
    
  }, [isLoaded, isSignedIn]);

  // Theme classes
  const isDark = theme === "dark";
  const themeClasses = useMemo(
    () => ({
      bg: isDark ? "bg-gray-900" : "bg-gray-50",
      text: isDark ? "text-white" : "text-gray-900",
      subtext: isDark ? "text-gray-300" : "text-gray-600",
      card: isDark
        ? "bg-gray-800/50 border-gray-700/50"
        : "bg-white border-gray-200 shadow-lg",
      accent: isDark ? "text-cyan-400" : "text-purple-600",
    }),
    [isDark]
  );

  // Stats memoized properly
  const stats = useMemo(() => {
    if (!userData) return [];
    
    return [
      {
        icon: <Target className="w-6 h-6" />,
        value: userData.stats.skillsAssessed.toString(),
        label: "Skills Assessed",
        color: "from-purple-500 to-indigo-500",
        bgColor: isDark ? 'bg-purple-500/20' : 'bg-purple-100'
      },
      {
        icon: <Trophy className="w-6 h-6" />,
        value: userData.stats.achievements.toString(),
        label: "Achievements",
        subtext: userData.stats.newBadge ? "New badge earned!" : "Keep going!",
        color: "from-cyan-500 to-teal-500",
        bgColor: isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        value: `${userData.stats.profileScore}%`,
        label: "Profile Score",
        color: "from-orange-500 to-pink-500",
        bgColor: isDark ? 'bg-orange-500/20' : 'bg-orange-100',
        progress: userData.stats.profileScore
      },
      {
        icon: <Zap className="w-6 h-6" />,
        value: userData.stats.streakDays.toString(),
        label: "Streak Days",
        subtext: "Keep it up!",
        color: "from-yellow-500 to-orange-500",
        bgColor: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'
      }
    ];
  }, [userData, isDark]);

  const quickActions = useMemo(() => [
    { icon: <Target className="w-6 h-6" />, label: "Assess Skills", color: "from-purple-500 to-indigo-500", link: "/assess" },
    { icon: <TrendingUp className="w-6 h-6" />, label: "Career Plan", color: "from-cyan-500 to-teal-500", link: "/plan" },
    { icon: <FileText className="w-6 h-6" />, label: "Upload Resume", color: "from-orange-500 to-pink-500", link: "/resume" },
    { icon: <Briefcase className="w-6 h-6" />, label: "Mock Interview", color: "from-yellow-500 to-orange-500", link: "/interview" }
  ], []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'resume':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'course':
        return <GraduationCap className="w-6 h-6 text-blue-500" />;
      case 'achievement':
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'profile':
        return <BarChart className="w-6 h-6 text-purple-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  // Loading state
  if (!isLoaded || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${themeClasses.bg}`}>
        <div className={`text-2xl font-bold ${themeClasses.text}`}>Loading...</div>
      </div>
    );
  }

  // Error state
  if (!userData) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${themeClasses.bg}`}>
        <div className={`text-2xl font-bold ${themeClasses.text}`}>Error loading data</div>
      </div>
    );
  }

  // Get user info from Clerk
  const username = user?.username || user?.firstName || "User";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const avatarUrl = user?.imageUrl || "";
  const userInitials = username.substring(0, 2).toUpperCase();

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

      <div className="relative max-w-7xl mt-10 mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className={`rounded-3xl p-8 mb-8 bg-gradient-to-r from-purple-600 to-pink-600 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {username}! 👋
              </h1>
              <p className="text-purple-100 text-lg">
                Ready to advance your career today?
              </p>
            </div>
            <div className={`hidden md:flex items-center gap-4 px-6 py-4 rounded-2xl ${isDark ? 'bg-white/10 backdrop-blur-sm' : 'bg-white/20 backdrop-blur-sm'}`}>
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-purple-600 font-bold text-xl">
                  {userInitials}
                </div>
              )}
              <div>
                <div className="text-white font-semibold">{username}</div>
                <div className="text-purple-100 text-sm">{email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`rounded-2xl border p-6 ${themeClasses.card}`}>
              <div className={`inline-flex p-3 rounded-xl mb-4 bg-gradient-to-br ${stat.color}`}>
                <div className="text-white">{stat.icon}</div>
              </div>
              <div className={`text-4xl font-bold mb-2 ${themeClasses.text}`}>
                {stat.value}
              </div>
              <div className={`text-sm font-semibold mb-1 ${themeClasses.text}`}>
                {stat.label}
              </div>
              <div className={`text-xs ${themeClasses.subtext}`}>
                {stat.subtext}
              </div>
              {stat.progress !== undefined && (
                <div className={`mt-4 h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className={`rounded-2xl border p-6 ${themeClasses.card}`}>
            <div className="flex items-center gap-2 mb-6">
              <Zap className={`w-6 h-6 ${themeClasses.accent}`} />
              <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => router.push(action.link)}
                  className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    isDark ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${action.color} mb-3`}>
                    <div className="text-white">{action.icon}</div>
                  </div>
                  <div className={`text-sm font-semibold ${themeClasses.text}`}>
                    {action.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`rounded-2xl border p-6 ${themeClasses.card}`}>
            <div className="flex items-center gap-2 mb-6">
              <Clock className={`w-6 h-6 ${themeClasses.accent}`} />
              <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {userData.recentActivity && userData.recentActivity.length > 0 ? (
                userData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${themeClasses.text}`}>
                        {activity.title}
                      </div>
                      <div className={`text-xs ${themeClasses.subtext}`}>
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-center py-8 ${themeClasses.subtext}`}>
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}