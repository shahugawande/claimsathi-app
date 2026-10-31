import React from 'react';
import { Claim, InsurancePolicy, UploadedDocument, AppNotification } from '../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  FileCheck2,
  Send,
  Sparkles,
  ChevronRight,
  FileUp,
  Percent,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface DashboardProps {
  claims: Claim[];
  policy: InsurancePolicy;
  documents: UploadedDocument[];
  notifications: AppNotification[];
  onNavigate: (view: string) => void;
  onResetDemo: () => void;
}

export const PatientDashboard: React.FC<DashboardProps> = ({
  claims,
  policy,
  documents,
  notifications,
  onNavigate,
  onResetDemo
}) => {
  const primaryClaim = claims[0];
  const totalClaimed = claims.reduce((acc, c) => acc + c.claimedAmount, 0);
  const totalApproved = claims.reduce((acc, c) => acc + c.approvedAmount, 0);
  const totalDisputed = claims.reduce((acc, c) => acc + c.disputedAmount, 0);

  const settlementRatio = totalClaimed > 0 ? Math.round((totalApproved / totalClaimed) * 100) : 0;

  // Chart data
  const financialData = [
    { name: 'Approved', amount: totalApproved, fill: '#16A34A' },
    { name: 'Disputed', amount: totalDisputed, fill: '#DC2626' }
  ];

  const categoryBreakdown = primaryClaim
    ? primaryClaim.billItems.map((item) => ({
        category: item.category,
        claimed: item.amount,
        approved: item.coveredAmount,
        disputed: item.disputedAmount
      }))
    : [];

  const requiredDocTypes = [
    'Insurance Policy',
    'Discharge Summary',
    'Medical Bills',
    'Doctor Prescription'
  ];

  const uploadedTypes = new Set(documents.map((d) => d.documentType));
  const completionPercentage = Math.round(
    (requiredDocTypes.filter((t) => uploadedTypes.has(t as any)).length / requiredDocTypes.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: Active Dispute Alert */}
      {totalDisputed > 0 && (
        <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-red-700 rounded-2xl p-4 sm:p-5 text-white shadow-lg shadow-rose-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base">Action Required: ₹{totalDisputed.toLocaleString('en-IN')} Arbitrary Deduction Detected</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-extrabold uppercase">
                  88% Win Probability
                </span>
              </div>
              <p className="text-xs text-rose-100 mt-0.5">
                Star Health disallowance for single room proportionate rent violates IRDAI Circular 194/2020. Your legal appeal draft is prepared.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => onNavigate('denial')}
              className="flex-1 md:flex-none px-4 py-2 bg-white text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Examine Denial Grounds
            </button>
            <button
              onClick={() => onNavigate('appeal')}
              className="flex-1 md:flex-none px-4 py-2 bg-rose-900/40 hover:bg-rose-900/60 text-white rounded-xl text-xs font-semibold border border-white/20 transition-all"
            >
              Review Appeal PDF
            </button>
          </div>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Claims */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Claim Value</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#102A56]">
              ₹{totalClaimed.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {claims.length} Claim ({primaryClaim?.hospitalName || 'City Care Hospital'})
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-semibold cursor-pointer" onClick={() => onNavigate('tracking')}>
            <span>View Claim Breakdown</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Approved Amount */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Sanctioned Amount</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-600">
              ₹{totalApproved.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {settlementRatio}% of billed expenses cleared by TPA
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Cashless Initial Clearance Received</span>
          </div>
        </div>

        {/* Disputed / Deducted */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Disputed Deduction</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-rose-600">
              ₹{totalDisputed.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Paid out-of-pocket upon hospital discharge
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-rose-600 font-semibold cursor-pointer" onClick={() => onNavigate('denial')}>
            <span>Dispute Recovery Engine</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Policy Coverage Ceiling */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Policy Sum Insured</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#102A56]">
              ₹{(policy.sumInsured + policy.cumulativeBonus).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Base: ₹{(policy.sumInsured / 100000).toFixed(0)}L + Bonus: ₹{(policy.cumulativeBonus / 100000).toFixed(0)}L
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-700 font-semibold cursor-pointer" onClick={() => onNavigate('policy')}>
            <span>{policy.productName.split(' ')[0]} Policy Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Settlement Charts & Journey Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Financial Chart & Itemized Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Settlement Progress & Split Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Claim Settlement Split &amp; Adjudication</h3>
                <p className="text-xs text-slate-500">
                  Ref: {primaryClaim?.claimReferenceNumber || 'STAR-CLM-2026-MUM-89210'}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Approved (62.5%)
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-rose-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Deducted (37.5%)
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Settlement Progress</span>
                <span>{settlementRatio}% Approved</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${settlementRatio}%` }}
                />
                <div
                  className="bg-rose-500 h-full transition-all duration-500"
                  style={{ width: `${100 - settlementRatio}%` }}
                />
              </div>
            </div>

            {/* Bar Chart by Category */}
            <div className="mt-6">
              <p className="text-xs font-bold text-slate-700 mb-3">Expenses by Department (INR)</p>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryBreakdown} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                    <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                    />
                    <Bar dataKey="approved" name="Approved" fill="#16A34A" stackId="a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="disputed" name="Deducted" fill="#DC2626" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onNavigate('preauth')}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-xs block">Pre-Auth Form</span>
              <span className="text-[11px] text-slate-500">Cashless request</span>
            </button>

            <button
              onClick={() => onNavigate('denial')}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-xs transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-xs block">Denial Engine</span>
              <span className="text-[11px] text-rose-600 font-semibold">₹90k Breakdown</span>
            </button>

            <button
              onClick={() => onNavigate('appeal')}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-xs block">Appeal Draft</span>
              <span className="text-[11px] text-slate-500">Legal PDF ready</span>
            </button>

            <button
              onClick={() => onNavigate('mockportal')}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Send className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-xs block">Insurer Portal</span>
              <span className="text-[11px] text-slate-500">Simulate submit</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Documents Readiness & Recent Timeline */}
        <div className="space-y-6">
          {/* Document Readiness Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Document Dossier Status</h3>
              <span className="text-xs font-bold text-blue-600">{completionPercentage}% Ready</span>
            </div>

            <div className="space-y-2.5">
              {requiredDocTypes.map((dt) => {
                const isUploaded = uploadedTypes.has(dt as any);
                return (
                  <div
                    key={dt}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {isUploaded ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <span className="font-medium text-slate-800">{dt}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isUploaded ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isUploaded ? 'Extracted' : 'Missing'}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigate('documents')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <FileUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Open Document Centre (OCR)</span>
            </button>
          </div>

          {/* Recent Claim Activity Timeline Preview */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Recent Activity Log</h3>
              <button
                onClick={() => onNavigate('tracking')}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {primaryClaim?.timeline.slice(-3).map((tl) => (
                <div key={tl.id} className="relative flex items-start gap-3 pl-1">
                  <div
                    className={`w-4 h-4 rounded-full mt-0.5 shrink-0 z-10 border-2 border-white ${
                      tl.statusType === 'danger'
                        ? 'bg-rose-500'
                        : tl.statusType === 'success'
                        ? 'bg-emerald-500'
                        : tl.statusType === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{tl.title}</p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{tl.description}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{tl.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
