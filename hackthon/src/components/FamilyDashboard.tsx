import React, { useState } from 'react';
import { Claim, InsurancePolicy, UserProfile } from '../types';
import {
  Users,
  HeartHandshake,
  Share2,
  Phone,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Languages,
  Copy,
  Check
} from 'lucide-react';

interface Props {
  claim: Claim;
  policy: InsurancePolicy;
  profile: UserProfile;
  onNavigateToTracking: () => void;
  onNavigateToDenial: () => void;
}

export const FamilyDashboard: React.FC<Props> = ({
  claim,
  policy,
  profile,
  onNavigateToTracking,
  onNavigateToDenial
}) => {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [copiedShare, setCopiedShare] = useState(false);

  const isHindi = lang === 'hi';

  const shareText = isHindi
    ? `🏥 *क्लेम साथी अपडेट - राहुल शर्मा*
• अस्पताल: ${claim.hospitalName}
• कुल बिल: ₹${claim.claimedAmount.toLocaleString('en-IN')}
• स्वीकृत राशि: ₹${claim.approvedAmount.toLocaleString('en-IN')}
• विवादित राशि: ₹${claim.disputedAmount.toLocaleString('en-IN')}
• वर्तमान स्थिति: आंशिक स्वीकृति (अपील प्रक्रिया जारी)
• सहायता हेल्पलाइन: 1800-425-2255`
    : `🏥 *ClaimSathi Family Update - ${claim.patientName}*
• Hospital: ${claim.hospitalName}
• Total Billed: ₹${claim.claimedAmount.toLocaleString('en-IN')}
• Amount Approved: ₹${claim.approvedAmount.toLocaleString('en-IN')}
• Amount Disputed: ₹${claim.disputedAmount.toLocaleString('en-IN')}
• Current Status: Under Active Reconsideration Appeal
• Support: 1800-425-2255`;

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Welcome & Language Toggle */}
      <div className="bg-gradient-to-r from-[#102A56] via-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">
                {isHindi ? 'परिवार क्लेम स्थिति केंद्र' : 'Family Care Status Dashboard'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[10px] font-bold">
                {isHindi ? 'सरल भाषा' : 'Jargon-Free View'}
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              {isHindi
                ? 'मरीज़ के परिजनों के लिए आसान और पारदर्शी दावा विवरण'
                : 'Clear, transparent claim updates designed for patients and their loved ones'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl backdrop-blur-xs border border-white/20">
          <Languages className="w-3.5 h-3.5 text-amber-300 ml-1.5" />
          <button
            onClick={() => setLang('en')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              !isHindi ? 'bg-white text-slate-900 shadow-xs' : 'text-blue-100 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              isHindi ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-blue-100 hover:text-white'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Primary Big Numbers Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'दावा संदर्भ संख्या' : 'Claim Reference Docket'}
            </span>
            <h3 className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
              {claim.claimReferenceNumber}
            </h3>
          </div>

          <div className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{isHindi ? 'आंशिक स्वीकृत (अपील जारी)' : 'Partially Approved (Appeal Active)'}</span>
          </div>
        </div>

        {/* 3 Main Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block">
              {isHindi ? 'कुल अस्पताल बिल' : 'Total Hospital Bill'}
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₹{claim.claimedAmount.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {isHindi ? 'अस्पताल द्वारा प्रस्तुत' : 'Submitted by City Care Hospital'}
            </span>
          </div>

          <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200">
            <span className="text-xs font-semibold text-emerald-800 block">
              {isHindi ? 'बीमा कंपनी से प्राप्त राशि' : 'Amount Paid By Insurer'}
            </span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              ₹{claim.approvedAmount.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">
              {isHindi ? 'बिना किसी रुकावट के पास' : 'Direct cashless sanction cleared'}
            </span>
          </div>

          <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200">
            <span className="text-xs font-semibold text-rose-800 block">
              {isHindi ? 'विवादित / काटी गई राशि' : 'Deducted / Disputed Amount'}
            </span>
            <div className="text-2xl font-black text-rose-600 mt-1">
              ₹{claim.disputedAmount.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-rose-700 font-bold block mt-0.5">
              {isHindi ? 'क्लेम साथी टीम लड़ रही है' : 'Under recovery appeal'}
            </span>
          </div>
        </div>

        {/* Plain Language Summary Box */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1.5 leading-relaxed">
          <span className="font-bold flex items-center gap-1.5 text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600" />
            {isHindi ? 'स्थिति का सरल विवरण:' : 'What This Means For Your Family:'}
          </span>
          <p>
            {isHindi
              ? `स्टार हेल्थ ने अस्पताल के कुल ₹2,40,000 के बिल में से ₹1,50,000 स्वीकृत कर दिए हैं। शेष ₹90,000 कमरे के किराए और जांच के नाम पर काटे गए हैं। क्लेम साथी कानूनी नियमों (IRDAI 2020) के तहत इस ₹90,000 की पूरी वापसी के लिए आधिकारिक अपील दर्ज कर चुका है।`
              : `Star Health has approved ₹1,50,000 towards your hospital bill. The remaining ₹90,000 was deducted citing room rent and diagnostic tests. ClaimSathi AI has prepared an official grievance appeal under IRDAI 2020 guidelines to recover these deducted funds.`}
          </p>
        </div>

        {/* WhatsApp Share Card */}
        <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="font-bold text-emerald-950 text-xs block">
              {isHindi ? 'व्हाट्सएप पर परिवार के साथ साझा करें' : 'Share Status Update on WhatsApp'}
            </span>
            <p className="text-[11px] text-emerald-800">
              {isHindi
                ? 'रिश्तेदारों को एक क्लिक में पूरी जानकारी भेजें'
                : '1-click summary card ready to send to spouse, parents, or family group'}
            </p>
          </div>

          <button
            onClick={handleCopyShare}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedShare ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'मैसेज कॉपी करें' : 'Copy WhatsApp Card')}</span>
          </button>
        </div>
      </div>

      {/* Emergency & Hospital Contacts */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">
          {isHindi ? 'महत्वपूर्ण आपातकालीन एवं दावा संपर्क' : 'Important Support Contacts & Hotlines'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 block text-[10px]">
              {isHindi ? 'अस्पताल टीपीए डेस्क' : 'Hospital TPA Desk'}
            </span>
            <span className="font-bold text-slate-800 block">City Care Cashless Desk</span>
            <span className="font-semibold text-blue-700 block">+91 22 2684 9900</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 block text-[10px]">
              {isHindi ? 'बीमा कंपनी टोल फ्री' : 'Insurer Toll-Free'}
            </span>
            <span className="font-bold text-slate-800 block">MediAssist Escalations</span>
            <span className="font-semibold text-blue-700 block">1800-425-2255</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 block text-[10px]">
              {isHindi ? 'नामित व्यक्ति (नॉमिनी)' : 'Registered Family Nominee'}
            </span>
            <span className="font-bold text-slate-800 block">{profile.nomineeName} ({profile.nomineeRelation})</span>
            <span className="font-semibold text-blue-700 block">{profile.nomineePhone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
