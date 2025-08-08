import { NextResponse, NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    console.log('middle')
  return NextResponse.redirect(new URL('/admin/login', request.url))
}
 
export const config = {
  matcher: '/admin',
}