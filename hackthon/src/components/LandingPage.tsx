import React from 'react';
import {
  ShieldCheck,
  ArrowRight,
  FileSearch,
  Scale,
  ShieldAlert,
  PhoneCall,
  FileCheck2,
  Users,
  CheckCircle2,
  HeartPulse,
  Sparkles,
  Award,
  ChevronRight,
  Clock,
  HelpCircle
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoadDemo: () => void;
  onOpenAuth: () => void;
  onOpenDisclaimer: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLoadDemo,
  onOpenAuth,
  onOpenDisclaimer
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#102A56] via-[#133368] to-[#1a448a] text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Built for Indian Patients & Families • IRDAI Compliant Advocacy</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none text-balance">
            Your Insurance Claim <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-amber-300">
              Deserves to Be Heard.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal">
            Understand complex policy clauses, auto-generate cashless pre-authorisation forms, track claims in real time, dissect arbitrary TPA deductions, and generate evidence-backed legal appeals.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onLoadDemo}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Test Drive: Rahul Sharma ₹90k Dispute</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 flex items-center justify-center gap-2 backdrop-blur-xs transition-colors"
            >
              <span>Upload Your Medical Documents</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/10 text-left">
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 backdrop-blur-xs">
              <span className="text-xs text-blue-200 block">Typical Recovery Rate</span>
              <span className="text-2xl font-bold text-white">78% - 88%</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Under IRDAI 2020 Rules</span>
            </div>
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 backdrop-blur-xs">
              <span className="text-xs text-blue-200 block">Pre-Auth Form Generation</span>
              <span className="text-2xl font-bold text-white">&lt; 3 mins</span>
              <span className="text-[10px] text-blue-300 block mt-0.5">IRDAI Standardised Format</span>
            </div>
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 backdrop-blur-xs">
              <span className="text-xs text-blue-200 block">Browser OCR &amp; Parsing</span>
              <span className="text-2xl font-bold text-white">100% Local</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Zero Paid API Keys Needed</span>
            </div>
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 backdrop-blur-xs">
              <span className="text-xs text-blue-200 block">Family Jargon-Free View</span>
              <span className="text-2xl font-bold text-white">Hindi &amp; Eng</span>
              <span className="text-[10px] text-amber-300 block mt-0.5">WhatsApp Shareable</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Complete Patient Journey (How It Works) */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            End-To-End Patient Journey
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">From Hospital Admission to Final Settlement</h2>
          <p className="text-sm text-slate-600">
            ClaimSathi AI stands with you at every critical milestone, protecting you from wrongful deductions and confusing fine print.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            {
              step: '01',
              title: 'Document Upload & Local OCR',
              desc: 'Upload policy, doctor prescription, and hospital estimates. Browser-based extraction parses clauses without external LLM costs.',
              icon: FileSearch
            },
            {
              step: '02',
              title: 'Instant Cashless Pre-Auth',
              desc: 'Generates standard IRDAI pre-authorisation forms for hospital TPA desks in under 3 minutes with PDF export.',
              icon: FileCheck2
            },
            {
              step: '03',
              title: 'Coverage Audit',
              desc: 'Line-by-line audit checks hospital bills against policy limits, warning of proportionate room rent traps.',
              icon: Scale
            },
            {
              step: '04',
              title: 'Denial Analysis Engine',
              desc: 'When claims are rejected or trimmed, our rule-based engine identifies unlawful deductions citing IRDAI circulars.',
              icon: ShieldAlert
            },
            {
              step: '05',
              title: 'Appeal & Voice Follow-Up',
              desc: 'Drafts formal legal representation to the Grievance Redressal Officer (GRO) & simulates follow-up calls.',
              icon: PhoneCall
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-200">{item.step}</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 bg-slate-100/60 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Features & Benefits</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why Indian Families Choose ClaimSathi AI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Denial Breaker Algorithm</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Matches arbitrary rejection codes against Clause 3.2.1 and IRDAI Standardisation Circulars. Dissects the notorious "1% room rent proportionate deduction" trick used by TPAs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Statutory IRDAI Appeal Letters</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates formal 3-page representation addressed to Grievance Redressal Officers (GRO) and the Insurance Ombudsman with medical evidence citations and downloadable PDF.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Family-First Dashboard</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provides elderly parents and anxious spouses with a clean, jargon-free status overview in Hindi & English with 1-click WhatsApp updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Callout Banner */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#102A56] to-blue-800 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold">
              Ready for Live Evaluation
            </div>
            <h3 className="text-2xl font-extrabold">Inspect Rahul Sharma's ₹90,000 Disputed Claim</h3>
            <p className="text-xs text-blue-100 max-w-lg">
              Explore the full journey: Star Health policy, City Care Hospital Laparoscopic surgery bill, ₹50,250 proportionate deduction dispute, and ready-to-file legal appeal.
            </p>
          </div>
          <button
            onClick={onLoadDemo}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <span>Load Demo Case Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800">ClaimSathi AI</span>
            <span>— Your Personal Health Insurance Claim Advocate</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenDisclaimer} className="hover:text-blue-600 underline">
              Regulatory Disclaimers
            </button>
            <span>•</span>
            <button onClick={onOpenAuth} className="hover:text-blue-600">
              Supabase / Local Database
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
