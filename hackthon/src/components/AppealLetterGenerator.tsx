import React, { useState } from 'react';
import { AppealLetter, Claim } from '../types';
import { pdfGenerator } from '../services/pdfGenerator';
import {
  FileText,
  Copy,
  Download,
  Check,
  Edit3,
  Send,
  Building,
  User,
  ShieldCheck,
  Scale,
  Sparkles,
  PhoneCall,
  Printer
} from 'lucide-react';

interface Props {
  initialAppeal: AppealLetter;
  claim: Claim;
  onNavigateToFollowUp: () => void;
  onSaveAppeal: (appeal: AppealLetter) => void;
}

export const AppealLetterGenerator: React.FC<Props> = ({
  initialAppeal,
  claim,
  onNavigateToFollowUp,
  onSaveAppeal
}) => {
  const [appeal, setAppeal] = useState<AppealLetter>(initialAppeal);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleCopy = () => {
    const fullText = `TO: ${appeal.recipientName}, ${appeal.recipientDesignation}
${appeal.insuranceCompany}
${appeal.groAddress}

DATE: ${appeal.dateOfAppeal}
CLAIM REF: ${appeal.claimReferenceNumber} | POLICY NO: ${appeal.policyNumber}
PATIENT: ${appeal.patientName}

SUBJECT: ${appeal.subject}

Respected Sir/Madam,

${appeal.summaryOfEvents}

GROUNDS FOR APPEAL:
${appeal.groundsForAppeal
  .map(
    (g, i) => `
${i + 1}. ${g.groundTitle}
Policy Clause Cited: ${g.policyClauseCited}
Medical Fact: ${g.medicalFact}
Legal & IRDAI Precedent: ${g.legalOrIrdaPrecedent}`
  )
  .join('\n')}

PRAYER FOR RELIEF:
Kindly reverse the arbitrary deduction and release the balance sum of INR ${appeal.demandedReliefAmount.toLocaleString(
      'en-IN'
    )} within 15 days as stipulated under IRDAI Protection of Policyholders' Interests Regulations.

LIST OF ENCLOSURES:
${appeal.listOfEnclosures.map((enc, i) => `${i + 1}. ${enc}`).join('\n')}

Yours faithfully,
${appeal.signatureName}
(Insured Claimant)`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    pdfGenerator.generateAppealPdf(appeal);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleSave = () => {
    onSaveAppeal(appeal);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase">
              Statutory Grievance Format
            </span>
            <span className="text-xs text-slate-400">• Ready for Grievance Redressal Officer (GRO)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Evidence-Backed Insurance Appeal Letter</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Appeal'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloaded ? 'PDF Downloaded!' : 'Download Official PDF'}</span>
          </button>

          <button
            onClick={onNavigateToFollowUp}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Schedule Follow-Up</span>
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
          <span>You are currently modifying the legal appeal draft. Click Save when finished.</span>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Appeal Letter Paper View */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-10 space-y-6 text-slate-800 max-w-4xl mx-auto font-sans">
        {/* Letterhead Banner */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 block">
              FORMAL GRIEVANCE REPRESENTATION
            </span>
            <h3 className="font-extrabold text-lg text-slate-900">
              IRDAI PROTECTION OF POLICYHOLDERS’ INTERESTS DOCKET
            </h3>
            <p className="text-xs text-slate-500">
              Pre-Litigation Representation under Insurance Ombudsman Rules 2017
            </p>
          </div>
          <div className="text-right text-xs">
            <span className="font-bold text-slate-900 block">Date: {appeal.dateOfAppeal}</span>
            <span className="font-mono text-blue-700 font-bold">Ref: {appeal.claimReferenceNumber}</span>
          </div>
        </div>

        {/* Addressee */}
        <div className="space-y-1 text-xs">
          <p className="font-bold text-slate-900">To,</p>
          {isEditing ? (
            <div className="space-y-2 max-w-md">
              <input
                type="text"
                value={appeal.recipientName}
                onChange={(e) => setAppeal({ ...appeal, recipientName: e.target.value })}
                className="w-full px-2 py-1 rounded border border-slate-200 text-xs font-semibold"
              />
              <input
                type="text"
                value={appeal.recipientDesignation}
                onChange={(e) => setAppeal({ ...appeal, recipientDesignation: e.target.value })}
                className="w-full px-2 py-1 rounded border border-slate-200 text-xs"
              />
              <input
                type="text"
                value={appeal.insuranceCompany}
                onChange={(e) => setAppeal({ ...appeal, insuranceCompany: e.target.value })}
                className="w-full px-2 py-1 rounded border border-slate-200 text-xs"
              />
            </div>
          ) : (
            <div>
              <p className="font-bold">{appeal.recipientName}</p>
              <p className="text-slate-600">{appeal.recipientDesignation}</p>
              <p className="font-semibold text-slate-800">{appeal.insuranceCompany}</p>
              <p className="text-slate-500 max-w-sm">{appeal.groAddress}</p>
            </div>
          )}
        </div>

        {/* Subject */}
        <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs font-bold text-[#102A56]">
          {isEditing ? (
            <textarea
              value={appeal.subject}
              onChange={(e) => setAppeal({ ...appeal, subject: e.target.value })}
              className="w-full p-2 rounded border border-blue-300 text-xs font-bold"
              rows={2}
            />
          ) : (
            <span>SUBJECT: {appeal.subject}</span>
          )}
        </div>

        {/* Body & Summary */}
        <div className="text-xs space-y-4 leading-relaxed text-justify">
          <p className="font-bold">Respected Sir / Madam,</p>

          {isEditing ? (
            <textarea
              value={appeal.summaryOfEvents}
              onChange={(e) => setAppeal({ ...appeal, summaryOfEvents: e.target.value })}
              className="w-full p-2 rounded border border-slate-200 text-xs leading-relaxed"
              rows={4}
            />
          ) : (
            <p>{appeal.summaryOfEvents}</p>
          )}

          {/* Grounds of Appeal */}
          <div className="pt-2 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
              SPECIFIC LEGAL &amp; MEDICAL GROUNDS FOR RECONSIDERATION:
            </h4>

            {appeal.groundsForAppeal.map((ground, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-blue-700 block text-xs">{ground.groundTitle}</span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400 block font-semibold">Policy Clause:</span>
                    <span className="font-mono text-slate-800">{ground.policyClauseCited}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block font-semibold">Medical Fact:</span>
                    <span className="text-slate-800">{ground.medicalFact}</span>
                  </div>
                </div>

                <div className="pt-1 text-[11px] text-blue-900 bg-blue-100/50 p-2 rounded-lg border border-blue-200">
                  <span className="font-bold">Statutory IRDAI Precedent: </span>
                  <span>{ground.legalOrIrdaPrecedent}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Prayer for Relief */}
          <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-950 font-medium space-y-1">
            <span className="font-bold text-amber-900 block text-xs">PRAYER FOR STATUTORY RELIEF:</span>
            <p className="text-[11px]">
              In light of the documentary evidence and IRDAI Circular 194/2020, I pray that the wrongful deductions of{' '}
              <strong>INR {appeal.demandedReliefAmount.toLocaleString('en-IN')}</strong> be reversed and credited to my bank account within the statutory 15-day resolution window. Failure to do so will constrain me to escalate this docket to the Mumbai Insurance Ombudsman under Rule 14 of the Insurance Ombudsman Rules, 2017.
            </p>
          </div>

          {/* Enclosures */}
          <div className="pt-2">
            <span className="font-bold text-slate-900 block mb-1">List of Evidentiary Attachments:</span>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px]">
              {appeal.listOfEnclosures.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ol>
          </div>

          {/* Signoff */}
          <div className="pt-6 flex justify-between items-end border-t border-slate-200">
            <div className="text-[10px] text-slate-400">
              CC: The Insurance Ombudsman, Mumbai Centre, Jeevan Seva Annexe, S.V. Road, Santacruz (W), Mumbai.
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Yours faithfully,</span>
              <span className="font-bold text-slate-900 block text-sm mt-1">{appeal.signatureName}</span>
              <span className="text-[10px] text-slate-400">(Insured / Claimant)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
