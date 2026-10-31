import React from 'react';
import {
  LayoutDashboard,
  FileUp,
  FileSearch,
  Scale,
  FileCheck2,
  Send,
  GitBranch,
  ShieldAlert,
  FileText,
  PhoneCall,
  Users,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  disputedAmount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, disputedAmount }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'documents', label: 'Document & OCR Centre', icon: FileUp, badge: '4 Docs' },
    { id: 'policy', label: 'Policy Understanding', icon: FileSearch, badge: null },
    { id: 'coverage', label: 'Coverage Analysis', icon: Scale, badge: null },
    { id: 'preauth', label: 'Pre-Authorisation Form', icon: FileCheck2, badge: 'Ready' },
    { id: 'mockportal', label: 'Mock Insurer Portal', icon: Send, badge: 'Simulated' },
    { id: 'tracking', label: 'Claim Tracking & Timeline', icon: GitBranch, badge: null },
    {
      id: 'denial',
      label: 'Denial Analysis Engine',
      icon: ShieldAlert,
      badge: disputedAmount > 0 ? `₹${(disputedAmount / 1000).toFixed(0)}k Dispute` : null,
      highlight: true
    },
    { id: 'appeal', label: 'Appeal Letter Generator', icon: FileText, badge: 'Draft' },
    { id: 'followup', label: 'Follow-Up & Voice Call', icon: PhoneCall, badge: 'Audio AI' },
    { id: 'family', label: 'Family Status View', icon: Users, badge: 'Plain Hindi/Eng' }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 flex-1 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Patient Claim Journey
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : item.highlight
                  ? 'bg-rose-50/70 hover:bg-rose-100/80 text-rose-900 border border-rose-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : item.highlight ? 'text-rose-600' : 'text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.highlight
                      ? 'bg-rose-200 text-rose-800'
                      : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Indian Healthcare Advocate Card */}
      <div className="p-4 border-t border-slate-100">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#102A56] to-blue-900 text-white text-xs shadow-md">
          <div className="flex items-center gap-2 mb-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>IRDAI Citizen Protections</span>
          </div>
          <p className="text-[11px] text-blue-200 leading-relaxed">
            Rule 194/2020: Proportionate deductions are invalid when patient stays in designated single private room category.
          </p>
          <button
            onClick={() => onNavigate('denial')}
            className="mt-2.5 w-full py-1.5 px-2 bg-blue-500/30 hover:bg-blue-500/50 rounded-lg text-white font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors"
          >
            <span>Inspect ₹90k Appeal</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
