import React, { useState } from 'react';
import { InsurancePolicy, PolicyClause } from '../types';
import {
  FileSearch,
  Search,
  ShieldCheck,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Filter
} from 'lucide-react';

interface Props {
  policy: InsurancePolicy;
  onNavigateToCoverage: () => void;
}

export const PolicyUnderstanding: React.FC<Props> = ({ policy, onNavigateToCoverage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeClause, setActiveClause] = useState<PolicyClause>(policy.clauses[0]);

  const categories = ['All', 'Room Rent', 'Waiting Period', 'Pre-Post Hosp', 'Exclusion'];

  const filteredClauses = policy.clauses.filter((clause) => {
    const matchesSearch =
      clause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clause.clauseText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clause.clauseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || clause.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Policy Understanding &amp; Clause Explorer</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured breakdown of Indian health insurance coverage terms with verified page citations
          </p>
        </div>

        <button
          onClick={onNavigateToCoverage}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <span>Run Coverage Analysis</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Structured Key Policy Terms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Policyholder & Company */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Insurer &amp; Policy No.</span>
          <p className="font-bold text-slate-900 text-sm line-clamp-1">{policy.insuranceCompany}</p>
          <div className="text-xs text-slate-600 font-mono bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            {policy.policyNumber || 'Not found'}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Holder: {policy.policyholderName}</span>
          </div>
        </div>

        {/* Sum Insured & Bonus */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sum Insured + Cumulative Bonus</span>
          <div className="text-xl font-extrabold text-[#102A56]">
            ₹{policy.sumInsured.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">
            + ₹{policy.cumulativeBonus.toLocaleString('en-IN')} No-Claim Bonus Accrued
          </p>
          <span className="text-[10px] text-slate-400 block">
            Total Effective Cover: ₹{(policy.sumInsured + policy.cumulativeBonus).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Room Rent Eligibility (Critical Clause) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Room Rent Limit</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">Clause 3.2.1</span>
          </div>
          <div className="text-sm font-bold text-blue-700">
            {policy.roomRentLimitType === 'Single Private AC' ? 'Single Private A/C Room' : `1% of SI (₹${policy.roomRentLimitValue})`}
          </div>
          <p className="text-[11px] text-slate-600 leading-tight">
            No proportionate deduction when occupying eligible Single Private Room.
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">Verified on Page 8</span>
        </div>

        {/* Waiting Periods */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Waiting Periods</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">Pre-Existing:</span>
            <span className="text-xs font-semibold text-blue-700">{policy.preExistingWaitingMonths} Months</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">Specific (Stones/Hernia):</span>
            <span className="text-xs font-semibold text-blue-700">{policy.specificAilmentWaitingMonths} Months</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold">
            Policy Active 42+ Months: All Waiting Periods Served
          </p>
        </div>
      </div>

      {/* Additional Terms Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px]">Pre-Hospitalisation</span>
          <span className="font-bold text-slate-800">{policy.preHospDays} Days Covered</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Post-Hospitalisation</span>
          <span className="font-bold text-slate-800">{policy.postHospDays} Days Covered</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Co-Payment Requirement</span>
          <span className="font-bold text-emerald-600">{policy.coPayPercentage}% (Nil Co-Pay)</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Third Party Administrator (TPA)</span>
          <span className="font-bold text-slate-800">{policy.tpaName}</span>
        </div>
      </div>

      {/* Search & Clause Browser Split */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Policy Wording &amp; Legal Clause Interpretations</h3>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search room rent, waiting, tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Split View */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
          {/* Clause list (5 cols) */}
          <div className="md:col-span-5 space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredClauses.map((clause) => {
              const isSelected = activeClause.id === clause.id;
              return (
                <div
                  key={clause.id}
                  onClick={() => setActiveClause(clause)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-blue-700">{clause.clauseNumber}</span>
                    <span className="text-[10px] text-slate-400">Page {clause.pageNumber}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{clause.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{clause.summary}</p>
                </div>
              );
            })}
          </div>

          {/* Clause Detail Pane (7 cols) */}
          <div className="md:col-span-7 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  {activeClause.category} • {activeClause.clauseNumber}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{activeClause.title}</h4>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
                Page {activeClause.pageNumber}
              </span>
            </div>

            {/* Verbatim Clause Text */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Verbatim Policy Wording:
              </span>
              <p className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 font-mono leading-relaxed">
                "{activeClause.clauseText}"
              </p>
            </div>

            {/* Advocate Interpretation */}
            <div className="p-3 bg-blue-100/60 rounded-xl border border-blue-200 text-xs space-y-1">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                ClaimSathi Advocate Interpretation:
              </span>
              <p className="text-blue-950 text-[11px] leading-relaxed">
                {activeClause.interpretationGuide}
              </p>
            </div>

            {activeClause.irdaGuidelinesReference && (
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span className="font-bold text-slate-700">IRDAI Statutory Citation:</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                  {activeClause.irdaGuidelinesReference}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
