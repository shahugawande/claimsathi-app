import React, { useState } from 'react';
import { Claim, InsurancePolicy, BillLineItem } from '../types';
import { policyAnalyzer, CoverageAnalysisResult } from '../services/policyAnalyzer';
import {
  Scale,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calculator,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

interface Props {
  claim: Claim;
  policy: InsurancePolicy;
  onNavigateToPreAuth: () => void;
  onNavigateToDenial: () => void;
}

export const CoverageAnalysis: React.FC<Props> = ({
  claim,
  policy,
  onNavigateToPreAuth,
  onNavigateToDenial
}) => {
  const [analysisResult] = useState<CoverageAnalysisResult>(() =>
    policyAnalyzer.analyzeBillAgainstPolicy(
      policy,
      claim.billItems,
      24000,
      'Standard Single Private A/C Room No. 412',
      claim.diagnosis
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Coverage Analysis &amp; Policy Bill Audit</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-referencing hospital inpatient bill items against Star Health policy conditions and IRDAI standards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToDenial}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Analyze ₹90,000 Denial</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mandatory Regulatory Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Preliminary Advocacy Finding</span>
          <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
            {analysisResult.disclaimerText}
          </p>
        </div>
      </div>

      {/* High-Level Financial Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Hospital Invoice</span>
          <div className="text-2xl font-extrabold text-[#102A56] mt-2">
            ₹{analysisResult.totalBilled.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">7 Inpatient line items evaluated</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Potentially Covered By Policy</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">
            ₹{analysisResult.estimatedCovered.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Eligible under Single Private AC room terms</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Dispute / Out-of-Pocket</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-2">
            ₹{analysisResult.estimatedDeduction.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-rose-700 font-medium mt-1">₹80,250 wrongful + ₹9,750 non-medical</p>
        </div>
      </div>

      {/* Interactive Proportionate Deduction Rule Explainer */}
      <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Understanding The Proportionate Deduction Trap</h3>
            <p className="text-xs text-slate-500">Why the TPA deducted ₹50,250 and why it violates IRDAI rules</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-200 space-y-2">
            <span className="font-bold text-rose-900 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-600" />
              TPA's Disallowance Math (Flawed):
            </span>
            <p className="text-rose-800 text-[11px] leading-relaxed">
              TPA claims policy has a 1% limit (₹5,000/day). Because hospital billed ₹8,000/day, they calculated an eligibility ratio of <strong>5,000 / 8,000 = 62.5%</strong>. They then multiplied that 62.5% across surgeon fees and OT charges, slashing ₹50,250!
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ClaimSathi Advocate Defense (IRDAI Circular 194/2020):
            </span>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              Your policy schedule states <strong>"Single Private A/C Room"</strong>. As confirmed by City Care Hospital, Room 412 is the basic Single Private category. Under IRDAI circular, NO proportionate deduction can be applied when the patient does not upgrade past their entitled room!
            </p>
          </div>
        </div>
      </div>

      {/* Line-by-Line Itemized Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Line-Item Medical Expense Audit</h3>
          <span className="text-xs text-slate-500">Matched against Policy Clause Index</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Item &amp; Category</th>
                <th className="py-3 px-4">Billed (INR)</th>
                <th className="py-3 px-4">Approved (INR)</th>
                <th className="py-3 px-4">Disputed (INR)</th>
                <th className="py-3 px-4">Policy Clause</th>
                <th className="py-3 px-4">Audited Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {claim.billItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold">
                    <div className="text-slate-900">{item.description}</div>
                    <span className="text-[10px] text-slate-400 font-normal">{item.category}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold">₹{item.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">
                    ₹{item.coveredAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-rose-600">
                    {item.disputedAmount > 0 ? `₹${item.disputedAmount.toLocaleString('en-IN')}` : '₹0'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                      {item.policyClauseRef || 'Section 2'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-slate-600 max-w-xs">
                    {item.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
