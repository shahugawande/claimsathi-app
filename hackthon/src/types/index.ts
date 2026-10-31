export type ClaimStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Additional Documents Required'
  | 'Partially Approved'
  | 'Approved'
  | 'Rejected'
  | 'Settled';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  abhaId?: string; // Ayushman Bharat Health Account ID
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  city: string;
  nomineeName: string;
  nomineeRelation: string;
  nomineePhone: string;
  primaryInsurer: string;
  tpaName?: string;
  createdAt: string;
}

export interface PolicyClause {
  id: string;
  policyId: string;
  clauseNumber: string;
  title: string;
  category: 'Room Rent' | 'Waiting Period' | 'Exclusion' | 'Co-Pay' | 'Pre-Post Hosp' | 'Daycare' | 'General';
  pageNumber: number;
  clauseText: string;
  summary: string;
  interpretationGuide: string;
  irdaGuidelinesReference?: string;
}

export interface InsurancePolicy {
  id: string;
  userId: string;
  policyNumber: string;
  policyholderName: string;
  insuranceCompany: string;
  tpaName: string;
  productName: string;
  sumInsured: number;
  cumulativeBonus: number;
  validFrom: string;
  validUpto: string;
  roomRentLimitType: 'Percentage' | 'Single Private AC' | 'No Limit' | 'Capped Amount';
  roomRentLimitValue: number; // e.g., 1% of SI or exact Rs
  icuRentLimit: string;
  preHospDays: number;
  postHospDays: number;
  coPayPercentage: number;
  preExistingWaitingMonths: number;
  specificAilmentWaitingMonths: number;
  exclusionsList: string[];
  clauses: PolicyClause[];
  sourceDocumentName?: string;
}

export interface UploadedDocument {
  id: string;
  userId: string;
  claimId?: string;
  documentType:
    | 'Insurance Policy'
    | 'Hospital Admission Form'
    | 'Discharge Summary'
    | 'Doctor Prescription'
    | 'Diagnosis Reports'
    | 'Medical Bills'
    | 'Identity Document';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'Ready' | 'Processing OCR' | 'Extracted' | 'Error';
  extractedText: string;
  confidenceScore: number;
  detectedEntities: {
    patientName?: string;
    hospitalName?: string;
    admissionDate?: string;
    dischargeDate?: string;
    diagnosis?: string;
    totalAmount?: number;
    drName?: string;
    roomType?: string;
    policyNumber?: string;
  };
  missingElementsAlert?: string[];
  pageCount: number;
}

export interface BillLineItem {
  id: string;
  category: 'Room Rent' | 'ICU' | 'Surgeon Fees' | 'Investigations' | 'Medicines' | 'Consumables' | 'OT Charges' | 'Administrative';
  description: string;
  amount: number;
  coveredAmount: number;
  disputedAmount: number;
  coverageStatus: 'Fully Covered' | 'Partially Covered' | 'Excluded' | 'Needs Clarification';
  policyClauseRef?: string;
  reason: string;
}

export interface PreAuthorisationForm {
  id: string;
  claimId: string;
  patientName: string;
  gender: string;
  age: number;
  contactNumber: string;
  policyNumber: string;
  tpaId: string;
  hospitalName: string;
  hospitalAddress: string;
  treatingDoctorName: string;
  doctorRegistrationNo: string;
  dateOfAdmission: string;
  provisionalDiagnosis: string;
  icdCode: string;
  proposedTreatment: string;
  treatmentType: 'Medical' | 'Surgical' | 'Intensive Care' | 'Day Care';
  roomTypeRequested: string;
  estimatedHospitalStayDays: number;
  estimatedTotalExpense: number;
  breakdown: {
    roomRent: number;
    icuRent: number;
    otCharges: number;
    professionalFees: number;
    investigationFees: number;
    medicinesAndConsumables: number;
  };
  requiredDocumentsChecklist: {
    docName: string;
    attached: boolean;
  }[];
  generatedAt: string;
  status: 'Draft' | 'Sent to TPA' | 'Approved' | 'Query Raised';
}

export interface DenialAnalysis {
  id: string;
  claimId: string;
  rejectionReasonOriginal: string;
  rejectionCode: string;
  disputedAmount: number;
  matchedPolicyClause: {
    clauseNumber: string;
    pageNumber: number;
    text: string;
  };
  medicalEvidenceFound: string[];
  disputeGrounds: string[];
  successProbabilityPercentage: number;
  recommendations: string[];
  requiredEvidenceDocuments: string[];
  irdaiPrecedentNotes: string;
}

export interface Claim {
  id: string;
  userId: string;
  claimReferenceNumber: string;
  patientName: string;
  hospitalName: string;
  admissionDate: string;
  dischargeDate: string;
  diagnosis: string;
  treatment: string;
  claimType: 'Cashless' | 'Reimbursement';
  status: ClaimStatus;
  claimedAmount: number;
  approvedAmount: number;
  disputedAmount: number;
  settledAmount: number;
  submissionDate: string;
  lastUpdated: string;
  denialReason?: string;
  denialAnalysis?: DenialAnalysis;
  preAuthData?: PreAuthorisationForm;
  billItems: BillLineItem[];
  timeline: {
    id: string;
    title: string;
    date: string;
    description: string;
    actor: 'Hospital' | 'TPA Desk' | 'Insurer' | 'ClaimSathi AI' | 'Patient';
    statusType: 'info' | 'warning' | 'success' | 'danger';
  }[];
}

export interface AppealLetter {
  id: string;
  claimId: string;
  recipientName: string;
  recipientDesignation: string;
  insuranceCompany: string;
  tpaName: string;
  groAddress: string;
  patientName: string;
  policyNumber: string;
  claimReferenceNumber: string;
  dateOfAppeal: string;
  subject: string;
  summaryOfEvents: string;
  groundsForAppeal: {
    groundTitle: string;
    policyClauseCited: string;
    medicalFact: string;
    legalOrIrdaPrecedent: string;
  }[];
  demandedReliefAmount: number;
  listOfEnclosures: string[];
  signatureName: string;
  status: 'Draft' | 'Sent' | 'Under Review by GRO' | 'Reversed & Approved';
}

export interface FollowUpRecord {
  id: string;
  claimId: string;
  type: 'Email' | 'Phone Call' | 'Portal Reminder' | 'Ombudsman Escalation';
  date: string;
  recipient: string;
  subjectOrAgenda: string;
  contentOrScript: string;
  status: 'Scheduled' | 'Completed' | 'Pending Response';
  notes?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'success' | 'info';
  read: boolean;
  actionRoute?: string;
}
