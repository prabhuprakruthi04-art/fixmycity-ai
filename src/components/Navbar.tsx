import React, { useState } from 'react';
import {
  ShieldAlert,
  Camera,
  ListTodo,
  BarChart3,
  Info,
  Sun,
  Moon,
  Home,
  Sparkles,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Bell,
  BellOff,
  Zap,
  Settings,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useReports } from '../context/ReportContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AuthModal } from './AuthModal';
import { ElevenLabsSettingsModal } from './ElevenLabsSettingsModal';

export type NavTab = 'home' | 'report' | 'tracker' | 'dashboard' | 'about';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();
  const { reports, loadDemoMode } = useReports();
  const { user, profile, logOut, toggleNotificationOptIn } = useAuth();
  const { showToast } = useToast();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [voiceSettingsOpen, setVoiceSettingsOpen] = useState(false);

  const activeReportsCount = reports.filter(
    (r) => r.status !== 'Resolved'
  ).length;

  const handleDemoMode = () => {
    loadDemoMode();
    showToast('⚡ Demo Mode active: Loaded 3 pre-made environmental reports with before/after photos!', 'success');
    setActiveTab('tracker');
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogOut = async () => {
    await logOut();
    showToast('Signed out successfully.', 'info');
  };

  const handleToggleNotifications = async () => {
    if (!profile) return;
    const nextState = !profile.notificationsOptIn;
    await toggleNotificationOptIn(nextState);
    if (nextState) {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        Notification.requestPermission();
      }
      showToast('Push notifications enabled for report updates!', 'success');
    } else {
      showToast('Push notifications paused.', 'info');
    }
  };

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'report', label: 'Report Issue', icon: <Camera className="w-4 h-4" /> },
    {
      id: 'tracker',
      label: 'Track Reports',
      icon: <ListTodo className="w-4 h-4" />,
      badge: activeReportsCount,
    },
    { id: 'dashboard', label: 'City Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <ElevenLabsSettingsModal
        isOpen={voiceSettingsOpen}
        onClose={() => setVoiceSettingsOpen(false)}
      />

      {/* Sticky Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-[#0B3D2E]/95 dark:bg-[#06241b]/95 backdrop-blur-md border-b border-emerald-800/40 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Tagline */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6 text-[#0B3D2E]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  FixMyCity
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> AI
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-emerald-200/70 font-medium">
                Autonomous Civic Accountability Engine
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const isReport = item.id === 'report';

              if (isReport) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative ml-1 flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all shadow-md ${
                      isActive
                        ? 'bg-emerald-400 text-[#0B3D2E] ring-2 ring-emerald-300 shadow-emerald-500/30'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-[#0B3D2E] hover:scale-[1.02]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-emerald-100/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-900 ml-1">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Authentication & Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            {/* Instant Demo Mode Button */}
            <button
              onClick={handleDemoMode}
              title="Load 3 pre-made environmental reports with before/after photos for instant demo"
              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 hover:brightness-110 shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-slate-950 shrink-0" />
              <span className="hidden sm:inline">Demo Mode</span>
              <span className="text-[10px] bg-black/20 px-1 py-0.2 rounded font-mono font-bold">3</span>
            </button>
            {/* Authenticated User info OR Sign Up / Log In buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                {/* Push Notification Toggle Icon */}
                <button
                  onClick={handleToggleNotifications}
                  title={
                    profile?.notificationsOptIn
                      ? 'Push notifications are ON (Click to toggle)'
                      : 'Push notifications are OFF (Click to enable)'
                  }
                  className={`p-2 rounded-xl text-xs flex items-center gap-1 border transition-colors cursor-pointer ${
                    profile?.notificationsOptIn
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-white/10 text-slate-400 border-white/10'
                  }`}
                >
                  {profile?.notificationsOptIn ? (
                    <Bell className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </button>

                {/* Profile Pill */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-emerald-100">
                  <div className="w-5 h-5 rounded-full bg-emerald-400 text-[#0B3D2E] font-extrabold flex items-center justify-center text-[10px]">
                    {(profile?.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="font-semibold truncate max-w-[100px]">
                    {profile?.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                </div>

                {/* Log Out */}
                <button
                  onClick={handleLogOut}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-white/10 hover:bg-rose-900/50 text-emerald-200 hover:text-rose-200 border border-white/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-100 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>

                <button
                  onClick={() => handleOpenAuth('signup')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-[#0B3D2E] bg-emerald-400 hover:bg-emerald-300 shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Voice Settings Button */}
            <button
              onClick={() => setVoiceSettingsOpen(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-200 hover:text-white transition-colors border border-white/10 cursor-pointer flex items-center gap-1.5"
              aria-label="ElevenLabs Voice Settings"
              title="ElevenLabs Voice Settings & API Key"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden xl:inline text-xs font-semibold">Voice Settings</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-200 hover:text-white transition-colors border border-white/10 cursor-pointer"
              aria-label="Toggle Theme"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-200" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B3D2E]/95 dark:bg-[#06241b]/95 backdrop-blur-lg border-t border-emerald-800/40 text-emerald-100 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isReport = item.id === 'report';

          if (isReport) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-400 text-[#0B3D2E] flex items-center justify-center shadow-lg shadow-emerald-900/60 ring-4 ring-[#0B3D2E] active:scale-95 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-emerald-300 mt-1">Report</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-emerald-300 font-bold'
                  : 'text-emerald-200/60 hover:text-emerald-100'
              }`}
            >
              <div className="relative">
                {item.icon}
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-amber-400 text-slate-900 text-[9px] font-black rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
