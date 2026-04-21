import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // 1. Handle CORS Preflight (OPTIONS)
  if (request.method === 'OPTIONS') {
    const preflightHeaders = {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, X-RapidAPI-Key',
      'Access-Control-Max-Age': '86400',
    };
    return new NextResponse(null, { status: 204, headers: preflightHeaders });
  }

  // 2. API Key Validation
  const apiKey = request.headers.get('X-API-Key') || request.headers.get('X-RapidAPI-Key');
  const path = request.nextUrl.pathname;

  // Only protect /api routes (except /api/health)
  if (path.startsWith('/api/') && !path.startsWith('/api/health') && !apiKey) {
    return new NextResponse(
      JSON.stringify({ 
        error: 'Unauthorized', 
        message: 'Missing API Key. Use X-API-Key header.' 
      }),
      { 
        status: 401, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '*' 
        } 
      }
    );
  }

  // 3. Set CORS Headers for standard responses
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', origin || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, X-RapidAPI-Key');

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
