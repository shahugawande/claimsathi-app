import React from 'react';
import { Claim, InsurancePolicy, DenialAnalysis, UploadedDocument } from '../types';
import {
  ShieldAlert,
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FileCheck2,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Layers,
  HelpCircle
} from 'lucide-react';

interface Props {
  claim: Claim;
  policy: InsurancePolicy;
  documents: UploadedDocument[];
  onNavigateToAppeal: () => void;
  onNavigateToFollowUp: () => void;
}

export const DenialAnalysisEngine: React.FC<Props> = ({
  claim,
  policy,
  documents,
  onNavigateToAppeal,
  onNavigateToFollowUp
}) => {
  const analysis = claim.denialAnalysis;

  if (!analysis) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
        <ShieldAlert className="w-12 h-12 mx-auto text-amber-500 mb-3" />
        <h3 className="font-bold text-slate-900 text-base">No Active Denial Recorded</h3>
        <p className="text-xs text-slate-400 mt-1">This claim currently has no active deductions or rejection flags.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase">
              Denial Breaker Engine
            </span>
            <span className="text-xs text-slate-400">• Disputing ₹{analysis.disputedAmount.toLocaleString('en-IN')} Deduction</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Rejection Dissection &amp; Legal Grounds</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToAppeal}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Generate Statutory Appeal Letter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Victory Potential & Statutory Shield Banner */}
      <div className="bg-gradient-to-r from-[#102A56] via-blue-900 to-[#1e3a8a] text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              IRDAI Redressal Probability Assessment
            </span>
          </div>
          <h3 className="text-2xl font-black">
            {analysis.successProbabilityPercentage}% Probability of Reversal
          </h3>
          <p className="text-xs text-blue-100 leading-relaxed">
            Based on IRDAI Circular 194/2020 and precedents by the Mumbai Insurance Ombudsman. The insurer's application of proportionate room rent against an entitled Single Private Room category is statutorily invalid.
          </p>
        </div>

        <div className="shrink-0 bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/20 text-center">
          <span className="text-[11px] text-blue-200 block">Total Disputed Amount</span>
          <span className="text-2xl font-black text-amber-300">
            ₹{analysis.disputedAmount.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-emerald-300 font-bold block mt-1">
            ₹80,250 Reclaimable via GRO
          </span>
        </div>
      </div>

      {/* Rejection Reason vs Matched Policy Clause Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: TPA Rejection Reason */}
        <div className="bg-white rounded-2xl border border-rose-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              TPA Disallowance Reason:
            </span>
            <span className="font-mono text-[10px] bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200">
              {analysis.rejectionCode}
            </span>
          </div>

          <p className="text-xs text-slate-800 bg-rose-50/50 p-3.5 rounded-xl border border-rose-100 font-mono leading-relaxed">
            "{analysis.rejectionReasonOriginal}"
          </p>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Why this disallowance is legally questionable:</span>
            <p className="text-[11px] leading-relaxed">
              1. The TPA artificially imposed a 1% numeric cap when the policy schedule specifies room category.
            </p>
            <p className="text-[11px] leading-relaxed">
              2. Pre-operative emergency CT was classified as non-essential OPD evaluation without consulting the operating surgeon.
            </p>
          </div>
        </div>

        {/* Right: Actual Policy Clause Cited */}
        <div className="bg-white rounded-2xl border border-blue-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Verified Policy Clause:
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-bold">
              {analysis.matchedPolicyClause.clauseNumber} • Page {analysis.matchedPolicyClause.pageNumber}
            </span>
          </div>

          <p className="text-xs text-slate-800 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100 font-mono leading-relaxed">
            "{analysis.matchedPolicyClause.text}"
          </p>

          <div className="p-3 bg-blue-50/50 rounded-xl text-xs text-blue-900 space-y-1 border border-blue-100">
            <span className="font-bold block">IRDAI Master Circular Protection:</span>
            <p className="text-[11px] leading-relaxed">
              {analysis.irdaiPrecedentNotes}
            </p>
          </div>
        </div>
      </div>

      {/* Concrete Medical & Documentary Evidence Found */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Documentary Evidence Extracted from Patient Records
            </h3>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {analysis.medicalEvidenceFound.length} Verified Proofs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {analysis.medicalEvidenceFound.map((evidence, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5"
            >
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px] font-medium">{evidence}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grounds for Appeal & Recommended Next Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grounds */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Scale className="w-4 h-4 text-blue-600" />
            <span>Formal Dispute Grounds for Appeal Letter:</span>
          </div>
          <div className="space-y-2.5 text-xs">
            {analysis.disputeGrounds.map((ground, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-blue-950 text-[11px] leading-relaxed">
                <strong>Ground {idx + 1}:</strong> {ground}
              </div>
            ))}
          </div>
        </div>

        {/* Action Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>Advocate Action Checklist:</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {analysis.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-slate-800 text-[11px]">{rec}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onNavigateToAppeal}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Proceed to Appeal Letter Generator</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
