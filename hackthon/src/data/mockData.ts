import {
  UserProfile,
  InsurancePolicy,
  Claim,
  UploadedDocument,
  AppealLetter,
  FollowUpRecord,
  AppNotification
} from '../types';

export const DEMO_USER_PROFILE: UserProfile = {
  id: 'usr_rahul_01',
  fullName: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 98201 44521',
  abhaId: '91-4821-3901-5520',
  age: 38,
  gender: 'Male',
  city: 'Mumbai, Maharashtra',
  nomineeName: 'Priya Sharma',
  nomineeRelation: 'Spouse',
  nomineePhone: '+91 98201 44522',
  primaryInsurer: 'Star Health & Allied Insurance',
  tpaName: 'MediAssist TPA Pvt Ltd',
  createdAt: '2025-01-15T10:00:00Z',
};

export const DEMO_POLICY: InsurancePolicy = {
  id: 'pol_sharma_001',
  userId: 'usr_rahul_01',
  policyNumber: 'P/161112/01/2025/008431',
  policyholderName: 'Rahul Sharma',
  insuranceCompany: 'Star Health & Allied Insurance Co. Ltd.',
  tpaName: 'MediAssist Insurance TPA',
  productName: 'Star Comprehensive Health Insurance Plan (Gold)',
  sumInsured: 500000,
  cumulativeBonus: 100000,
  validFrom: '2025-04-01',
  validUpto: '2026-03-31',
  roomRentLimitType: 'Single Private AC',
  roomRentLimitValue: 5000, // Policy wording: "Single standard private A/C room or up to 1% of Sum Insured per day"
  icuRentLimit: 'Up to 2% of Sum Insured or Actuals',
  preHospDays: 60,
  postHospDays: 90,
  coPayPercentage: 0,
  preExistingWaitingMonths: 36,
  specificAilmentWaitingMonths: 24,
  exclusionsList: [
    'Cosmetic or plastic surgery unless necessitated by accidental injuries',
    'Dietary supplements, vitamins unless prescribed with active parenteral line',
    'Experimental and unproven treatments',
    'IRDAI Non-Payable List (Gloves, Aprons, Surcharge, Administration charges)'
  ],
  clauses: [
    {
      id: 'cl_01',
      policyId: 'pol_sharma_001',
      clauseNumber: 'Clause 3.2.1',
      title: 'Room Rent and Accommodation Eligibility',
      category: 'Room Rent',
      pageNumber: 8,
      clauseText: 'Room, boarding, and nursing expenses as provided by the Hospital/Nursing Home: Up to Single Private A/C Room. If the Insured opts for a room category higher than the eligible room type, proportionate deductions shall apply only to room-associated associate charges.',
      summary: 'Insured is entitled to Single Private A/C room without financial cap or penalty.',
      interpretationGuide: 'If the patient stayed in a standard Single Private AC Room, the insurer CANNOT invoke proportionate deduction even if the daily tariff exceeds 1% of Sum Insured, as per IRDAI Guidelines 2020 on Standardisation of Exclusions.',
      irdaGuidelinesReference: 'IRDAI/HLT/REG/CIR/194/07/2020 Section 5'
    },
    {
      id: 'cl_02',
      policyId: 'pol_sharma_001',
      clauseNumber: 'Clause 4.3',
      title: 'Emergency Medical & Diagnostic Investigations',
      category: 'Pre-Post Hosp',
      pageNumber: 14,
      clauseText: 'Investigations directly relating to the condition for which hospitalisation was warranted are covered under pre-hospitalisation (60 days) and in-hospital stay, provided they are recommended by the attending specialist with clinical justification.',
      summary: 'Emergency pre-operative blood panels, abdominal CT/USG, and cardiac clearance are fully payable.',
      interpretationGuide: 'Insurer often marks routine pre-operative cardiac and liver workup as "unwarranted investigation". An attending physician certification of medical necessity refutes this denial under IRDAI fair claims practice.',
      irdaGuidelinesReference: 'IRDAI Master Circular Clause 12.4'
    },
    {
      id: 'cl_03',
      policyId: 'pol_sharma_001',
      clauseNumber: 'Clause 5.1',
      title: 'Specific Illness Waiting Period',
      category: 'Waiting Period',
      pageNumber: 17,
      clauseText: 'A waiting period of 24 months of continuous coverage applies to Gallbladder stones, hernia, hydrocele, cataract, and benign prostatic hypertrophy.',
      summary: '24-month waiting period applies for Cholecystectomy.',
      interpretationGuide: 'Policy inception is April 2022 (renewed continuously for 3+ years). Hence the 24-month waiting period has been fully served.',
      irdaGuidelinesReference: 'IRDAI Section 6 Waiting Periods'
    },
    {
      id: 'cl_04',
      policyId: 'pol_sharma_001',
      clauseNumber: 'Clause 7.4',
      title: 'Non-Medical Consumables',
      category: 'Exclusion',
      pageNumber: 22,
      clauseText: 'Charges for items listed in IRDAI Annexure I (Non-medical expenses like gloves, cotton, admission folders, food for attendants) are non-payable by the Company.',
      summary: 'Routine hospital convenience consumables are out of pocket unless optional rider is attached.',
      interpretationGuide: 'Only true non-medical items can be deducted. Surgical consumables directly required for laparoscopic trocars cannot be clubbed into non-payable list.',
      irdaGuidelinesReference: 'IRDAI Annexure I (Items not payable)'
    }
  ],
  sourceDocumentName: 'Star_Comprehensive_Policy_Wording_2024.pdf'
};

