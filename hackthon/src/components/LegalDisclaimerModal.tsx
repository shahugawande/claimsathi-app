import React from 'react';
import { ShieldAlert, X, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalDisclaimerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Regulatory & Medical Transparency Notice</h3>
              <p className="text-xs text-slate-500">ClaimSathi AI Patient Advocacy Framework</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            ClaimSathi AI operates as a <strong>patient advocacy and claim literacy decision-support engine</strong>. Please note the following statutory considerations:
          </p>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Preliminary Rule-Based Analysis:</strong> Document extraction (via PDF.js / OCR) and clause matching are performed using transparent algorithms. Results are preliminary and subject to manual insurer/TPA adjudication.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Not Legal or Medical Counsel:</strong> ClaimSathi AI does not provide formal legal representation or medical diagnoses. Always consult your treating doctor for clinical decisions and a licensed advocate for legal proceedings.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Zero External AI API Dependency:</strong> Your documents are analyzed locally in your browser environment without transmitting personal health data to external third-party LLMs.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>IRDAI Grievance Mechanism:</strong> Generated appeal letters conform to the IRDAI (Protection of Policyholders' Interests) Regulations and Insurance Ombudsman Rules 2017.
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 italic">
            By proceeding, you acknowledge that all simulated submissions and demo files are provided for educational and hackathon evaluation purposes.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
