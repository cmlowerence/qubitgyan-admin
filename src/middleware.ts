import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Check if user is trying to access /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // 2. Unfortunately, we can't read LocalStorage in middleware (server-side).
    // However, if you are strictly using LocalStorage, we must handle this on the Client.
    // BUT, for a better UX, we can check for a cookie if you had one.
    // Since we are using LocalStorage, we will fallback to a Client-Side Guard in the layout.
    
    // For now, let's just pass through. The real protection will be in the layout check below.
    return NextResponse.next();
  }
}
