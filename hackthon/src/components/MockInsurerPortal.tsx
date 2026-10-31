import React, { useState } from 'react';
import { Claim, PreAuthorisationForm } from '../types';
import confetti from 'canvas-confetti';
import {
  Send,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface Props {
  preAuthData: PreAuthorisationForm;
  onClaimSubmitted: (newClaimRef: string) => void;
  onNavigateToTracking: () => void;
}

export const MockInsurerPortal: React.FC<Props> = ({
  preAuthData,
  onClaimSubmitted,
  onNavigateToTracking
}) => {
  const [insurerPortal, setInsurerPortal] = useState<'Star Health' | 'MediAssist TPA' | 'Care Health'>('MediAssist TPA');
  const [patientName, setPatientName] = useState(preAuthData.patientName);
  const [policyNo, setPolicyNo] = useState(preAuthData.policyNumber);
  const [hospitalName, setHospitalName] = useState(preAuthData.hospitalName);
  const [estimatedAmount, setEstimatedAmount] = useState(preAuthData.estimatedTotalExpense);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedRef = `STAR-CLM-2026-MUM-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedRef(generatedRef);
      setIsSubmitting(false);
      onClaimSubmitted(generatedRef);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // no-op
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase">
              Simulated TPA Portal
            </span>
            <span className="text-xs text-slate-400">• Browser-Based Submission Sandbox</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Mock Insurer &amp; TPA Claim Desk</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">Simulate Target Portal:</div>
          {(['MediAssist TPA', 'Star Health', 'Care Health'] as const).map((portal) => (
            <button
              key={portal}
              onClick={() => setInsurerPortal(portal)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                insurerPortal === portal
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {portal}
            </button>
          ))}
        </div>
      </div>

      {/* Sandboxed Simulation Banner */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Demonstrates browser-based cashless claim submission. No patient data is transmitted to external networks.
          </span>
        </div>
        <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-800">
          Sandbox Mode Active
        </span>
      </div>

      {submittedRef ? (
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-md p-8 text-center space-y-4 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Claim Docket Successfully Registered
            </span>
            <h3 className="text-2xl font-black text-slate-900">{submittedRef}</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              MediAssist TPA cashless claim desk has acknowledged receipt. Statutory IRDAI 2-hour pre-authorisation turnaround window initialized.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Patient:</span>
              <span className="font-bold text-slate-800">{patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hospital:</span>
              <span className="font-semibold text-slate-800">{hospitalName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Claimed Estimate:</span>
              <span className="font-bold text-blue-700">₹{estimatedAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">SLA Mandate:</span>
              <span className="font-semibold text-emerald-700">IRDAI 30-Day Final Adjudication</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setSubmittedRef(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Submit Another Test Claim
            </button>
            <button
              onClick={onNavigateToTracking}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Track Live Claim Progress</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#102A56] text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {insurerPortal} Electronic Claim Intake Portal
              </h3>
              <p className="text-xs text-slate-500">Secure Inpatient Electronic Submission Gateway</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Insured / Patient Name</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Health Policy Schedule Number</label>
              <input
                type="text"
                required
                value={policyNo}
                onChange={(e) => setPolicyNo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Treating Hospital &amp; Branch</label>
              <input
                type="text"
                required
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estimated Inpatient Claim (INR)</label>
              <input
                type="number"
                required
                value={estimatedAmount}
                onChange={(e) => setEstimatedAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-blue-700"
              />
            </div>
          </div>

          {/* Attached documents list */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
            <span className="font-bold text-slate-700 block">Enclosed Claim Attachments (4 Verified):</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Policy Schedule
              </span>
              <span className="flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Discharge Summary
              </span>
              <span className="flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Hospital Bill
              </span>
              <span className="flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Surgeon Letter
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Transmitting to {insurerPortal} TPA Desk...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Pre-Auth &amp; Generate Claim Ref</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