export const DEMO_UPLOADED_DOCUMENTS: UploadedDocument[] = [
  {
    id: 'doc_01',
    userId: 'usr_rahul_01',
    claimId: 'clm_rahul_2026',
    documentType: 'Insurance Policy',
    fileName: 'Star_Health_Policy_Schedule_RahulSharma.pdf',
    fileSize: '2.4 MB',
    uploadDate: '2026-10-10 11:20 AM',
    status: 'Extracted',
    confidenceScore: 98,
    detectedEntities: {
      patientName: 'Rahul Sharma',
      totalAmount: 500000,
    },
    extractedText: 'STAR HEALTH AND ALLIED INSURANCE CO LTD\nPolicy No: P/161112/01/2025/008431\nPolicyholder: Rahul Sharma | Age: 38 | Gender: Male\nSum Insured: INR 5,00,000 + Cumulative Bonus: INR 1,00,000\nPeriod of Insurance: 01/04/2025 to 31/03/2026\nEligible Room Category: Single Private A/C Room\nCo-pay: Nil. TPA: In-house / MediAssist.',
    pageCount: 16
  },
  {
    id: 'doc_02',
    userId: 'usr_rahul_01',
    claimId: 'clm_rahul_2026',
    documentType: 'Discharge Summary',
    fileName: 'City_Care_Hospital_Discharge_Summary_Rahul.pdf',
    fileSize: '1.8 MB',
    uploadDate: '2026-10-22 03:45 PM',
    status: 'Extracted',
    confidenceScore: 96,
    detectedEntities: {
      patientName: 'Rahul Sharma',
      hospitalName: 'City Care Multispeciality Hospital, Andheri West, Mumbai',
      admissionDate: '2026-10-18',
      dischargeDate: '2026-10-21',
      diagnosis: 'Acute Calculus Cholecystitis with symptomatic multiple Cholelithiasis (Gallstones)',
      drName: 'Dr. Vikramaditya Joshi, MS, FRCS (GI Surgery)'
    },
    extractedText: 'CITY CARE MULTISPECIALITY HOSPITAL\nDISCHARGE SUMMARY\nPatient: Mr. Rahul Sharma | UHID: CC-2026-88912 | Age: 38 M\nDate of Admission: 18-Oct-2026 09:30 AM | Date of Discharge: 21-Oct-2026 02:00 PM\nChief Complaints: Severe right upper quadrant abdominal pain radiating to back with vomiting for 2 days.\nDiagnosis: Acute Calculus Cholecystitis (ICD-10: K80.00)\nProcedure Performed: Laparoscopic Cholecystectomy under General Anaesthesia on 19-Oct-2026.\nOperative Findings: Distended inflamed gallbladder with multiple calculi, cystic duct oedematous.\nRoom Type Occupied: Standard Single Private A/C Room No. 412.\nAttending Surgeon: Dr. Vikramaditya Joshi, Reg No: MMC 2004/08/3120.\nPost-op Course: Uneventful, patient hemodynamically stable, discharged with oral analgesics.',
    pageCount: 3
  },
  {
    id: 'doc_03',
    userId: 'usr_rahul_01',
    claimId: 'clm_rahul_2026',
    documentType: 'Medical Bills',
    fileName: 'Final_Breakup_Bill_CityCare_240000.pdf',
    fileSize: '3.1 MB',
    uploadDate: '2026-10-22 04:00 PM',
    status: 'Extracted',
    confidenceScore: 99,
    detectedEntities: {
      hospitalName: 'City Care Multispeciality Hospital',
      totalAmount: 240000,
    },
    extractedText: 'FINAL INPATIENT BILL SUMMARY\nBill No: CCB/2026/10/4491 | Date: 21-Oct-2026\nPatient Name: Rahul Sharma | Room: Single Private A/C 412 (3 Days)\n1. Room & Nursing Charges (3 days @ Rs 8,000/day): Rs 24,000\n2. OT Charges & Laparoscopic Equipment: Rs 45,000\n3. Surgeon & Anaesthetist Professional Fees: Rs 85,000\n4. Diagnostic Investigations (CT Abdomen, USG, Cardiac clearance): Rs 35,000\n5. Pharmacy & Inpatient Medicines: Rs 38,000\n6. Surgical Consumables & Non-Medical items: Rs 13,000\nTOTAL BILL AMOUNT: Rs 2,40,000\nAmount Claimed: Rs 2,40,000.',
    pageCount: 5
  },
  {
    id: 'doc_04',
    userId: 'usr_rahul_01',
    claimId: 'clm_rahul_2026',
    documentType: 'Doctor Prescription',
    fileName: 'Surgical_Recommendation_DrJoshi.pdf',
    fileSize: '820 KB',
    uploadDate: '2026-10-22 04:15 PM',
    status: 'Extracted',
    confidenceScore: 94,
    detectedEntities: {
      drName: 'Dr. Vikramaditya Joshi',
      diagnosis: 'Acute Cholecystitis with Gallstones'
    },
    extractedText: 'PRESCRIPTION & EMERGENCY ADMISSION NOTE\nDate: 18-Oct-2026\nPatient presented in severe acute abdominal distress. USG abdomen shows thickened GB wall (4.8mm) with multiple impacted calculi in cystic neck. High risk of perforation/empyema. Emergency admission and Laparoscopic Cholecystectomy advised under GA.\nAll pre-operative cardiac and CT evaluations medically necessary for emergency surgical fitness.',
    pageCount: 1
  }
];

