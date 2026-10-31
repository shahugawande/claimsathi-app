import { jsPDF } from 'jspdf';
import { PreAuthorisationForm, AppealLetter } from '../types';

export class PdfGeneratorService {
  /**
   * Generates and triggers download of IRDAI standard Pre-Authorisation Form PDF
   */
  public generatePreAuthPdf(data: PreAuthorisationForm): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryNavy = '#102A56';
    const royalBlue = '#2563EB';

    // Header Bar
    doc.setFillColor(16, 42, 86);
    doc.rect(0, 0, 210, 24, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CASHLESS PRE-AUTHORISATION REQUEST FORM', 14, 12);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('IRDAI Standardised Format for Cashless Hospitalisation | ClaimSathi AI Advocate Desk', 14, 18);

    // Metadata Bar
    doc.setFillColor(234, 242, 255);
    doc.rect(14, 28, 182, 10, 'F');
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`TPA / Insurer Ref: ${data.tpaId}`, 18, 34);
    doc.text(`Policy No: ${data.policyNumber}`, 90, 34);
    doc.text(`Date: ${data.generatedAt}`, 155, 34);

    let y = 46;

    // SECTION A: PATIENT & INSURED DETAILS
    doc.setFillColor(16, 42, 86);
    doc.rect(14, y, 182, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SECTION A: TO BE FILLED BY INSURED / PATIENT', 18, y + 5);

    y += 12;
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    const leftCol = 18;
    const rightCol = 110;

    doc.text(`Patient Full Name:`, leftCol, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.patientName}`, leftCol + 35, y);

    doc.setFont('helvetica', 'normal');
    doc.text(`Age / Gender:`, rightCol, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.age} Years / ${data.gender}`, rightCol + 25, y);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Contact Number:`, leftCol, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.contactNumber}`, leftCol + 35, y);

    doc.setFont('helvetica', 'normal');
    doc.text(`Room Category:`, rightCol, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.roomTypeRequested}`, rightCol + 25, y);

    y += 11;
    // SECTION B: HOSPITAL & TREATING DOCTOR DETAILS
    doc.setFillColor(16, 42, 86);
    doc.rect(14, y, 182, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SECTION B: TO BE FILLED BY TREATING HOSPITAL / DOCTOR', 18, y + 5);

    y += 12;
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    doc.text(`Hospital Name:`, leftCol, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.hospitalName}`, leftCol + 30, y);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Hospital Address:`, leftCol, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.hospitalAddress}`, leftCol + 30, y);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Treating Doctor:`, leftCol, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.treatingDoctorName}`, leftCol + 30, y);

    doc.setFont('helvetica', 'normal');
    doc.text(`Registration No:`, rightCol, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.doctorRegistrationNo}`, rightCol + 28, y);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Date of Admission:`, leftCol, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.dateOfAdmission}`, leftCol + 30, y);

    doc.setFont('helvetica', 'normal');
    doc.text(`Expected Stay:`, rightCol, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.estimatedHospitalStayDays} Days`, rightCol + 28, y);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Provisional Diagnosis:`, leftCol, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.provisionalDiagnosis} (ICD: ${data.icdCode})`, leftCol + 35, y);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Proposed Procedure:`, leftCol, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.proposedTreatment} [${data.treatmentType}]`, leftCol + 35, y);

    y += 12;
    // SECTION C: ESTIMATED COST BREAKUP
    doc.setFillColor(16, 42, 86);
    doc.rect(14, y, 182, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SECTION C: ESTIMATED EXPENSE BREAKUP (INR)', 18, y + 5);

    y += 11;
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');

    const breakdownItems = [
      ['Room & Boarding / Nursing Charges:', `₹ ${data.breakdown.roomRent.toLocaleString('en-IN')}`],
      ['Operation Theatre & Equipment Charges:', `₹ ${data.breakdown.otCharges.toLocaleString('en-IN')}`],
      ['Surgeon, Anaesthetist & Professional Fees:', `₹ ${data.breakdown.professionalFees.toLocaleString('en-IN')}`],
      ['Diagnostic & Laboratory Investigations:', `₹ ${data.breakdown.investigationFees.toLocaleString('en-IN')}`],
      ['Medicines & Surgical Consumables:', `₹ ${data.breakdown.medicinesAndConsumables.toLocaleString('en-IN')}`]
    ];

    breakdownItems.forEach(([label, val]) => {
      doc.text(label, leftCol, y);
      doc.text(val, rightCol + 50, y);
      y += 5.5;
    });

    // Total line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, y, 196, y);
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('TOTAL ESTIMATED EXPENSES:', leftCol, y);
    doc.setTextColor(37, 99, 235);
    doc.text(`₹ ${data.estimatedTotalExpense.toLocaleString('en-IN')}`, rightCol + 50, y);

    y += 10;
    // SECTION D: ENCLOSED DOCUMENTS
    doc.setFillColor(245, 247, 250);
    doc.rect(14, y, 182, 30, 'F');
    doc.setTextColor(16, 42, 86);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('DOCUMENTS ENCLOSED WITH PRE-AUTH SUBMISSION:', 18, y + 6);

    y += 11;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    data.requiredDocumentsChecklist.forEach((docItem, idx) => {
      const mark = docItem.attached ? '[X]' : '[  ]';
      const colX = idx < 3 ? 18 : 110;
      const rowY = y + (idx % 3) * 5;
      doc.text(`${mark} ${docItem.docName}`, colX, rowY);
    });

    // Footer signature line
    const footerY = 270;
    doc.setDrawColor(180, 180, 180);
    doc.line(20, footerY, 80, footerY);
    doc.line(130, footerY, 190, footerY);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Signature of Insured / Patient', 25, footerY + 5);
    doc.text('Treating Doctor & Hospital Seal', 135, footerY + 5);

    doc.save(`PreAuth_${data.patientName.replace(/\s+/g, '_')}_${data.claimId}.pdf`);
  }

  /**
   * Generates and triggers download of Legal Insurance Appeal Letter PDF
   */
  public generateAppealPdf(appeal: AppealLetter): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Header
    doc.setFillColor(16, 42, 86);
    doc.rect(0, 0, 210, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FORMAL REPRESENTATION & GRIEVANCE APPEAL', 14, 12);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Submitted under IRDAI Grievance Redressal Mechanism & Insurance Ombudsman Rules 2017', 14, 17);

    let y = 30;
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);

    // Date
    doc.setFont('helvetica', 'bold');
    doc.text(`Date: ${appeal.dateOfAppeal}`, 155, y);
    y += 6;

    // To Address
    doc.text('To,', 14, y);
    y += 5;
    doc.text(appeal.recipientName, 14, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.text(appeal.recipientDesignation, 14, y);
    y += 4.5;
    doc.text(appeal.insuranceCompany, 14, y);
    y += 4.5;
    doc.text(appeal.groAddress, 14, y, { maxWidth: 120 });
    y += 12;

    // Subject
    doc.setFillColor(234, 242, 255);
    doc.rect(14, y - 4, 182, 14, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 42, 86);
    doc.text(`SUBJECT: ${appeal.subject}`, 16, y, { maxWidth: 178 });
    y += 16;

    // Policy & Claim Details Box
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Policy No: ${appeal.policyNumber}  |  Claim Ref No: ${appeal.claimReferenceNumber}  |  Patient: ${appeal.patientName}`,
      14,
      y
    );
    y += 8;

    // Salutation & Intro
    doc.setFont('helvetica', 'normal');
    doc.text('Respected Sir/Madam,', 14, y);
    y += 6;

    doc.text(
      appeal.summaryOfEvents,
      14,
      y,
      { maxWidth: 182, align: 'justify' }
    );
    y += 24;

    // GROUNDS OF APPEAL
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 42, 86);
    doc.setFontSize(10);
    doc.text('SPECIFIC GROUNDS FOR RECONSIDERATION & REVERSAL:', 14, y);
    y += 7;

    appeal.groundsForAppeal.forEach((ground, idx) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(9);
      doc.text(ground.groundTitle, 14, y);
      y += 5;

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(70, 70, 70);
      doc.setFontSize(8.5);
      doc.text(`Policy Clause Cited: `, 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(ground.policyClauseCited, 46, y);
      y += 5;

      doc.setFont('helvetica', 'bold');
      doc.text(`Medical Fact: `, 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(ground.medicalFact, 36, y, { maxWidth: 160 });
      y += 10;

      doc.setFont('helvetica', 'bold');
      doc.text(`Statutory Precedent: `, 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(ground.legalOrIrdaPrecedent, 48, y, { maxWidth: 148 });
      y += 14;
    });

    // PRAYER / DEMAND
    doc.setFillColor(254, 243, 199);
    doc.rect(14, y - 3, 182, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text(
      `PRAYER FOR RELIEF: Kindly reverse wrongful disallowance and immediately release the balance claimed amount of INR ${appeal.demandedReliefAmount.toLocaleString('en-IN')} within 15 days as stipulated under IRDAI Protection of Policyholders' Interests Regulations.`,
      18,
      y + 2,
      { maxWidth: 174 }
    );
    y += 22;

    // Enclosures
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 42, 86);
    doc.setFontSize(9);
    doc.text('LIST OF ENCLOSED EVIDENTIARY DOCUMENTS:', 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8);
    appeal.listOfEnclosures.forEach((item, index) => {
      doc.text(`${index + 1}. ${item}`, 18, y);
      y += 4.5;
    });

    // Sign off
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Yours faithfully,', 14, y);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text(appeal.signatureName, 14, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('(Insured & Authorized Claimant)', 14, y + 4);

    doc.save(`Grievance_Appeal_${appeal.claimReferenceNumber}.pdf`);
  }
}

export const pdfGenerator = new PdfGeneratorService();
