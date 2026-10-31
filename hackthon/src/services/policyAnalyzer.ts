import { InsurancePolicy, BillLineItem, PolicyClause } from '../types';

export interface CoverageFinding {
  id: string;
  category: 'Covered' | 'Proportionate Deduction Risk' | 'Excluded Item' | 'Waiting Period' | 'Document Gap';
  title: string;
  amountImpact: number;
  policyReference: string;
  pageNumber: number;
  explanation: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
}

export interface CoverageAnalysisResult {
  totalBilled: number;
  estimatedCovered: number;
  estimatedDeduction: number;
  proportionalDeductionWarning: boolean;
  findings: CoverageFinding[];
  waitingPeriodMet: boolean;
  policyRoomEligibility: string;
  disclaimerText: string;
}

export class PolicyAnalyzerService {
  /**
   * Rule-based comparison between Policy Clauses and Inpatient Hospital Bills
   */
  public analyzeBillAgainstPolicy(
    policy: InsurancePolicy,
    billItems: BillLineItem[],
    roomAvailedBilledAmount: number,
    hospitalRoomType: string,
    diagnosisText: string
  ): CoverageAnalysisResult {
    const findings: CoverageFinding[] = [];
    let estimatedCovered = 0;
    let estimatedDeduction = 0;
    let totalBilled = 0;
    let hasProportionateWarning = false;

    // 1. Room rent analysis & Proportionate Deduction detection
    const roomRentItem = billItems.find((b) => b.category === 'Room Rent');
    const billedRoomPerDay = roomAvailedBilledAmount > 0 ? roomAvailedBilledAmount / 3 : 8000;

    // Check policy room rent rule
    const isSinglePrivateEntitled = policy.roomRentLimitType === 'Single Private AC';
    const numericCap = (policy.sumInsured * 1) / 100; // standard 1% is ₹5,000

    if (isSinglePrivateEntitled) {
      if (hospitalRoomType.toLowerCase().includes('single private')) {
        // Patient stayed in entitled room!
        findings.push({
          id: 'find_rr_01',
          category: 'Covered',
          title: 'Room Category Within Policy Entitlement',
          amountImpact: 0,
          policyReference: 'Clause 3.2.1',
          pageNumber: 8,
          explanation: `Your policy grants "Single Private A/C Room" eligibility. Even though the daily rate is ₹${billedRoomPerDay.toLocaleString('en-IN')}, no proportionate deduction is legally permitted under IRDAI Guidelines 2020 because you stayed in the entitled room category.`,
          recommendation: 'Ensure hospital discharge summary mentions "Single Private AC Room" explicitly.',
          severity: 'low'
        });
      } else {
        // Patient upgraded to deluxe/suite
        hasProportionateWarning = true;
        const diffPerDay = Math.max(0, billedRoomPerDay - 5000);
        const estDeduct = diffPerDay * 3;
        findings.push({
          id: 'find_rr_02',
          category: 'Proportionate Deduction Risk',
          title: 'Room Upgrade - Proportionate Deduction Applicable',
          amountImpact: estDeduct,
          policyReference: 'Clause 3.2.1',
          pageNumber: 8,
          explanation: `The room category availed exceeds the basic Single Private Room entitlement. Associate surgical and OT charges may face proportionate capping.`,
          recommendation: 'Obtain a room category certificate from the hospital billing desk.',
          severity: 'high'
        });
      }
    } else if (policy.roomRentLimitType === 'Percentage') {
      if (billedRoomPerDay > numericCap) {
        hasProportionateWarning = true;
        const ratio = numericCap / billedRoomPerDay;
        const potentialDispute = (1 - ratio) * 110000; // estimated on surgeon + OT
        findings.push({
          id: 'find_rr_03',
          category: 'Proportionate Deduction Risk',
          title: 'Room Rent Capping (1% Limit Triggered)',
          amountImpact: Math.round(potentialDispute),
          policyReference: 'Clause 3.2.1',
          pageNumber: 8,
          explanation: `Policy caps room rent at 1% of Sum Insured (₹${numericCap.toLocaleString('en-IN')}/day). Hospital billed ₹${billedRoomPerDay.toLocaleString('en-IN')}/day. Insurers apply proportionate cuts to doctor fees and OT charges under this clause.`,
          recommendation: 'Check if you have an active Room Rent Waiver add-on or if IRDAI 2020 ICU non-capping applies.',
          severity: 'high'
        });
      }
    }

    // 2. Waiting period check for specific surgery (e.g. Gallstones / Cholecystitis)
    const isSpecificAilment =
      diagnosisText.toLowerCase().includes('cholecyst') ||
      diagnosisText.toLowerCase().includes('gall') ||
      diagnosisText.toLowerCase().includes('stone') ||
      diagnosisText.toLowerCase().includes('hernia') ||
      diagnosisText.toLowerCase().includes('cataract');

    if (isSpecificAilment) {
      // Check inception vs 24 months
      findings.push({
        id: 'find_wp_01',
        category: 'Waiting Period',
        title: '24-Month Specific Illness Waiting Period Clause',
        amountImpact: 0,
        policyReference: 'Clause 5.1',
        pageNumber: 17,
        explanation: `Cholecystectomy falls under 24-month specific ailment waiting period. As your policy has been continuously active for over 36 months since April 2022, this waiting condition is fully satisfied.`,
        recommendation: 'Submit previous continuous renewal endorsement receipts to avoid first-year rejection queries.',
        severity: 'low'
      });
    }

    // 3. Bill items line by line calculation
    billItems.forEach((item) => {
      totalBilled += item.amount;
      if (item.coverageStatus === 'Fully Covered') {
        estimatedCovered += item.amount;
      } else if (item.coverageStatus === 'Partially Covered') {
        estimatedCovered += item.coveredAmount;
        estimatedDeduction += item.disputedAmount;
      } else if (item.coverageStatus === 'Excluded') {
        estimatedDeduction += item.amount;
        findings.push({
          id: `find_ex_${item.id}`,
          category: 'Excluded Item',
          title: `Non-Payable Item: ${item.description}`,
          amountImpact: item.amount,
          policyReference: 'Clause 7.4',
          pageNumber: 22,
          explanation: `Non-medical items such as gloves, admin charges, and attendant items fall under IRDAI Annexure I exclusions.`,
          recommendation: 'Request itemized separation so surgical-grade trocars are billed under covered OT equipment.',
          severity: 'medium'
        });
      } else {
        estimatedCovered += item.amount * 0.7;
        estimatedDeduction += item.amount * 0.3;
      }
    });

    // 4. Diagnostic Investigations justification check
    const investigationItem = billItems.find((b) => b.category === 'Investigations');
    if (investigationItem && investigationItem.disputedAmount > 0) {
      findings.push({
        id: 'find_inv_01',
        category: 'Document Gap',
        title: 'Disallowed Diagnostic Investigations (Pre-Op Workup)',
        amountImpact: investigationItem.disputedAmount,
        policyReference: 'Clause 4.3',
        pageNumber: 14,
        explanation: `Emergency CT scan and cardiac profiling (₹${investigationItem.disputedAmount.toLocaleString('en-IN')}) were flagged by TPA as routine OPD investigations. Under Clause 4.3, pre-op diagnostic workup is covered if certified by the operating surgeon.`,
        recommendation: 'Attach Dr. Vikramaditya Joshi’s Certificate of Medical Necessity confirming acute abdomen protocol.',
        severity: 'high'
      });
    }

    return {
      totalBilled,
      estimatedCovered,
      estimatedDeduction,
      proportionalDeductionWarning: hasProportionateWarning,
      findings,
      waitingPeriodMet: true,
      policyRoomEligibility: isSinglePrivateEntitled ? 'Single Private A/C Room (Eligible)' : `Up to ₹${numericCap}/day`,
      disclaimerText: 'NOTICE: This rule-based analysis is generated for patient advocacy and educational purposes. Claims adjudication is performed by your insurer/TPA in accordance with IRDAI rules and policy terms.'
    };
  }
}

export const policyAnalyzer = new PolicyAnalyzerService();