export const DEMO_CLAIM: Claim = {
  id: 'clm_rahul_2026',
  userId: 'usr_rahul_01',
  claimReferenceNumber: 'STAR-CLM-2026-MUM-89210',
  patientName: 'Rahul Sharma',
  hospitalName: 'City Care Multispeciality Hospital, Mumbai',
  admissionDate: '2026-10-18',
  dischargeDate: '2026-10-21',
  diagnosis: 'Acute Calculus Cholecystitis (Gallstones)',
  treatment: 'Laparoscopic Cholecystectomy under General Anaesthesia',
  claimType: 'Cashless',
  status: 'Partially Approved',
  claimedAmount: 240000,
  approvedAmount: 150000,
  disputedAmount: 90000,
  settledAmount: 150000,
  submissionDate: '2026-10-19',
  lastUpdated: '2026-10-24',
  denialReason: '1. Deducted ₹50,000 citing proportionate room rent deduction (Insurer claimed Room Rent cap of 1% i.e. ₹5,000/day applied against ₹8,000/day billed).\n2. Deducted ₹30,000 for Pre-operative CT and Cardiac Investigations as "unwarranted/routine OPD evaluation".\n3. Deducted ₹10,000 for non-medical consumables.',
  billItems: [
    {
      id: 'bi_01',
      category: 'Room Rent',
      description: 'Single Private A/C Room (3 days @ ₹8,000/day)',
      amount: 24000,
      coveredAmount: 15000,
      disputedAmount: 9000,
      coverageStatus: 'Partially Covered',
      policyClauseRef: 'Clause 3.2.1',
      reason: 'Insurer capped at 1% of Sum Insured (₹5,000/day) despite policy wording stating Single Private AC Room is permitted without numeric cap.'
    },
    {
      id: 'bi_02',
      category: 'Surgeon Fees',
      description: 'Lead GI Surgeon & Laparoscopic Specialist Fees',
      amount: 65000,
      coveredAmount: 40625,
      disputedAmount: 24375,
      coverageStatus: 'Partially Covered',
      policyClauseRef: 'Clause 3.2.1 Proportionate Clause',
      reason: 'Proportionate deduction wrongly applied by TPA because room rent was deemed higher than 1%.'
    },
    {
      id: 'bi_03',
      category: 'OT Charges',
      description: 'Operation Theatre & High-Definition Laparoscopy Tower charges',
      amount: 45000,
      coveredAmount: 28125,
      disputedAmount: 16875,
      coverageStatus: 'Partially Covered',
      policyClauseRef: 'Clause 3.2.1 Proportionate Clause',
      reason: 'Proportionate deduction cascading on OT facilities.'
    },
    {
      id: 'bi_04',
      category: 'Investigations',
      description: 'Emergency Tri-phase CT Abdomen, Blood workup & Cardiac clearance',
      amount: 35000,
      coveredAmount: 5000,
      disputedAmount: 30000,
      coverageStatus: 'Partially Covered',
      policyClauseRef: 'Clause 4.3',
      reason: 'TPA disallowed ₹30,000 stating investigations were routine and could be OPD.'
    },
    {
      id: 'bi_05',
      category: 'Medicines',
      description: 'IV Antibiotics (Meropenem), Analgesics, IV Fluids & Anaesthetics',
      amount: 38000,
      coveredAmount: 38000,
      disputedAmount: 0,
      coverageStatus: 'Fully Covered',
      policyClauseRef: 'Clause 2.1',
      reason: 'Standard active in-hospital medical management.'
    },
    {
      id: 'bi_06',
      category: 'Consumables',
      description: 'Sterile surgical drapes, trocars, gloves, disposal kits, admin fee',
      amount: 13000,
      coveredAmount: 3250,
      disputedAmount: 9750,
      coverageStatus: 'Excluded',
      policyClauseRef: 'Clause 7.4',
      reason: 'Non-medical consumables under IRDAI Annexure I (partially valid exclusion).'
    },
    {
      id: 'bi_07',
      category: 'Surgeon Fees',
      description: 'Consultant Anaesthesiologist charges',
      amount: 20000,
      coveredAmount: 20000,
      disputedAmount: 0,
      coverageStatus: 'Fully Covered',
      policyClauseRef: 'Clause 3.1',
      reason: 'Covered under in-patient surgical intervention.'
    }
  ],
  denialAnalysis: {
    id: 'da_rahul_01',
    claimId: 'clm_rahul_2026',
    rejectionReasonOriginal: 'Deduction of ₹50,250 under Proportionate Room Rent (Clause 3.2.1) + ₹30,000 for Pre-Op Diagnostic Investigations not medically required (Clause 4.3) + ₹9,750 Non-medical expenses.',
    rejectionCode: 'DENIAL-PROP-RENT-INVEST-091',
    disputedAmount: 90000,
    matchedPolicyClause: {
      clauseNumber: 'Clause 3.2.1 & Clause 4.3',
      pageNumber: 8,
      text: 'Up to Single Private A/C Room without capping. Associate charges shall not be subjected to proportionate deduction when the room availed matches the policy schedule.'
    },
    medicalEvidenceFound: [
      'Discharge Summary explicitly records room availed: "Standard Single Private A/C Room No. 412"',
      'Hospital Admission & Billing Certificate confirms no suite or deluxe category upgrade',
      'Dr. Vikramaditya Joshi (Surgeon) signed letter confirming CT Abdomen was emergency protocol due to acute inflammatory gallbladder and risk of empyema',
      'Continuous health insurance coverage since April 2022 (over 42 months), well past the 24-month cholecystitis waiting period'
    ],
    disputeGrounds: [
      'IRDAI Guidelines on Standardisation (Circular IRDAI/HLT/REG/CIR/194/07/2020) forbid insurers from applying proportionate deduction when patient stays in the entitled Single Private AC room.',
      'Hon’ble Supreme Court of India in Gurmel Singh vs Branch Manager ruled that procedural hyper-technicalities cannot defeat genuine medical reimbursement.',
      'Treating surgeon is the sole authority to determine diagnostic necessity during acute surgical emergencies.'
    ],
    successProbabilityPercentage: 88,
    recommendations: [
      'Submit formal grievance appeal to Star Health Grievance Redressal Officer (GRO) citing Clause 3.2.1 and IRDAI Circular.',
      'Attach treating doctor’s Certificate of Medical Necessity for CT Abdomen.',
      'Demand reversal of ₹80,250 (Room rent proportionate deduction + Investigations). Note: ₹9,750 non-medical consumables can be conceded as per IRDAI list.',
      'If not resolved in 15 days, escalate directly to the Mumbai Insurance Ombudsman.'
    ],
    requiredEvidenceDocuments: [
      'Doctor Certificate of Medical Necessity for Emergency CT & Cardiac clearance',
      'Hospital Category Certification stating Room 412 is base Single Private AC Room',
      'Copy of Policy Schedule confirming "Single Private A/C Room" eligibility'
    ],
    irdaiPrecedentNotes: 'IRDAI Ombudsman Award Ref: OMB/MUM/A/2023-24/0912 held that insurers cannot enforce a hidden 1% ceiling when the policy schedule specifies "Single Private AC Room" as an entitled category.'
  },
  preAuthData: {
    id: 'pa_rahul_01',
    claimId: 'clm_rahul_2026',
    patientName: 'Rahul Sharma',
    gender: 'Male',
    age: 38,
    contactNumber: '+91 98201 44521',
    policyNumber: 'P/161112/01/2025/008431',
    tpaId: 'MA-MUM-99120',
    hospitalName: 'City Care Multispeciality Hospital',
    hospitalAddress: 'S.V. Road, Andheri West, Mumbai - 400058',
    treatingDoctorName: 'Dr. Vikramaditya Joshi',
    doctorRegistrationNo: 'MMC 2004/08/3120',
    dateOfAdmission: '2026-10-18',
    provisionalDiagnosis: 'Acute Calculus Cholecystitis with multiple gallstones',
    icdCode: 'K80.00',
    proposedTreatment: 'Emergency Laparoscopic Cholecystectomy',
    treatmentType: 'Surgical',
    roomTypeRequested: 'Single Private A/C Room',
    estimatedHospitalStayDays: 3,
    estimatedTotalExpense: 240000,
    breakdown: {
      roomRent: 24000,
      icuRent: 0,
      otCharges: 45000,
      professionalFees: 85000,
      investigationFees: 35000,
      medicinesAndConsumables: 51000
    },
    requiredDocumentsChecklist: [
      { docName: 'Health Insurance Card / Policy Schedule', attached: true },
      { docName: 'Aadhaar / Government ID of Patient', attached: true },
      { docName: 'Doctor Emergency Admission & Prescription note', attached: true },
      { docName: 'Ultrasound (USG) Abdomen Scan Report', attached: true },
      { docName: 'Cost Estimate Breakdown on Hospital Letterhead', attached: true }
    ],
    generatedAt: '2026-10-18 10:15 AM',
    status: 'Approved'
  },
  timeline: [
    {
      id: 'tl_01',
      title: 'Emergency Admission & Pre-Auth Request',
      date: '2026-10-18 10:30 AM',
      description: 'Pre-authorisation form generated via ClaimSathi AI and submitted to MediAssist TPA desk at City Care Hospital.',
      actor: 'ClaimSathi AI',
      statusType: 'info'
    },
    {
      id: 'tl_02',
      title: 'Initial Cashless Approval Granted',
      date: '2026-10-18 01:15 PM',
      description: 'TPA approved initial cashless sanction of ₹1,00,000 for emergency admission.',
      actor: 'TPA Desk',
      statusType: 'success'
    },
    {
      id: 'tl_03',
      title: 'Surgery Performed Successfully',
      date: '2026-10-19 11:00 AM',
      description: 'Laparoscopic Cholecystectomy performed by Dr. Vikramaditya Joshi. Post-op recovery in Room 412.',
      actor: 'Hospital',
      statusType: 'info'
    },
    {
      id: 'tl_04',
      title: 'Final Bill & Discharge Submitted',
      date: '2026-10-21 02:30 PM',
      description: 'Hospital submitted final invoice of ₹2,40,000 to MediAssist TPA for final cashless enhancement.',
      actor: 'Hospital',
      statusType: 'info'
    },
    {
      id: 'tl_05',
      title: 'Partial Settlement with ₹90,000 Deduction',
      date: '2026-10-21 07:10 PM',
      description: 'TPA approved ₹1,50,000 and issued deduction sheet of ₹90,000 citing proportionate room rent and non-essential investigations. Patient had to pay ₹90,000 out-of-pocket to secure discharge.',
      actor: 'Insurer',
      statusType: 'danger'
    },
    {
      id: 'tl_06',
      title: 'ClaimSathi Denial Engine Triggered',
      date: '2026-10-22 10:00 AM',
      description: 'Rule-based engine matched deductions against Clause 3.2.1 and IRDAI 2020 Circular. 88% win probability identified for ₹80,250 recovery.',
      actor: 'ClaimSathi AI',
      statusType: 'warning'
    },
    {
      id: 'tl_07',
      title: 'Appeal Letter Drafted for Grievance Officer',
      date: '2026-10-24 11:30 AM',
      description: 'Formal 3-page legal appeal generated with supporting doctor certification, ready for submission to Star Health Grievance Redressal Cell.',
      actor: 'ClaimSathi AI',
      statusType: 'info'
    }
  ]
};

