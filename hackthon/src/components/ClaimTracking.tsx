import React, { useState } from 'react';
import { Claim, ClaimStatus } from '../types';
import {
  GitBranch,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  Filter,
  FileText,
  User,
  Building,
  Scale
} from 'lucide-react';

interface Props {
  claim: Claim;
  onUpdateStatus: (newStatus: ClaimStatus) => void;
  onNavigateToDenial: () => void;
  onNavigateToAppeal: () => void;
}

export const ClaimTracking: React.FC<Props> = ({
  claim,
  onUpdateStatus,
  onNavigateToDenial,
  onNavigateToAppeal
}) => {
  const allStatuses: ClaimStatus[] = [
    'Draft',
    'Submitted',
    'Under Review',
    'Additional Documents Required',
    'Partially Approved',
    'Approved',
    'Rejected',
    'Settled'
  ];

  const currentStatusIndex = allStatuses.indexOf(claim.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              {claim.claimReferenceNumber}
            </span>
            <span className="text-xs text-slate-400">• Last Updated: {claim.lastUpdated}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Live Claim Tracking &amp; Activity Journey</h2>
        </div>

        {claim.disputedAmount > 0 && (
          <button
            onClick={onNavigateToDenial}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Dissect ₹90,000 Dispute</span>
          </button>
        )}
      </div>

      {/* Interactive Status Switcher (Hackathon Demo Tool) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <GitBranch className="w-4 h-4 text-blue-600" />
            Current Adjudication Stage:
          </span>
          <span className="text-[11px] text-slate-400">
            (Interactive Switcher for Judges &amp; Presentation)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {allStatuses.map((st, idx) => {
            const isCurrent = claim.status === st;
            return (
              <button
                key={st}
                onClick={() => onUpdateStatus(st)}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold text-center transition-all ${
                  isCurrent
                    ? 'bg-[#102A56] text-white shadow-sm ring-2 ring-blue-500'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Financial Settlement Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Submitted Bill</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            ₹{claim.claimedAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Final Hospital Invoice</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved by TPA</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            ₹{claim.approvedAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">Direct Cashless Release</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disputed Deductions</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">
            ₹{claim.disputedAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-rose-700 font-semibold mt-0.5 block">Under Active Legal Appeal</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Out-of-Pocket</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            ₹{claim.disputedAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Paid under protest at discharge</span>
        </div>
      </div>

      {/* Rejection / Partial Approval Reason Detail Card */}
      {claim.denialReason && (
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>TPA Disallowance &amp; Deduction Explanation Sheet:</span>
          </div>
          <pre className="text-xs text-rose-950 font-sans whitespace-pre-wrap leading-relaxed pl-6">
            {claim.denialReason}
          </pre>
          <div className="pt-2 pl-6 flex items-center gap-3">
            <button
              onClick={onNavigateToDenial}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Examine Ground-By-Ground Dispute</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onNavigateToAppeal}
              className="px-4 py-2 bg-white text-slate-800 hover:bg-slate-100 font-semibold text-xs rounded-xl border border-rose-200 transition-colors"
            >
              Draft Legal Appeal Letter
            </button>
          </div>
        </div>
      )}

      {/* Timeline of Claim Events */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Chronological Audit Timeline</h3>
            <p className="text-xs text-slate-500">Every interaction documented for IRDAI grievance records</p>
          </div>
          <span className="text-xs font-bold text-blue-600">{claim.timeline.length} Recorded Milestones</span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {claim.timeline.map((event) => (
            <div key={event.id} className="relative flex items-start gap-4">
              {/* Marker */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white shadow-xs flex items-center justify-center ${
                  event.statusType === 'danger'
                    ? 'bg-rose-500'
                    : event.statusType === 'success'
                    ? 'bg-emerald-500'
                    : event.statusType === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-blue-600'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              {/* Event Content */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 w-full space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 text-xs">{event.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                      Actor: {event.actor}
                    </span>
                    <span className="text-[10px] text-slate-400">{event.date}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
