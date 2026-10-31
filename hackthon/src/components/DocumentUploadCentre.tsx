import React, { useState } from 'react';
import { UploadedDocument } from '../types';
import { documentExtractor } from '../services/documentExtractor';
import {
  FileUp,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Trash2,
  FileCheck,
  RefreshCw,
  Sparkles,
  Search,
  ChevronRight,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';

interface Props {
  documents: UploadedDocument[];
  onAddDocument: (doc: UploadedDocument) => void;
  onDeleteDocument: (id: string) => void;
  onLoadSampleDocs: () => void;
  onNavigateToCoverage: () => void;
}

export const DocumentUploadCentre: React.FC<Props> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
  onLoadSampleDocs,
  onNavigateToCoverage
}) => {
  const [selectedDocType, setSelectedDocType] = useState<UploadedDocument['documentType']>('Medical Bills');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(documents[0] || null);

  const docTypeOptions: UploadedDocument['documentType'][] = [
    'Insurance Policy',
    'Discharge Summary',
    'Medical Bills',
    'Doctor Prescription',
    'Hospital Admission Form',
    'Diagnosis Reports',
    'Identity Document'
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsProcessing(true);
    setProgressPercent(10);
    setProgressStatus('Reading uploaded file streams...');

    try {
      const result = await documentExtractor.processFile(
        file,
        selectedDocType,
        (percent, status) => {
          setProgressPercent(percent);
          setProgressStatus(status);
        }
      );

      const newDoc: UploadedDocument = {
        id: `doc_user_${Date.now()}`,
        userId: 'current_user',
        documentType: selectedDocType,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadDate: new Date().toLocaleString(),
        status: 'Extracted',
        extractedText: result.extractedText,
        confidenceScore: result.confidenceScore,
        detectedEntities: result.detectedEntities,
        missingElementsAlert: result.missingElementsAlert,
        pageCount: result.pageCount
      };

      onAddDocument(newDoc);
      setPreviewDoc(newDoc);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setProgressPercent(0);
      setProgressStatus('');
      // reset file input
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Document Upload &amp; OCR Centre</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Local browser-based text extraction &amp; optical character recognition for Indian health insurance claims
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLoadSampleDocs}
            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Rahul Sharma 4 Sample Docs</span>
          </button>
        </div>
      </div>

      {/* Upload Zone & Document Type Picker */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 mr-2">Select Document Category:</span>
          {docTypeOptions.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedDocType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDocType === type
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Drag Drop File Input */}
        <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            onChange={handleFileUpload}
            disabled={isProcessing}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform mb-3">
            <FileUp className="w-6 h-6" />
          </div>
          <span className="font-bold text-slate-900 text-sm">
            Click to upload or drag &amp; drop {selectedDocType}
          </span>
          <span className="text-xs text-slate-500 mt-1">
            Supports PDF, JPG, and PNG (Local browser-side OCR &amp; PDF.js text extractor)
          </span>
        </label>

        {/* Live Extraction Progress Indicator */}
        {isProcessing && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                {progressStatus}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Documents Grid and Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-sm">
              Uploaded Claims Dossier ({documents.length})
            </span>
            <span className="text-xs text-slate-500 font-medium">Click to inspect</span>
          </div>

          {documents.map((doc) => {
            const isSelected = previewDoc?.id === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => setPreviewDoc(doc)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/60 border-blue-500 shadow-xs ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-blue-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{doc.fileName}</h4>
                      <p className="text-[11px] text-blue-600 font-semibold">{doc.documentType}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span>{doc.fileSize}</span>
                        <span>•</span>
                        <span>{doc.uploadDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {doc.confidenceScore}% OCR
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDocument(doc.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Missing alerts tag */}
                {doc.missingElementsAlert && doc.missingElementsAlert.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-amber-700">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>{doc.missingElementsAlert[0]}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Extracted Text & Entity Inspector (7 cols) */}
        <div className="lg:col-span-7">
          {previewDoc ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    Extracted Document Content
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{previewDoc.fileName}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 block">
                    {previewDoc.confidenceScore}% Confidence
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {previewDoc.pageCount} Page(s) Scanned
                  </span>
                </div>
              </div>

              {/* Detected Key Entities Badges */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Detected Entities &amp; Claim Identifiers:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {previewDoc.detectedEntities.patientName && (
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Patient</span>
                      <span className="font-semibold text-slate-900">{previewDoc.detectedEntities.patientName}</span>
                    </div>
                  )}
                  {previewDoc.detectedEntities.hospitalName && (
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Hospital</span>
                      <span className="font-semibold text-slate-900 line-clamp-1">{previewDoc.detectedEntities.hospitalName}</span>
                    </div>
                  )}
                  {previewDoc.detectedEntities.totalAmount && (
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Identified Sum</span>
                      <span className="font-bold text-emerald-700">₹{previewDoc.detectedEntities.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {previewDoc.detectedEntities.admissionDate && (
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Admission</span>
                      <span className="font-semibold text-slate-900">{previewDoc.detectedEntities.admissionDate}</span>
                    </div>
                  )}
                  {previewDoc.detectedEntities.drName && (
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Surgeon/Doctor</span>
                      <span className="font-semibold text-slate-900 line-clamp-1">{previewDoc.detectedEntities.drName}</span>
                    </div>
                  )}
                  {previewDoc.detectedEntities.roomType && (
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Room Category</span>
                      <span className="font-semibold text-blue-700">{previewDoc.detectedEntities.roomType}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Missing elements checklist */}
              {previewDoc.missingElementsAlert && previewDoc.missingElementsAlert.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Missing Element Warnings for Claim Adjudication:
                  </span>
                  {previewDoc.missingElementsAlert.map((alert, idx) => (
                    <p key={idx} className="text-[11px] text-amber-800 pl-4">• {alert}</p>
                  ))}
                </div>
              )}

              {/* Extracted Text Box */}
              <div>
                <span className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Raw OCR / Vector Text Stream:
                </span>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed border border-slate-800">
                  {previewDoc.extractedText}
                </pre>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onNavigateToCoverage}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Compare with Policy Clauses</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Select a document on the left to inspect extracted text and entities</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