export const DEMO_APPEAL_LETTER: AppealLetter = {
  id: 'app_rahul_01',
  claimId: 'clm_rahul_2026',
  recipientName: 'The Grievance Redressal Officer (GRO)',
  recipientDesignation: 'Chief Grievance Manager, Customer Care Dept.',
  insuranceCompany: 'Star Health and Allied Insurance Co. Ltd.',
  tpaName: 'MediAssist Insurance TPA Pvt. Ltd.',
  groAddress: '1, New Tank Street, Valluvar Kottam High Road, Nungambakkam, Chennai - 600034',
  patientName: 'Rahul Sharma',
  policyNumber: 'P/161112/01/2025/008431',
  claimReferenceNumber: 'STAR-CLM-2026-MUM-89210',
  dateOfAppeal: '2026-10-24',
  subject: 'URGENT GRIEVANCE: Wrongful Deduction of ₹90,000 under Claim Ref: STAR-CLM-2026-MUM-89210 – Violation of Clause 3.2.1 and IRDAI Standardisation Guidelines 2020',
  summaryOfEvents: 'I was admitted to City Care Multispeciality Hospital, Mumbai on 18-Oct-2026 under emergency circumstances for Acute Calculus Cholecystitis and underwent Laparoscopic Cholecystectomy under Dr. Vikramaditya Joshi. The hospital raised a legitimate total bill of ₹2,40,000. However, the Third Party Administrator (MediAssist) arbitrarily sanctioned only ₹1,50,000, forcing me to pay ₹90,000 out-of-pocket upon discharge under financial duress.',
  groundsForAppeal: [
    {
      groundTitle: 'Ground 1: Erroneous Proportionate Deduction (Disputed: ₹50,250)',
      policyClauseCited: 'Policy Schedule & Clause 3.2.1 (Page 8)',
      medicalFact: 'I occupied Room 412, which is categorized by City Care Hospital as a standard "Single Private A/C Room" – exactly matching the entitled category stated in my policy schedule.',
      legalOrIrdaPrecedent: 'Under IRDAI Guidelines Ref: IRDAI/HLT/REG/CIR/194/07/2020 (Clause 5), insurers are explicitly prohibited from applying proportionate associate deductions when the policyholder occupies their entitled room category. Imposing an artificial 1% numeric limit contrary to express policy wording is ultra vires and unfair trade practice.'
    },
    {
      groundTitle: 'Ground 2: Wrongful Disallowance of Pre-operative Investigations (Disputed: ₹30,000)',
      policyClauseCited: 'Clause 4.3 (Emergency Medical & Diagnostic Investigations, Page 14)',
      medicalFact: 'Attending surgeon Dr. Vikramaditya Joshi has certified that the CT Abdomen and cardiac evaluation were critical emergency investigations to rule out gallbladder empyema/perforation before general anaesthesia.',
      legalOrIrdaPrecedent: 'In National Insurance Co. Ltd. vs Nitin Khandelwal (2008) and recent Ombudsman decisions (OMB/MUM/A/2023-24/0912), it has been reiterated that TPAs cannot override the clinical judgment of treating doctors regarding medical necessity.'
    }
  ],
  demandedReliefAmount: 80250,
  listOfEnclosures: [
    'Copy of Policy Schedule confirming "Single Private A/C Room" eligibility',
    'Discharge Summary confirming Room 412 (Standard Single Private AC Room)',
    'Detailed Hospital Inpatient Bill & Payment Receipt of ₹90,000 paid under protest',
    'Treating Surgeon’s Certificate of Medical Necessity for CT & emergency investigations',
    'City Care Hospital Room Tariff Certificate confirming Room 412 is base single private AC room'
  ],
  signatureName: 'Rahul Sharma',
  status: 'Draft'
};

