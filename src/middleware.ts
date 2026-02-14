// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Admin routes are protected by client-side AuthGuard component
  // Token verification happens in AuthGuard.tsx using localStorage
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
}
