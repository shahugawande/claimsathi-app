import React, { useState } from 'react';
import {
  ShieldCheck,
  Bell,
  Users,
  Sparkles,
  HelpCircle,
  UserCheck,
  RotateCcw,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { AppNotification } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  notifications: AppNotification[];
  onOpenAuth: () => void;
  onOpenDisclaimer: () => void;
  onResetDemo: () => void;
  isDemoMode: boolean;
  patientName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  notifications,
  onOpenAuth,
  onOpenDisclaimer,
  onResetDemo,
  isDemoMode,
  patientName
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#102A56] via-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-900/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#102A56]">
                ClaimSathi<span className="text-blue-600"> AI</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 rounded-full">
                Bharat Health
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Your Personal Health Insurance Claim Advocate
            </p>
          </div>
        </div>

        {/* Center / Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo Mode Badge / Quick Reset */}
          <div className="flex items-center bg-blue-50/80 border border-blue-200/80 rounded-xl px-2.5 py-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
            <span className="font-semibold text-blue-900 hidden md:inline">Demo Patient:</span>
            <span className="font-medium text-blue-700 ml-1">{patientName}</span>
            <button
              onClick={onResetDemo}
              title="Reset to Rahul Sharma Demo Case (₹90,000 Disputed Claim)"
              className="ml-2 p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-200/50 rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Family View Toggle */}
          <button
            onClick={() => onNavigate(currentView === 'family' ? 'dashboard' : 'family')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'family'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {currentView === 'family' ? 'Exit Family View' : 'Family Dashboard'}
            </span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-bold text-sm text-slate-900">Notifications & Alerts</span>
                  <span className="text-[11px] text-blue-600 font-semibold">{unreadCount} new</span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setShowNotifs(false);
                        if (notif.actionRoute) onNavigate(notif.actionRoute);
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors cursor-pointer border border-slate-100"
                    >
                      <div className="flex items-start gap-2">
                        {notif.type === 'alert' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{notif.title}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Legal / IRDAI notice */}
          <button
            onClick={onOpenDisclaimer}
            title="IRDAI & Legal Information"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Patient Profile / Login */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              {patientName.charAt(0)}
            </div>
            <span className="hidden md:inline">{patientName.split(' ')[0]}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
        </div>
      </div>
    </header>
  );
};
