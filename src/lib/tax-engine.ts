import taxData from '../data/tax-rules.json';

export interface TaxCalculationRequest {
  vendor_loc: string; // e.g. "US", "KR"
  buyer_loc: string; // e.g. "US", "JP"
  buyer_state?: string; // e.g. "CA", "NY" (required for US)
  amount: number;
  currency: string;
  product_type: 'digital_service' | 'physical_good' | 'ebook';
  annual_sales?: number; // Total sales in the buyer's region for nexus check
  annual_transactions?: number;
}

export interface TaxCalculationResult {
  vat_rate: number;
  tax_amount: number;
  nexus_threshold_hit: boolean;
  legal_nexus_text: string;
  action_required: string;
  last_updated: string;
}

export function calculateTax(req: TaxCalculationRequest): TaxCalculationResult {
  const { buyer_loc, buyer_state, amount, annual_sales = 0, annual_transactions = 0 } = req;
  const regions = taxData.regions as any;
  
  let rate = 0;
  let nexusHit = false;
  let legalText = "General VAT/Sales Tax rules apply.";
  let action = "Collect tax as per local regulations.";

  // 1. EU Logic
  if (buyer_loc === 'EU' || (regions.EU && buyer_loc in regions.EU)) {
    rate = regions.EU.standard_rate;
    nexusHit = true; // For non-EU sellers, threshold is 0
    legalText = regions.EU.rules.b2c_digital;
    action = "Register for Non-Union OSS and remit VAT quarterly.";
  } 
  // 2. Japan Logic
  else if (buyer_loc === 'JP') {
    rate = regions.JP.rate;
    const threshold = regions.JP.threshold_revenue;
    nexusHit = annual_sales >= threshold;
    legalText = regions.JP.invoice_system;
    action = nexusHit ? "JCT Registration required." : "Tax exempt if under 10M JPY threshold.";
  }
  // 3. Korea Logic
  else if (buyer_loc === 'KR') {
    rate = regions.KR.rate;
    nexusHit = true; // 0 threshold for digital services
    legalText = regions.KR.rules.b2c_digital;
    action = "Simplified VAT registration (HomeTax) required.";
  }
  // 4. US Logic (State Level)
  else if (buyer_loc === 'US' && buyer_state) {
    const stateData = regions.US.states[buyer_state];
    if (stateData) {
      rate = stateData.rate;
      const revThreshold = stateData.threshold_revenue;
      const txThreshold = stateData.threshold_transactions;
      
      // Check if revenue OR transaction threshold is hit
      const revHit = revThreshold > 0 && annual_sales >= revThreshold;
      const txHit = txThreshold > 0 && annual_transactions >= txThreshold;
      
      nexusHit = revHit || txHit;
      
      if (stateData.rate === 0) {
        legalText = `${stateData.name} has no statewide sales tax.`;
        action = "No action required.";
      } else if (!stateData.digital_taxable) {
        rate = 0;
        legalText = `Digital services are currently non-taxable in ${stateData.name}.`;
        action = "Monitor for legislative changes.";
      } else {
        legalText = `Economic Nexus threshold in ${stateData.name} is $${revThreshold}${txThreshold ? ` or ${txThreshold} tx` : ''}.`;
        action = nexusHit ? "Registration and tax collection required." : "Under threshold. No immediate action.";
      }
    }
  }

  return {
    vat_rate: rate,
    tax_amount: amount * rate,
    nexus_threshold_hit: nexusHit,
    legal_nexus_text: legalText,
    action_required: action,
    last_updated: taxData.last_updated
  };
}
