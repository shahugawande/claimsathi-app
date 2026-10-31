import React, { useState, useEffect } from 'react';
import { FollowUpRecord, Claim } from '../types';
import {
  PhoneCall,
  Mail,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  PhoneForwarded,
  ShieldAlert,
  Play,
  RotateCcw
} from 'lucide-react';

interface Props {
  claim: Claim;
  followUps: FollowUpRecord[];
  onAddFollowUp: (record: FollowUpRecord) => void;
}

interface DialogMessage {
  speaker: 'agent' | 'user';
  name: string;
  text: string;
  time: string;
}

export const FollowUpAgent: React.FC<Props> = ({ claim, followUps, onAddFollowUp }) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'email' | 'schedule'>('voice');

  // Email template selection
  const [emailTemplateType, setEmailTemplateType] = useState<'dispute' | 'delay' | 'ombudsman'>('dispute');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSentNotice, setEmailSentNotice] = useState(false);

  // Voice Call Simulator States
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStep, setCallStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [dialogHistory, setDialogHistory] = useState<DialogMessage[]>([]);

  // Sound synthesis support check
  const hasSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const emailTemplates = {
    dispute: {
      subject: `Urgent Reconsideration: Wrongful Deduction under Claim Ref ${claim.claimReferenceNumber} (Rahul Sharma)`,
      body: `To: The Grievance Redressal Officer, Star Health & Allied Insurance Co. Ltd.
CC: grievances@mediassistindia.com

Dear Sir/Madam,

I am writing to formally dispute the arbitrary deduction of INR 90,000 on Claim Reference ${claim.claimReferenceNumber} for patient Rahul Sharma (Policy: P/161112/01/2025/008431).

As per IRDAI Standardisation Guidelines 2020 (Clause 5), no proportionate deduction is permissible when the patient occupies the entitled Single Private A/C Room. Furthermore, pre-operative investigations were certified emergency protocol by operating surgeon Dr. Vikramaditya Joshi.

Kindly confirm receipt of our attached appeal docket and update the claim status within the statutory 15-day resolution period.

Warm regards,
Rahul Sharma (+91 98201 44521)`
    },
    delay: {
      subject: `Follow-Up: Turnaround Time Delay on Pre-Auth for Claim Ref ${claim.claimReferenceNumber}`,
      body: `Dear Cashless Authorization Team,

This is regarding the cashless sanction request submitted for Rahul Sharma at City Care Multispeciality Hospital, Mumbai.

Under IRDAI cashless turnaround regulations, initial pre-authorization must be communicated within 2 hours. The patient is admitted under emergency surgical care. Please release the cashless sanction immediately to avoid delays in surgical intervention.

Docket Reference: ${claim.claimReferenceNumber}
Patient Contact: +91 98201 44521`
    },
    ombudsman: {
      subject: `Notice of Intent to Escalate: Grievance under Policy P/161112/01/2025/008431 to Insurance Ombudsman`,
      body: `To: Customer Relations & Grievance Department, Star Health

Notice is hereby served that 15 days have elapsed without reasoned resolution of our grievance regarding wrongful deduction of INR 80,250 on Claim ${claim.claimReferenceNumber}.

Unless settlement is effected within 48 hours, a formal complaint will be lodged before the Hon’ble Insurance Ombudsman, Mumbai under Rule 14 of Insurance Ombudsman Rules 2017 seeking reimbursement with 2% penal interest above bank rate as mandated by IRDAI regulations.`
    }
  };

  useEffect(() => {
    setEmailSubject(emailTemplates[emailTemplateType].subject);
    setEmailBody(emailTemplates[emailTemplateType].body);
  }, [emailTemplateType]);

  // Voice call simulation steps
  const scriptSteps = [
    {
      agent: "Thank you for calling MediAssist TPA Escalation Desk. My name is Pooja. Am I speaking with Mr. Rahul Sharma or your claim representative?",
      userPrompts: [
        "Yes, this is Rahul Sharma. I am calling regarding my Claim Reference STAR-CLM-2026-MUM-89210.",
        "Hello Pooja, I am following up on the ₹90,000 deduction on my City Care Hospital claim."
      ]
    },
    {
      agent: "Thank you Mr. Sharma. I see your claim for Laparoscopic Cholecystectomy. Our medical audit team approved ₹1,50,000 and deducted ₹50,250 for proportionate room rent and ₹30,000 for diagnostics. How can I assist you today?",
      userPrompts: [
        "Pooja, that deduction violates IRDAI Circular 194/2020. My policy schedule grants Single Private AC Room, and Room 412 is base Single Private AC.",
        "I have Dr. Joshi's certificate confirming the CT scan was an emergency diagnostic necessity, not routine OPD."
      ]
    },
    {
      agent: "I understand your point, Mr. Sharma. The system flagged the room rent as exceeding ₹5,000 per day. However, since you have the hospital room category certificate and Dr. Joshi's clinical necessity note, I can register a Priority Grievance Review for ₹80,250.",
      userPrompts: [
        "Please register the grievance review docket immediately and provide me the tracking docket ID.",
        "Kindly note the IRDAI 15-day resolution timeline applies to this reconsideration."
      ]
    },
    {
      agent: "Certainly! I have generated Grievance Docket Number GRO-MUM-88492. Our senior medical adjudicator will review the certificate within 3 business days and initiate cashless reimbursement. Is there anything else I can assist you with?",
      userPrompts: [
        "Thank you Pooja. That is all. I will follow up on Docket GRO-MUM-88492.",
        "Thank you. Please email me the confirmation receipt."
      ]
    }
  ];

  // Speech helper
  const speakText = (text: string) => {
    if (!hasSpeechSynthesis || isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const handleStartCall = () => {
    setIsCallActive(true);
    setCallStep(0);
    setCallDuration(0);
    const initialMsg: DialogMessage = {
      speaker: 'agent',
      name: 'Pooja (TPA Desk)',
      text: scriptSteps[0].agent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setDialogHistory([initialMsg]);
    speakText(scriptSteps[0].agent);
  };

  const handleEndCall = () => {
    if (hasSpeechSynthesis) window.speechSynthesis.cancel();
    setIsCallActive(false);

    // Record follow-up
    const record: FollowUpRecord = {
      id: `fu_${Date.now()}`,
      claimId: claim.id,
      type: 'Phone Call',
      date: new Date().toLocaleString(),
      recipient: 'MediAssist TPA Escalation Desk (Pooja)',
      subjectOrAgenda: 'Voice Escalation: Proportionate Room Rent & CT Disallowance',
      contentOrScript: 'Registered Priority Grievance Docket GRO-MUM-88492 for ₹80,250 reversal.',
      status: 'Completed',
      notes: 'TPA executive agreed to review Dr. Joshi certificate within 3 business days.'
    };
    onAddFollowUp(record);
  };

  const handleSelectUserResponse = (text: string) => {
    const userMsg: DialogMessage = {
      speaker: 'user',
      name: 'You (ClaimSathi Advocate)',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextStep = callStep + 1;
    const updatedHistory = [...dialogHistory, userMsg];

    if (nextStep < scriptSteps.length) {
      setCallStep(nextStep);
      const agentMsg: DialogMessage = {
        speaker: 'agent',
        name: 'Pooja (TPA Desk)',
        text: scriptSteps[nextStep].agent,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setDialogHistory([...updatedHistory, agentMsg]);
      speakText(scriptSteps[nextStep].agent);
    } else {
      setCallStep(nextStep);
      setDialogHistory(updatedHistory);
    }
  };

  // Call timer effect
  useEffect(() => {
    let timer: any;
    if (isCallActive) {
      timer = setInterval(() => setCallDuration((d) => d + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  const handleSendSimulatedEmail = () => {
    setEmailSentNotice(true);
    const record: FollowUpRecord = {
      id: `fu_email_${Date.now()}`,
      claimId: claim.id,
      type: 'Email',
      date: new Date().toLocaleString(),
      recipient: 'grievance@starhealth.in',
      subjectOrAgenda: emailSubject,
      contentOrScript: emailBody,
      status: 'Completed',
      notes: 'Formal representation emailed with medical necessity attachments.'
    };
    onAddFollowUp(record);
    setTimeout(() => setEmailSentNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
              Advocate Assistant
            </span>
            <span className="text-xs text-slate-400">• Multi-Channel Claim Resolution</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Follow-Up &amp; Voice Call Demonstration</h2>
        </div>

        {/* Tab switch */}
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('voice')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'voice' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
            <span>Voice Call Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-emerald-600" />
            <span>Follow-Up Emails</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'schedule' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>Escalation History ({followUps.length})</span>
          </button>
        </div>
      </div>

      {/* Voice Call Tab */}
      {activeTab === 'voice' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Interactive TPA Escalation Call Simulator
              </h3>
              <p className="text-xs text-slate-500">
                Practise and execute phone representation using browser voice synthesis &amp; guided advocate scripts
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                  isMuted ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
                title={isMuted ? 'Unmute Audio' : 'Mute Speech Synthesis'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isMuted ? 'Audio Muted' : 'Voice Audio Active'}</span>
              </button>
            </div>
          </div>

          {/* Call Active Screen */}
          {!isCallActive ? (
            <div className="text-center py-12 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                <PhoneCall className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Connect with MediAssist TPA Desk</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Simulate a live phone conversation to dispute the ₹90,000 deduction on Claim {claim.claimReferenceNumber}. Our AI gives you the exact phrases that win Indian claims.
                </p>
              </div>

              <button
                onClick={handleStartCall}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Interactive Voice Call Demo</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Call Header Bar */}
              <div className="bg-[#102A56] text-white p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/40">
                    <PhoneForwarded className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="font-bold text-sm block">MediAssist TPA Claims Escalation Desk</span>
                    <span className="text-[11px] text-blue-200">
                      Executive: Pooja (Senior Adjudicator) • Call Duration:{' '}
                      {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleEndCall}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  End &amp; Log Call
                </button>
              </div>

              {/* Transcript Drawer */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 max-h-72 overflow-y-auto space-y-3">
                {dialogHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.speaker === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-400 mb-0.5">
                      {msg.name} • {msg.time}
                    </span>
                    <div
                      className={`p-3 rounded-2xl max-w-lg text-xs leading-relaxed shadow-2xs ${
                        msg.speaker === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Guided Advocate Prompt Options */}
              {callStep < scriptSteps.length && (
                <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    ClaimSathi Guided Advocate Prompts (Click to Respond):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {scriptSteps[callStep].userPrompts.map((promptText, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectUserResponse(promptText)}
                        className="p-3 text-left bg-white hover:bg-blue-100/60 rounded-xl border border-blue-200 text-xs text-slate-800 font-medium transition-all shadow-2xs hover:border-blue-400"
                      >
                        "{promptText}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {callStep >= scriptSteps.length && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <span className="font-bold text-emerald-900 text-xs block">
                    Escalation Goal Achieved! Docket GRO-MUM-88492 Recorded.
                  </span>
                  <button
                    onClick={handleEndCall}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Conclude &amp; Save Call Log
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Email Generator Tab */}
      {activeTab === 'email' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">IRDAI-Compliant Follow-Up Email Templates</h3>
              <p className="text-xs text-slate-500">
                Pre-drafted communications with regulatory deadlines and legal citations
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(['dispute', 'delay', 'ombudsman'] as const).map((tmpl) => (
                <button
                  key={tmpl}
                  onClick={() => setEmailTemplateType(tmpl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    emailTemplateType === tmpl
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tmpl === 'dispute' ? 'Dispute Appeal' : tmpl === 'delay' ? 'Pre-Auth SLA Delay' : 'Ombudsman Notice'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Subject Line</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Body</label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={10}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono leading-relaxed"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {emailSentNotice ? (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Simulated Email Dispatched &amp; Logged in Docket!
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Simulated dispatch logs date, recipient, and content in your claim timeline.
                </span>
              )}

              <button
                onClick={handleSendSimulatedEmail}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Simulated Email</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule & History Tab */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Follow-Up &amp; Escalation Schedule Log</h3>
            <span className="text-xs font-bold text-blue-600">{followUps.length} Actions Logged</span>
          </div>

          <div className="space-y-3">
            {followUps.map((fu) => (
              <div key={fu.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px]">
                      {fu.type}
                    </span>
                    <span className="font-bold text-slate-800">{fu.subjectOrAgenda}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{fu.date}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{fu.contentOrScript}</p>
                {fu.notes && (
                  <p className="text-[11px] text-emerald-700 font-semibold pt-1">
                    Outcome: {fu.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
