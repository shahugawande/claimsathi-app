import React, { useState } from 'react';
import { PreAuthorisationForm } from '../types';
import { pdfGenerator } from '../services/pdfGenerator';
import {
  FileCheck2,
  Download,
  Send,
  Edit3,
  CheckCircle2,
  Printer,
  Sparkles,
  Building,
  User,
  Stethoscope,
  IndianRupee,
  Layers,
  FileText
} from 'lucide-react';

interface Props {
  initialData: PreAuthorisationForm;
  onTransmitToPortal: (data: PreAuthorisationForm) => void;
}

export const PreAuthGenerator: React.FC<Props> = ({ initialData, onTransmitToPortal }) => {
  const [formData, setFormData] = useState<PreAuthorisationForm>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPdf = () => {
    pdfGenerator.generatePreAuthPdf(formData);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleBreakdownChange = (field: keyof PreAuthorisationForm['breakdown'], val: number) => {
    const newBreakdown = { ...formData.breakdown, [field]: val };
    const newTotal = Object.values(newBreakdown).reduce((a, b) => a + b, 0);
    setFormData({
      ...formData,
      breakdown: newBreakdown,
      estimatedTotalExpense: newTotal
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
              IRDAI Standard Format
            </span>
            <span className="text-xs text-slate-400">• Cashless Hospitalisation Request</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Cashless Pre-Authorisation Form</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Exit Edit Mode' : 'Edit Fields'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'Downloaded!' : 'Download Official PDF'}</span>
          </button>

          <button
            onClick={() => onTransmitToPortal(formData)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit to Mock Insurer</span>
          </button>
        </div>
      </div>

      {/* Main Pre-Auth Form Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#102A56] text-white flex items-center justify-center font-black text-xl shadow-md">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#102A56] tracking-tight">
                CASHLESS PRE-AUTHORISATION REQUEST
              </h3>
              <p className="text-xs text-slate-500">
                Form prescribed by Insurance Regulatory and Development Authority of India
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="font-semibold text-slate-400 block">Generated via ClaimSathi AI</span>
            <span className="font-mono text-slate-700 font-bold">{formData.generatedAt}</span>
          </div>
        </div>

        {/* Section A: Insured & Patient Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#102A56] uppercase tracking-wider bg-slate-100 p-2 rounded-lg">
            <User className="w-4 h-4 text-blue-600" />
            <span>Section A: Patient &amp; Policyholder Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Patient Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold"
                />
              ) : (
                <span className="font-bold text-slate-900 block text-sm">{formData.patientName}</span>
              )}
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Age &amp; Gender</label>
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="flex-1 px-2 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              ) : (
                <span className="font-semibold text-slate-800">{formData.age} Years / {formData.gender}</span>
              )}
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Policy Certificate Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.policyNumber}
                  onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                />
              ) : (
                <span className="font-mono font-bold text-blue-700">{formData.policyNumber}</span>
              )}
            </div>
          </div>
        </div>

        {/* Section B: Hospital & Doctor Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#102A56] uppercase tracking-wider bg-slate-100 p-2 rounded-lg">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Section B: Hospital, Treating Surgeon &amp; Clinical Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Hospital Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold"
                />
              ) : (
                <span className="font-bold text-slate-900 block">{formData.hospitalName}</span>
              )}
              <span className="text-[11px] text-slate-500 mt-0.5 block">{formData.hospitalAddress}</span>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Treating Doctor &amp; Reg. No.</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.treatingDoctorName}
                  onChange={(e) => setFormData({ ...formData, treatingDoctorName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              ) : (
                <span className="font-bold text-slate-800 block">{formData.treatingDoctorName}</span>
              )}
              <span className="text-[11px] font-mono text-slate-500 block">Reg: {formData.doctorRegistrationNo}</span>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Room Category Requested</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.roomTypeRequested}
                  onChange={(e) => setFormData({ ...formData, roomTypeRequested: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              ) : (
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                  {formData.roomTypeRequested}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
            <div>
              <label className="text-slate-400 block mb-1">Provisional Diagnosis</label>
              <span className="font-semibold text-slate-900 block">{formData.provisionalDiagnosis}</span>
              <span className="font-mono text-[10px] text-slate-400">ICD-10: {formData.icdCode}</span>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Proposed Treatment / Surgery</label>
              <span className="font-bold text-slate-900 block">{formData.proposedTreatment}</span>
              <span className="text-[11px] text-emerald-700 font-semibold">{formData.treatmentType} Case</span>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Date of Admission &amp; Stay</label>
              <span className="font-bold text-slate-800 block">{formData.dateOfAdmission}</span>
              <span className="text-[11px] text-slate-500">{formData.estimatedHospitalStayDays} Expected Days Stay</span>
            </div>
          </div>
        </div>

        {/* Section C: Estimated Expense Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#102A56] uppercase tracking-wider bg-slate-100 p-2 rounded-lg">
            <IndianRupee className="w-4 h-4 text-blue-600" />
            <span>Section C: Estimated Inpatient Expense Breakdown</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[11px]">Room &amp; Boarding Charges</span>
              <span className="font-bold text-slate-900 text-sm mt-1 block">
                ₹{formData.breakdown.roomRent.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[11px]">OT &amp; Equipment</span>
              <span className="font-bold text-slate-900 text-sm mt-1 block">
                ₹{formData.breakdown.otCharges.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[11px]">Surgeon &amp; Professional Fees</span>
              <span className="font-bold text-slate-900 text-sm mt-1 block">
                ₹{formData.breakdown.professionalFees.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[11px]">Investigations &amp; Radiology</span>
              <span className="font-bold text-slate-900 text-sm mt-1 block">
                ₹{formData.breakdown.investigationFees.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[11px]">Medicines &amp; Consumables</span>
              <span className="font-bold text-slate-900 text-sm mt-1 block">
                ₹{formData.breakdown.medicinesAndConsumables.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
              <span className="text-blue-600 font-bold block text-[11px]">Total Estimated Sanction</span>
              <span className="font-extrabold text-[#102A56] text-base mt-1 block">
                ₹{formData.estimatedTotalExpense.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Section D: Document Checklist */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 block">
            Mandatory IRDAI Enclosures Verified:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {formData.requiredDocumentsChecklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">{item.docName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
