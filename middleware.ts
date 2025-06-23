import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Détection de Safari
  const userAgent = request.headers.get('user-agent') || '';
  const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
  
  // Headers spéciaux pour Safari
  if (isSafari) {
    response.headers.set('X-Accel-Buffering', 'no');
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Transfer-Encoding', 'chunked');
  }
  
  // Headers génériques pour le streaming
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
