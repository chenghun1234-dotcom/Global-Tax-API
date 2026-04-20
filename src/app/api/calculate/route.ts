import { NextRequest, NextResponse } from 'next/server';
import { calculateTax, TaxCalculationRequest } from '@/lib/tax-engine';

export async function POST(request: NextRequest) {
  try {
    const body: TaxCalculationRequest = await request.json();

    if (!body.buyer_loc || !body.amount) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'buyer_loc and amount are required' },
        { status: 400 }
      );
    }

    const result = calculateTax(body);

    return NextResponse.json({
      status: 'success',
      result: {
        tax_amount: result.tax_amount,
        currency: body.currency,
        nexus_hit: result.nexus_threshold_hit,
        rate: result.vat_rate,
        legal_nexus: result.legal_nexus_text,
        action: result.action_required
      }
    });
  } catch (e) {
    return NextResponse.json(
      { error: 'Bad Request', message: 'Invalid JSON body' },
      { status: 400 }
    );
  }
}
