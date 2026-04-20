import { NextRequest, NextResponse } from 'next/server';
import { calculateTax } from '@/lib/tax-engine';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');
  const state = searchParams.get('state') || undefined;

  if (!country) {
    return NextResponse.json(
      { error: 'Bad Request', message: 'country parameter is required' },
      { status: 400 }
    );
  }

  // Reuse the internal tax engine logic
  const result = calculateTax({
    vendor_loc: 'KR', // Default or from config
    buyer_loc: country,
    buyer_state: state,
    amount: 1, // Rate lookup only
    currency: 'USD',
    product_type: 'digital_service',
  });

  return NextResponse.json({
    status: 'success',
    data: {
      country,
      state,
      rate: result.vat_rate,
      last_updated: result.last_updated
    }
  });
}