export const DEMO_FOLLOW_UPS: FollowUpRecord[] = [
  {
    id: 'fu_01',
    claimId: 'clm_rahul_2026',
    type: 'Email',
    date: '2026-10-24 02:00 PM',
    recipient: 'grievance@starhealth.in, cashless@mediassistindia.com',
    subjectOrAgenda: 'Formal Appeal & Grievance: Claim Ref STAR-CLM-2026-MUM-89210 (Rahul Sharma)',
    contentOrScript: 'Dear Grievance Officer, Please find attached our formal representation disputing the wrongful deduction of ₹80,250 under Policy P/161112/01/2025/008431. As per IRDAI Guidelines 2020 on proportionate deductions and treating doctor certificate, we request immediate reimbursement of ₹80,250 within the statutory 15-day resolution window.',
    status: 'Scheduled'
  },
  {
    id: 'fu_02',
    claimId: 'clm_rahul_2026',
    type: 'Phone Call',
    date: '2026-10-25 11:00 AM',
    recipient: 'MediAssist TPA Escalation Desk (1800-425-2255)',
    subjectOrAgenda: 'Follow-up on Grievance Docket Number & TPA Re-adjudication status',
    contentOrScript: 'Good morning. I am calling regarding Claim Reference STAR-CLM-2026-MUM-89210 for patient Rahul Sharma. We have lodged an appeal with the Grievance Cell disputing the proportionate room rent deduction of ₹50,250 and diagnostic deduction of ₹30,000. Please confirm receipt of Dr. Joshi’s medical necessity certificate and docket tracking ID under IRDAI timeline.',
    status: 'Scheduled'
  }
];

export const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    title: 'Claim Dispute Analysis Ready',
    message: 'ClaimSathi AI identified ₹80,250 potentially wrongful deductions for Rahul Sharma with 88% win probability.',
    time: '10 mins ago',
    type: 'alert',
    read: false,
    actionRoute: 'denial'
  },
  {
    id: 'notif_02',
    title: 'Appeal Letter Generated',
    message: 'Formal 3-page appeal to Star Health Grievance Redressal Officer ready to preview and download.',
    time: '1 hour ago',
    type: 'info',
    read: false,
    actionRoute: 'appeal'
  },
  {
    id: 'notif_03',
    title: 'Pre-Authorisation Completed',
    message: 'Pre-auth form for City Care Hospital verified with 5 required medical attachments.',
    time: '2 days ago',
    type: 'success',
    read: true,
    actionRoute: 'preauth'
  }
];
